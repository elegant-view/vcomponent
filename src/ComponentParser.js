/**
 * @file 组件解析器。
 *       以`ui-`开头的标签都是组件标签。
 *       组件解析器实例包含的比较重要的几个属性：
 *       - 1、$$props ：组件属性的表达式函数和节点更新函数
 *           - 1、$$props[expr].exprFn ：计算表达式值的函数，类型是`function(ScopeModel):*`；
 *           - 2、$$props[expr].updateFns ：根据表达式值去更新dom的函数数组，类型是`[function(*)]`。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

// import ExprParser from 'vtpl/src/parsers/ExprParser';
import ExprParserEnhance from './ExprParserEnhance';
import {line2camel, bind, getSuper, camel2line, distinctArr, forEach} from './utils';
import ComponentManager from './ComponentManager';
import Node from 'vtpl/src/nodes/Node';
import componentState from './componentState';
import Children from './data/Children';

class ComponentParser extends ExprParserEnhance {
    constructor(options) {
        super(options);

        this.$$componentTree = null;
        this.$$componentCssClassName = null;
        this.$component = null;
        this.$$ref = null;
    }

    createComponent() {
        let componentName = line2camel(this.node.getTagName().replace('ui', ''));
        let ComponentClass = this.tree.getTreeVar('componentManager').getClass(componentName);
        if (!ComponentClass) {
            throw new Error(`the component \`${componentName}\` is not registed!`);
        }

        this.$component = new ComponentClass();
        this.$component.$$state = componentState.INITIALIZING;

        this.$$componentCssClassName = this.getCssClassName(ComponentClass);

        this.$$updatePropFns = {};
    }

    // 必须在组件创建之后
    createComponentTree() {
        let nodesManager = this.tree.getTreeVar('nodesManager');
        let fragment = nodesManager.createDocumentFragment();
        let tagName = this.node.getTagName();

        fragment.setInnerHTML(
            `<!-- ${tagName} -->${this.$component.getTemplate()}<!-- /${tagName} -->`
        );

        this.startNode = fragment.getFirstChild();
        this.endNode = fragment.getLastChild();

        this.$$componentTree = this.tree.createTree({
            startNode: this.startNode,
            endNode: this.endNode
        });

        this.$$componentTree.rootScope.set({props: this.$component.props, state: this.$component.state});

        // 记录下children
        this.setProp('children', new Children(
            this.node.getFirstChild(), this.node.getLastChild(), this.tree
        ));

        this.$$componentTree.setParent(this.tree);

        // 用于存放当前组件下的子组件
        this.$$componentTree.setTreeVar('children', this.$component.refs);
    }

    /**
     * d-rest是一个特殊属性
     */
    collectExprs() {
        this.createComponent();
        this.createComponentTree();
        this.registerComponents();

        // 组件本身就有的css类名
        this.setProp('class', this.$$componentCssClassName);

        // 将scope注入到component里面去
        this.$component.$$scopeModel = this.$$componentTree.rootScope;

        let config = this.tree.getTreeVar('config');
        let exprWacther = this.tree.getExprWatcher();
        let curNode = this.node;
        let attributes = curNode.getAttributes();
        let attrs = {};
        for (let i = 0, il = attributes.length; i < il; i++) {
            let attr = attributes[i];
            let attrValue = attr.nodeValue;
            let attrName = attr.nodeName;

            attrs[line2camel(attrName)] = true;

            // 对于含有表达式的prop，把表达式记录下来，并且生成相应的表达式值计算函数和prop更新函数。
            if (config.getExprRegExp().test(attrValue)) {
                exprWacther.addExpr(attrValue);
                exprWacther.setExprEqualsFn(attrValue, bind(this.shouldUpdate, this));
                exprWacther.setExprCloneFn(attrValue, bind(this.cloneExpressionObject, this));

                let updateFns = this.$$updatePropFns[attrValue] || [];
                attrName === 'd-rest'
                    ? updateFns.push(value => this.setRestProps(value, attrs))
                    : updateFns.push(bind(this.setProp, this, attrName));
                this.$$updatePropFns[attrValue] = updateFns;
            }
            // 对于字面量prop，直接设置到$component.props里面去
            else {
                this.setProp(attrName, attrValue);
            }
        }

        // 子树先compile完，再把整棵树插入到DOM中
        this.$$componentTree.compile();
        insertComponentNodes(this.node, this.startNode, this.endNode);

        this.node = null;

        // 给component扩展两个控制表达式监测的方法
        this.$component.suspendExpr = function (expr) {
            exprWacther.suspendExpr(expr);
        };
        this.$component.resumeExpr = function (expr) {
            exprWacther.resumeExpr(expr);
        };

        // 把组件节点放到 DOM 树中去
        function insertComponentNodes(componentNode, startNode, endNode) {
            let parentNode = componentNode.getParentNode();

            let delayFns = [];
            for (let curNode = startNode;
                curNode && !curNode.isAfter(endNode);
                curNode = curNode.getNextSibling()
            ) {
                delayFns.push(bind(insert, null, curNode));
            }
            for (let i = 0, il = delayFns.length; i < il; ++i) {
                delayFns[i]();
            }

            componentNode.remove();

            function insert(curNode) {
                parentNode.insertBefore(curNode, componentNode);
            }
        }
    }

    linkScope() {
        let exprWacther = this.tree.getExprWatcher();

        this.$$componentTree.link();

        this.$$componentTree.rootScope.setParent(this.tree.rootScope);
        this.tree.rootScope.addChild(this.$$componentTree.rootScope);

        exprWacther.on('change', event => {
            if (this.isGoDark) {
                return;
            }

            let updateFns = this.$$updatePropFns[event.expr];
            if (updateFns && updateFns.length) {
                forEach(updateFns, fn => fn(event.newValue));
            }
        });
    }

    initRender() {
        let exprWacther = this.tree.getExprWatcher();
        // 初始化一下界面
        forEach(this.$component.props, (value, key) => {
            this.setProp(key, value);
        });

        forEach(this.$$updatePropFns, (updateFns, expr) => {
            forEach(updateFns, fn => fn(exprWacther.calculate(expr)));
        });

        this.$$componentTree.initRender();

        // 到此处，组件应该就初始化完毕了。
        this.$component.$$state = componentState.READY;
        this.$component.ready();
    }

    setRestProps(value, attrs) {
        if (!value || typeof value !== 'object') {
            return;
        }

        for (let key in value) {
            if (!(key in attrs)) {
                this.setProp(key, value[key]);
            }
        }
    }

    /**
     * 设置prop，不会更新DOM
     *
     * @public
     * @param {string} name  prop名字
     * @param {*} value prop值
     */
    setProp(name, value) {
        name = line2camel(name);

        if (name === 'ref') {
            this.$$ref = value;
            // 把当前组件存放到父组件的treeVar里面去
            let childComponents = this.tree.getTreeVar('children');
            childComponents[this.$$ref] = this.$component;
            return;
        }

        if (name === 'class') {
            let classList = Node.getClassList(value);
            classList = this.$$componentCssClassName.concat(classList || []);
            classList = distinctArr(classList, cls => cls);

            set.call(this, this.$$componentTree.rootScope, name, classList);
            return;
        }

        set.call(this, this.$$componentTree.rootScope, name, value);

        function set(scopeModel, name, value) {
            let props = scopeModel.get('props');
            props[name] = value;
            scopeModel.set('props', props);

            if (this.$component
                && (this.$component.$$state === componentState.READY)
            ) {
                this.$component.propsChange();
            }
        }
    }

    /**
     * 获取开始节点
     *
     * @protected
     * @inheritDoc
     * @return {Node}
     */
    getStartNode() {
        if (this.node) {
            return this.node;
        }
        return this.startNode;
    }

    /**
     * 获取结束节点
     *
     * @protected
     * @inheritDoc
     * @return {Node}
     */
    getEndNode() {
        // 如果node还存在，说明组件标签还没有被模板所替换，此时的结束节点还应该是node
        if (this.node) {
            return this.node;
        }
        return this.endNode;
    }

    getScope() {
        return this.tree.rootScope;
    }

    registerComponents() {
        let componentManager = this.tree.getTreeVar('componentManager');
        let curComponentManager = new ComponentManager();
        curComponentManager.setParent(componentManager);

        if (this.$component.getComponentClasses instanceof Function) {
            curComponentManager.register(this.$component.getComponentClasses());
        }

        this.$$componentTree.setTreeVar('componentManager', curComponentManager);
    }

    destroy() {
        this.$component.destroy();
        this.$component.$$state = componentState.DESTROIED;
        ExprParser.prototype.destroy.apply(this, arguments);
    }

    /**
     * 获取组件css类名
     *
     * @private
     * @param {Class} ComponentClass 组件类
     * @return {Array<string>} 组件css类名
     */
    getCssClassName(ComponentClass) {
        let name = [];
        for (let curCls = ComponentClass; curCls; curCls = getSuper(curCls)) {
            let curName = curCls.name;
            name.push(camel2line(curName));

            // 最多到组件基类
            if (curName === 'Component') {
                break;
            }
        }
        return name;
    }

    getChildNodes() {
        return [];
    }

    goDark() {
        if (this.isGoDark) {
            return;
        }
        this.$$componentTree.goDark();
        this.isGoDark = true;
    }

    restoreFromDark() {
        if (!this.isGoDark) {
            return;
        }
        this.$$componentTree.restoreFromDark();
        this.isGoDark = false;
    }

     /**
     * 只处理组件
     *
     * @static
     * @param {Node} node DOM节点
     * @return {boolean}
     */
    static isProperNode(node) {
        let nodeType = node.getNodeType();
        if (nodeType !== Node.ELEMENT_NODE) {
            return false;
        }

        let tagName = node.getTagName();
        return tagName.indexOf('ui-') === 0;
    }
}

export default ComponentParser;
