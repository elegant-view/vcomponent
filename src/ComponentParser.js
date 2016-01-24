/**
 * @file 组件解析器。
 *       以`ui-`开头的标签都是组件标签。
 *       组件解析器实例包含的比较重要的几个属性：
 *       - 1、$$props ：组件属性的表达式函数和节点更新函数
 *           - 1、$$props[expr].exprFn ：计算表达式值的函数，类型是`function(ScopeModel):*`；
 *           - 2、$$props[expr].updateFns ：根据表达式值去更新dom的函数数组，类型是`[function(*)]`。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import ExprParser from 'vtpl/src/parsers/ExprParser';
import Tree from 'vtpl/src/trees/Tree';
import {line2camel, bind, getSuper, camel2line, distinctArr} from './utils';
import ComponentManager from './ComponentManager';
import Node from 'vtpl/src/nodes/Node';
import DirtyChecker from 'vtpl/src/DirtyChecker';
import componentState from './componentState';

class ComponentParser extends ExprParser {
    constructor(options) {
        super(options);

        var componentName = line2camel(this.node.getTagName().replace('ui', ''));
        var ComponentClass = this.tree.getTreeVar('componentManager').getClass(componentName);
        if (!ComponentClass) {
            throw new Error(`the component \`${componentName}\` is not registed!`);
        }

        this.$component = new ComponentClass();
        this.$component.$$state = componentState.INITIALIZING;

        this.$component.$$parser = this;
        this.$$propsOldValue = {};
        this.$$props = {};
        this.$$componentCssClassName = this.getCssClassName(ComponentClass);
        this.$$ref = null;

        // 组件本身就有的css类名
        this.setProp('class', this.$$componentCssClassName);

        this.$$parentTree = options.tree;
        this.mount(options.tree);
    }

    mount() {
        var nodesManager = this.$$parentTree.getTreeVar('nodesManager');
        var div = nodesManager.createElement('div');
        var tagName = this.node.getTagName();
        div.setInnerHTML(
            `<!-- ${tagName} -->${this.$component.getTemplate()}<!-- /${tagName} -->`
        );

        this.startNode = div.getFirstChild();
        this.endNode = div.getLastChild();

        this.tree = new Tree({
            startNode: this.startNode,
            endNode: this.endNode
        });

        // 记录下children
        this.setProp('children', {
            $$type: 'CHILDREN',
            startNode: this.node.getFirstChild(),
            endNode: this.node.getLastChild(),
            parentTree: this.$$parentTree
        });

        this.tree.setParent(this.$$parentTree);
        this.registerComponents();

        // 设置默认脏检测器，接管this.tree下面（也就是当前组件下面，子孙组件外面）所有表达式的脏检测。
        let dirtyChecker = new DirtyChecker();
        this.tree.setTreeVar('dirtyChecker', dirtyChecker);
        dirtyChecker.setDefaultChecker((expr, exprValue, exprOldValue) => {
            return this.$component.shouldUpdate(expr, exprValue, exprOldValue);
        });

        // 用于存放当前组件下的子组件
        this.tree.setTreeVar('children', this.$component.refs);
    }

    collectExprs() {
        var config = this.tree.getTreeVar('config');
        var curNode = this.node;
        var attributes = curNode.getAttributes();
        for (var i = 0, il = attributes.length; i < il; i++) {
            var attr = attributes[i];

            var attrValue = attr.nodeValue;
            var attrName = attr.nodeName;
            // 对于含有表达式的prop，把表达式记录下来，并且生成相应的表达式值计算函数和prop更新函数。
            if (config.getExprRegExp().test(attrValue)) {
                var updateFn = bind(this.setProp, this, attrName);
                this.addExpr(this.$$props, attrValue, updateFn, attrName);
            }
            // 对于字面量prop，直接设置到$component.props里面去
            else {
                this.setProp(attrName, attrValue);
            }
        }

        this.tree.compile();
        insertComponentNodes(this.node, this.startNode, this.endNode);
        this.node = null;

        // 把组件节点放到 DOM 树中去
        function insertComponentNodes(componentNode, startNode, endNode) {
            var parentNode = componentNode.getParentNode();

            var delayFns = [];
            for (var curNode = startNode;
                curNode && !curNode.isAfter(endNode);
                curNode = curNode.getNextSibling()
            ) {
                delayFns.push(bind(insert, null, curNode));
            }
            for (var i = 0, il = delayFns.length; i < il; ++i) {
                delayFns[i]();
            }

            componentNode.remove();

            function insert(curNode) {
                parentNode.insertBefore(curNode, componentNode);
            }
        }
    }

    linkScope() {
        this.tree.link();

        this.tree.rootScope.set('props', this.$component.props.get());
        this.tree.rootScope.set('state', this.$component.state.get());

        // 在父级数据变化的时候更新$component.props
        this.listenToChange(this.tree.$parent.rootScope, event => {
            this.renderToDom(event.changes);
        });

        // 在$component.props数据变化的时候更新一下this.tree.rootScope，以便触发组件内的界面更新
        this.$component.props.on('change', event => {
            this.$component.$$state = componentState.BEFORE_RENDER;
            this.$component.beforeRender();
            this.$component.$$state = componentState.READY;

            // 这句代码会引起控件内树的更新
            this.tree.rootScope.set({
                props: this.$component.props.get(),
                state: this.$component.state.get()
            });
        });

        // 到此处可以计算一下$$props里面存放的表达式的值了，对于计算出来的值，放到$component.props里面去。
        // 这一句代码一定要放在上一段代码的后面，为啥呢？因为此处引起的变化要反映到子树中去，这才叫做`renderToDom`。
        this.renderToDom();

        // $component.state只能够在组件内部被修改，反映组件的状态。
        // 当$component.state被用户改变的时候，应该触发this.tree.rootScope的change事件，
        // 以便触发组件内的界面更新
        this.$component.state.on('change', event => {
            this.$component.$$state = componentState.BEFORE_RENDER;
            this.$component.beforeRender();
            this.$component.$$state = componentState.READY;

            this.tree.rootScope.set('state', this.$component.state.get());
        });

        // 到此处，组件应该就初始化完毕了。
        this.$component.$$state = componentState.READY;
        this.$component.ready();
    }

    renderToDom(changes) {
        if (this.isGoDark) {
            return;
        }

        this.renderChanges(
            this.$$props,
            this.$$propsOldValue,
            this.tree.$parent.rootScope,
            changes
        );
    }

    /**
     * 添加表达式
     *
     * @protected
     * @param {Object} mountObj 表达式挂靠的对象
     * @param {string} expr     原始表达式字符串
     * @param {function(*)} updateFn 根据表达式计算值更新DOM的函数
     * @param {string} attrName 要更新的prop名
     */
    addExpr(mountObj, expr, updateFn, attrName) {
        if (!mountObj[expr]) {
            var calculaterObj = this.createExprFn(expr);
            this.addParamName2ExprMap(calculaterObj.paramNames, expr);

            var pureExprFn = calculaterObj.fn;
            var me = this;
            mountObj[expr] = {
                exprFn(scopeModel) {
                    var exprValue = pureExprFn(scopeModel);
                    me.setProp(attrName, exprValue);
                    return exprValue;
                },
                updateFns: [updateFn]
            };
        }
        else {
            mountObj[expr].updateFns.push(updateFn);
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
            let childComponents = this.$$parentTree.getTreeVar('children');
            childComponents[this.$$ref] = this.$component;
            return;
        }

        if (name === 'class') {
            var classList = Node.getClassList(value);
            classList = this.$$componentCssClassName.concat(classList || []);
            classList = distinctArr(classList, cls => cls);
            this.$component.props.set('class', classList);
            return;
        }

        this.$component.props.set(name, value);
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
        var componentManager = this.$$parentTree.getTreeVar('componentManager');
        var curComponentManager = new ComponentManager();
        curComponentManager.setParent(componentManager);

        if (this.$component.getComponentClasses instanceof Function) {
            curComponentManager.register(this.$component.getComponentClasses());
        }

        this.tree.setTreeVar('componentManager', curComponentManager);
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
     * @return {string} 组件css类名
     */
    getCssClassName(ComponentClass) {
        var name = [];
        for (var curCls = ComponentClass; curCls; curCls = getSuper(curCls)) {
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
        this.tree.goDark();
        this.isGoDark = true;
    }

    restoreFromDark() {
        this.tree.restoreFromDark();
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
        var nodeType = node.getNodeType();
        if (nodeType !== Node.ELEMENT_NODE) {
            return false;
        }

        var tagName = node.getTagName();
        return tagName.indexOf('ui-') === 0;
    }
}

Tree.registeParser(ComponentParser);
export default ComponentParser;
