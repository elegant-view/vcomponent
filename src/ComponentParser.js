/**
 * @file 组件解析器。
 *       以`ev-`开头的标签都是组件标签。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import ExprParserEnhance from './ExprParserEnhance';
import {line2camel, getSuper, camel2line, distinctArr, isFunction, extend, isClass} from './utils';
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
const COMPONENT_NODE = Symbol('componentNode');
const CHECK_PROPS = Symbol('checkProps');
const GET_REST = Symbol('getRest');
const ATTRS = Symbol('attrs');
const SET_PROP = Symbol('setProp');

export default class ComponentParser extends ExprParserEnhance {
    constructor(options) {
        super(options);

        this[COMPONENT_TREE] = null;
        this[COMPONENT_CSS_CLASS_NAME] = null;
        this[COMPONENT] = null;

        this[COMPONENT_NODE] = this.startNode;
        this[ATTRS] = {};
    }

    [CREATE_COMPONENT]() {
        const node = this[COMPONENT_NODE];
        let componentName = line2camel(node.getTagName().replace(/^ev/, ''));
        let ComponentClass = this.tree.getTreeVar('componentManager').getClass(componentName);
        if (!ComponentClass) {
            throw new Error(`the component \`${componentName}\` is not registed!`);
        }

        this[COMPONENT] = new ComponentClass();
        this[COMPONENT].$$state = componentState.INITIALIZING;
        this[COMPONENT_CSS_CLASS_NAME] = this.getCssClassName(ComponentClass);
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
        this[SET_PROP]('children', children);

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
        this[SET_PROP]('class', this[COMPONENT_CSS_CLASS_NAME]);

        // 将scope注入到component里面去
        this[COMPONENT].$$scopeModel = this[COMPONENT_TREE].rootScope;

        const config = this.getConfig();
        const exprWacther = this.getExpressionWatcher();
        const curNode = this[COMPONENT_NODE];
        const attributes = curNode.getAttributes();
        for (let i = 0, il = attributes.length; i < il; i++) {
            let attrValue = attributes[i].nodeValue;
            let attrName = attributes[i].nodeName;

            const attr = this[ATTRS][line2camel(attrName)] = {};

            // 对于含有表达式的prop，把表达式记录下来
            if (config.getExprRegExp().test(attrValue)) {
                attr.isExpression = true;
                attr.expression = attrValue;
                exprWacther.addExpr(attrValue);
            }
            // 对于字面量prop，直接设置到$component.props里面去
            else {
                attr.isExpression = false;
                attr.value = attrValue;
                this[SET_PROP](attrName, attrValue);
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

        this.getScope().addChild(this[COMPONENT_TREE].rootScope);

        exprWacther.on('change', (event, done) => {
            if (this.isDark) {
                isFunction(done) && done();
                return;
            }

            const expression = event.expr;
            const expressionValue = event.newValue;
            const newProps = {};
            for (let attrName in this[ATTRS]) {
                const attr = this[ATTRS][attrName];
                if (attr.expression === expression) {
                    if (attrName === 'evRest') {
                        extend(newProps, expressionValue);
                    }
                    else {
                        newProps[attrName] = expressionValue;
                    }
                }
            }

            const checkResult = this[CHECK_PROPS](newProps);
            if (checkResult instanceof Error) {
                throw checkResult;
            }

            this[SET_PROP](newProps, null, done);
        });
    }

    initRender(done) {
        const doneChecker = new DoneChecker(() => {
            this[COMPONENT].initMounted();
            done();
        });
        const exprWacther = this.getExpressionWatcher();

        const newProps = extend({}, this[COMPONENT].props);
        const expressionValueCache = {};
        /* eslint-disable guard-for-in */
        for (let attrName in this[ATTRS]) {
        /* eslint-enable guard-for-in */
            const attr = this[ATTRS][attrName];
            // 字面量已经在collectExprs的时候被直接设置到component.props里面去了，
            // 因此这里只需要处理非字面量的props。
            if (attr.isExpression) {
                let expressionValue;
                if (attr.expression in expressionValueCache) {
                    expressionValue = expressionValueCache[attr.expression];
                }
                else {
                    expressionValue = exprWacther.calculate(attr.expression);
                    expressionValueCache[attr.expression] = expressionValue;
                }

                if (attrName === 'evRest') {
                    extend(newProps, this[GET_REST](this[ATTRS], expressionValue));
                }
                else {
                    newProps[attrName] = expressionValueCache[attr.expression]
                        = exprWacther.calculate(attr.expression);
                }
            }
        }

        // 初始化参数类型的检查，如果不通过，直接抛出异常
        const checkFns = this[COMPONENT].constructor.getPropsCheckFns() || {};
        for (let propName in checkFns) {
            if (!checkFns[propName](newProps[propName])) {
                throw new Error(`invalid prop: ${propName}`);
            }
        }

        doneChecker.add(done => {
            this[SET_PROP](newProps, null, done);
        });

        doneChecker.add(done => {
            this[COMPONENT_TREE].initRender(done);
        });

        // 到此处，组件应该就初始化完毕了。
        this[COMPONENT].$$state = componentState.READY;
        this[COMPONENT].init();

        doneChecker.complete();
    }

    [GET_REST](attrs, value) {
        const rest = {};
        for (let propName in value) {
            if (propName in attrs) {
                continue;
            }
            rest[propName] = value[propName];
        }
        return rest;
    }

    /**
     * 设置prop，不会更新DOM
     *
     * @private
     * @param {string|Object} name  prop名字或者一个prop对象
     * @param {*} value prop值
     * @param {function()} done 异步操作完成的回调函数
     */
    [SET_PROP](name, value, done) {
        let primaryProps;
        if (isClass(name, 'String')) {
            primaryProps = {
                [name]: value
            };
        }
        else {
            primaryProps = name;
        }

        const basicProps = {};
        /* eslint-disable guard-for-in */
        for (let propName in primaryProps) {
        /* eslint-enable guard-for-in */
            const value = primaryProps[propName];
            if (propName === 'ref') {
                this.ref = value;
                // 把当前组件存放到父组件的treeVar里面去
                const childComponents = this.tree.getTreeVar('children');
                childComponents[this.ref] = this[COMPONENT];
            }
            else if (propName === 'class') {
                let classList = Node.getClassList(value);
                classList = this[COMPONENT_CSS_CLASS_NAME].concat(classList || []);
                classList = distinctArr(classList, cls);
                basicProps.class = classList;
            }
            else {
                basicProps[propName] = value;
            }
        }

        const scope = this[COMPONENT_TREE].rootScope;
        const props = scope.get('props');
        extend(props, basicProps);
        scope.set('props', props, false, () => {
            this[COMPONENT].propsChangeMounted();
            done && done();
        });
        if (this[COMPONENT]
            && (this[COMPONENT].$$state === componentState.READY)
        ) {
            this[COMPONENT].propsChange();
        }

        function cls(cls) {
            return cls;
        }
    }

    // 该方法仅用于检查props change后的参数合法性
    [CHECK_PROPS](newProps) {
        const checkFns = this[COMPONENT].constructor.getPropsCheckFns() || {};
        for (let propName in newProps) {
            if (!newProps.hasOwnProperty(propName)) {
                continue;
            }
            const checkFn = checkFns[propName];
            if (isFunction(checkFn) && !checkFn(newProps[propName])) {
                return new Error(`prop '${propName}' is not valid.`);
            }
        }
    }

    [REGISTER_COMPONENTS]() {
        const componentManager = this.tree.getTreeVar('componentManager');
        const curComponentManager = new ComponentManager();
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
        doneChecker.add(done => super.goDark(done));
        doneChecker.add(done => this[COMPONENT_TREE].goDark(done));
        doneChecker.complete();
    }

    restoreFromDark(done) {
        const doneChecker = new DoneChecker(done);
        if (!this.isDark) {
            doneChecker.complete();
            return;
        }
        doneChecker.add(done => super.restoreFromDark(done));
        doneChecker.add(done => this[COMPONENT_TREE].restoreFromDark(done));
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
        return tagName.indexOf('ev-') === 0;
    }
}
