/**
 * @file 组件解析器。
 *       以`ui-`开头的标签都是组件标签。
 *       组件解析器实例包含的比较重要的几个属性：
 *       - 1、$$props ：组件属性的表达式函数和节点更新函数
 *           - 1、$$props[expr].exprFn ：计算表达式值的函数，类型是`function(ScopeModel):*`；
 *           - 2、$$props[expr].updateFns ：根据表达式值去更新dom的函数数组，类型是`[function(*)]`。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import ExprParserEnhance from './ExprParserEnhance';
import {line2camel, getSuper, camel2line, distinctArr} from './utils';
import ComponentManager from './ComponentManager';
import Node from 'vtpl/nodes/Node';
import componentState from './componentState';
import Children from './data/Children';
import Tree from 'vtpl/trees/Tree';
import DoneChecker from 'vtpl/DoneChecker';

const CREATE_COMPONENT_TREE = Symbol('createComponentTree');
const CREATE_COMPONENT = Symbol('createComponent');
const REGISTER_COMPONENTS = Symbol('registerComponents');
const COMPONENT_TREE = Symbol('componentTree');
const COMPONENT_CSS_CLASS_NAME = Symbol('componentCssClassName');
const COMPONENT = Symbol('component');
const UPDATE_PROPERTY_FUNCTIONS = Symbol('updatePropertyFunctions');
const COMPONENT_NODE = Symbol('componentNode');

export default class ComponentParser extends ExprParserEnhance {
    constructor(options) {
        super(options);

        this[COMPONENT_TREE] = null;
        this[COMPONENT_CSS_CLASS_NAME] = null;
        this[COMPONENT] = null;

        this[COMPONENT_NODE] = this.startNode;
    }

    [CREATE_COMPONENT]() {
        const node = this[COMPONENT_NODE];
        let componentName = line2camel(node.getTagName().replace('ui', ''));
        let ComponentClass = this.tree.getTreeVar('componentManager').getClass(componentName);
        if (!ComponentClass) {
            throw new Error(`the component \`${componentName}\` is not registed!`);
        }

        this[COMPONENT] = new ComponentClass();
        this[COMPONENT].$$state = componentState.INITIALIZING;
        this[COMPONENT_CSS_CLASS_NAME] = this.getCssClassName(ComponentClass);
        this[UPDATE_PROPERTY_FUNCTIONS] = {};
    }

    // 必须在组件创建之后
    [CREATE_COMPONENT_TREE]() {
        const node = this[COMPONENT_NODE];
        const nodesManager = this.getNodesManager();
        const fragment = nodesManager.createDocumentFragment();
        const tagName = node.getTagName();

        fragment.setInnerHTML(
            `<!-- ${tagName} -->${this[COMPONENT].getTemplate()}<!-- /${tagName} -->`
        );

        this.startNode = fragment.getFirstChild();
        this.endNode = fragment.getLastChild();

        this[COMPONENT_TREE] = Tree.createTree({startNode: this.startNode, endNode: this.endNode});

        this[COMPONENT_TREE].rootScope.set({
            props: this[COMPONENT].props,
            state: this[COMPONENT].state
        });

        // 记录下children
        const children = new Children(
            node.getFirstChild(),
            node.getLastChild(),
            this.tree
        );
        this.setProp('children', children);

        this[COMPONENT_TREE].setParent(this.tree);

        // 用于存放当前组件下的子组件
        this[COMPONENT_TREE].setTreeVar('children', this[COMPONENT].refs);
    }

    /**
     * d-rest是一个特殊属性
     */
    collectExprs() {
        this[CREATE_COMPONENT]();
        this[CREATE_COMPONENT_TREE]();
        this[REGISTER_COMPONENTS]();

        // 组件本身就有的css类名
        this.setProp('class', this[COMPONENT_CSS_CLASS_NAME]);

        // 将scope注入到component里面去
        this[COMPONENT].$$scopeModel = this[COMPONENT_TREE].rootScope;

        let config = this.getConfig();
        let exprWacther = this.getExpressionWatcher();
        let curNode = this[COMPONENT_NODE];
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

                let updateFns = this[UPDATE_PROPERTY_FUNCTIONS][attrValue] || [];
                attrName === 'd-rest'
                    ? updateFns.push(setRestProps.bind(this, attrs))
                    : updateFns.push(this.setProp.bind(this, attrName));
                this[UPDATE_PROPERTY_FUNCTIONS][attrValue] = updateFns;
            }
            // 对于字面量prop，直接设置到$component.props里面去
            else {
                this.setProp(attrName, attrValue);
            }
        }

        // 子树先compile完，再把整棵树插入到DOM中
        this[COMPONENT_TREE].compile();
        insertComponentNodes(curNode, this.startNode, this.endNode);

        this[COMPONENT_NODE] = null;

        // 给component扩展两个控制表达式监测的方法
        this[COMPONENT].suspendExpr = function (expr) {
            exprWacther.suspendExpr(expr);
        };
        this[COMPONENT].resumeExpr = function (expr) {
            exprWacther.resumeExpr(expr);
        };

        function setRestProps(attrs, value, done) {
            this.setRestProps(value, attrs, done);
        }

        // 把组件节点放到 DOM 树中去
        function insertComponentNodes(componentNode, startNode, endNode) {
            let parentNode = componentNode.getParentNode();

            Node.iterate(startNode, endNode, curNode => {
                const nextNode = curNode.getNextSibling();
                parentNode.insertBefore(curNode, componentNode);

                return {
                    type: 'options',
                    getNextNode: () => nextNode,
                    getChildNodes: () => []
                };
            });

            componentNode.remove();
        }
    }

    linkScope() {
        const exprWacther = this.getExpressionWatcher();

        this[COMPONENT_TREE].link();

        this[COMPONENT_TREE].rootScope.setParent(this.getScope());
        this.getScope().addChild(this[COMPONENT_TREE].rootScope);

        exprWacther.on('change', (event, done) => {
            const doneChecker = new DoneChecker(done);
            if (this.isDark) {
                doneChecker.complete();
                return;
            }

            const updateFns = this[UPDATE_PROPERTY_FUNCTIONS][event.expr];
            if (updateFns && updateFns.length) {
                updateFns.forEach(fn => {
                    doneChecker.add(done => {
                        fn(event.newValue, done);
                    });
                });
            }
            doneChecker.complete();
        });
    }

    initRender(done) {
        const doneChecker = new DoneChecker(done);
        const exprWacther = this.getExpressionWatcher();
        // 初始化一下界面
        /* eslint-disable guard-for-in */
        for (let key in this[COMPONENT].props) {
            /* eslint-disable no-loop-func */
            doneChecker.add(done => {
                this.setProp(key, this[COMPONENT].props[key], done);
            });
            /* eslint-enable no-loop-func */
        }

        for (let expr in this[UPDATE_PROPERTY_FUNCTIONS]) {
            const updateFns = this[UPDATE_PROPERTY_FUNCTIONS][expr];
            for (let i = 0, il = updateFns.length; i < il; ++i) {
                /* eslint-disable no-loop-func */
                doneChecker.add(done => {
                    updateFns[i](exprWacther.calculate(expr), done);
                });
                /* eslint-enable no-loop-func */
            }
        }
        /* eslint-enable guard-for-in */

        doneChecker.add(done => {
            this[COMPONENT_TREE].initRender(done);
        });

        // 到此处，组件应该就初始化完毕了。
        this[COMPONENT].$$state = componentState.READY;
        this[COMPONENT].ready();

        doneChecker.complete();
    }

    setRestProps(value, attrs, done) {
        const doneChecker = new DoneChecker(done);
        if (!value || typeof value !== 'object') {
            doneChecker.complete();
            return;
        }

        for (let key in value) {
            if (!(key in attrs)) {
                /* eslint-disable no-loop-func */
                doneChecker.add(done => {
                    this.setProp(key, value[key], done);
                });
                /* eslint-enable no-loop-func */
            }
        }
        doneChecker.complete();
    }

    /**
     * 设置prop，不会更新DOM
     *
     * @public
     * @param {string} name  prop名字
     * @param {*} value prop值
     * @param {function()} done 异步操作完成的回调函数
     */
    setProp(name, value, done) {
        const doneChecker = new DoneChecker(done);
        name = line2camel(name);

        if (name === 'ref') {
            this.ref = value;
            // 把当前组件存放到父组件的treeVar里面去
            const childComponents = this.tree.getTreeVar('children');
            childComponents[this.ref] = this[COMPONENT];
        }
        else if (name === 'class') {
            let classList = Node.getClassList(value);
            classList = this[COMPONENT_CSS_CLASS_NAME].concat(classList || []);
            classList = distinctArr(classList, cls => cls);

            doneChecker.add(done => {
                set.call(this, this[COMPONENT_TREE].rootScope, name, classList, done);
            });
        }
        else {
            doneChecker.add(done => {
                set.call(this, this[COMPONENT_TREE].rootScope, name, value, done);
            });
        }

        doneChecker.complete();

        function set(scopeModel, name, value, done) {
            const props = scopeModel.get('props');
            props[name] = value;
            scopeModel.set('props', props, false, done);

            if (this[COMPONENT]
                && (this[COMPONENT].$$state === componentState.READY)
            ) {
                this[COMPONENT].propsChange();
            }
        }
    }

    [REGISTER_COMPONENTS]() {
        let componentManager = this.tree.getTreeVar('componentManager');
        let curComponentManager = new ComponentManager();
        curComponentManager.setParent(componentManager);

        if (this[COMPONENT].getComponentClasses instanceof Function) {
            curComponentManager.register(this[COMPONENT].getComponentClasses());
        }

        this[COMPONENT_TREE].setTreeVar('componentManager', curComponentManager);
    }

    destroy() {
        this[COMPONENT_TREE].destroy();
        this[COMPONENT].destroy();
        this[COMPONENT].$$state = componentState.DESTROIED;

        this.removeFromDOM(this.startNode, this.endNode);

        super.destroy();
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

    goDark(done) {
        const doneChecker = new DoneChecker(done);
        if (this.isDark) {
            doneChecker.complete();
            return;
        }
        doneChecker.add(done => {
            super.goDark(done);
        });
        doneChecker.add(done => {
            this[COMPONENT_TREE].goDark(done);
        });
        doneChecker.complete();
    }

    restoreFromDark(done) {
        const doneChecker = new DoneChecker(done);
        if (!this.isDark) {
            doneChecker.complete();
            return;
        }
        doneChecker.add(done => {
            super.restoreFromDark(done);
        });
        doneChecker.add(done => {
            this[COMPONENT_TREE].restoreFromDark(done);
        });
        doneChecker.complete();
    }

     /**
     * 只处理组件
     *
     * @static
     * @param {Node} node DOM节点
     * @return {boolean}
     */
    static isProperNode(node) {
        const nodeType = node.getNodeType();
        if (nodeType !== Node.ELEMENT_NODE) {
            return false;
        }

        const tagName = node.getTagName();
        return tagName.indexOf('ui-') === 0;
    }
}
