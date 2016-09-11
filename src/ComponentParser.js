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
const CHILDREN = Symbol('children');

/**
 * ComponentParser
 *
 * @class
 * @extends {ExprParserEnhance}
 */
export default class ComponentParser extends ExprParserEnhance {

    /**
     * @override
     */
    static priority = 4;

    /**
     * @override
     */
    constructor(options) {
        super(options);

        this[COMPONENT_TREE] = null;
        this[COMPONENT_CSS_CLASS_NAME] = null;
        this[COMPONENT] = null;

        this[COMPONENT_NODE] = this.startNode;
        this[ATTRS] = {};
        this.expressions = [];

        /**
         * 有可能存在children
         *
         * @private
         * @type {Children}
         */
        this[CHILDREN] = null;
    }

    /**
     * 创建组件实例
     *
     * @private
     */
    [CREATE_COMPONENT]() {
        const node = this[COMPONENT_NODE];
        const componentName = line2camel(node.getTagName().replace(/^ev/, ''));
        const ComponentClass = this.tree.getTreeVar('componentManager').getClass(componentName);
        if (!ComponentClass) {
            throw new Error(`the component \`${componentName}\` is not registed!`);
        }

        this[COMPONENT] = new ComponentClass();
        this[COMPONENT].$$state = componentState.INITIALIZING;
        this[COMPONENT_CSS_CLASS_NAME] = this.getCssClassName(ComponentClass);
    }

    /**
     * 创建组件树。
     * 必须在组件创建之后。
     *
     * @protected
     */
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

        if (!isClass(this[COMPONENT].props, 'Object')) {
            throw new Error('wrong props');
        }
        if (!isClass(this[COMPONENT].state, 'Object')) {
            throw new Error('wrong state');
        }
        this[COMPONENT_TREE].rootScope.set({
            props: this[COMPONENT].props,
            state: this[COMPONENT].state
        });

        // 记录下children
        this[CHILDREN] = this.parseChildren();
        this[SET_PROP]('children', this[CHILDREN]);

        this[COMPONENT_TREE].setParent(this.tree);

        // 用于存放当前组件下的子组件
        this[COMPONENT_TREE].setTreeVar('children', this[COMPONENT].refs);
    }

    /**
     * 解析出来children。
     * children有两种形式：
     * 1、单children形式，表现得和html DOM结构类似，写法也很类似：
     *     <ev-component><p>...</p><p>...</p></ev-component>
     *     其中Component的模板为：
     *     <div>{props.children}</div>
     * 2、多children形式：
     *     <ev-component>
     *         <!-- children: child1 -->
     *         child1
     *         <!-- /children -->
     *         <!-- children: child2 -->
     *         child2
     *         <!-- /children -->
     *     </ev-component>
     *     其中Component的模板为：
     *     <div>
     *         <div>{props.children.child1}</div>
     *         <div>{props.children.child2}</div>
     *     </div>
     *
     * @private
     * @return {Children|Object}
     */
    parseChildren() {
        const componentNode = this[COMPONENT_NODE];

        let children = {};
        let child = {};
        let inChild = false;
        let hasChild = false;
        Node.iterate(componentNode.getFirstChild(), componentNode.getLastChild(), curNode => {
            if (curNode.getNodeType() === Node.COMMENT_NODE) {
                if (/^\s*child:\s*/.test(curNode.getNodeValue())) {
                    if (inChild) {
                        throw new Error('children template can not nest.');
                    }

                    const nextSibling = curNode.getNextSibling();
                    if (!nextSibling) {
                        throw new Error('no end children node.');
                    }

                    // 看看这个child是不是空的
                    if (nextSibling.getNodeType() === Node.COMMENT_NODE
                        && nextSibling.nodeValue.replace(/\s*/g, '') === '/child'
                    ) {
                        return;
                    }

                    const nodeValue = curNode.getNodeValue();
                    child.name = nodeValue.replace(/^\s*child:\s*/, '').replace(/\s+/g, '');
                    child.startNode = curNode.getNextSibling();

                    inChild = true;
                }
                else if (curNode.getNodeValue().replace(/\s+/g, '') === '/child') {
                    if (!inChild) {
                        throw new Error('wrong end node');
                    }

                    child.endNode = curNode.getPreviousSibling();
                    children[child.name] = new Children(child.startNode, child.endNode, this.tree);
                    child = {};
                    inChild = false;
                    hasChild = true;
                }
            }
        });

        if (!hasChild) {
            children = new Children(
                componentNode.getFirstChild(),
                componentNode.getLastChild(),
                this.tree
            );
        }

        return children;
    }

    /**
     * ev-rest是一个特殊属性
     *
     * @override
     * @protected
     */
    collectExprs() {
        this[CREATE_COMPONENT]();
        this[CREATE_COMPONENT_TREE]();
        this[REGISTER_COMPONENTS]();

        // 组件本身就有的css类名
        this[SET_PROP]('class', this[COMPONENT_CSS_CLASS_NAME]);

        // 将scope注入到component里面去
        this[COMPONENT].$$scopeModel = this[COMPONENT_TREE].rootScope;

        const exprWacther = this.getExpressionWatcher();
        const curNode = this[COMPONENT_NODE];
        const attributes = curNode.getAttributes();
        for (let i = 0, il = attributes.length; i < il; i++) {
            let attrValue = attributes[i].nodeValue;
            let attrName = attributes[i].nodeName;

            const attr = this[ATTRS][line2camel(attrName)] = {};

            // 对于含有表达式的prop，把表达式记录下来
            if (this.isExpression(attrValue)) {
                attr.isExpression = true;
                attr.expression = attrValue;
                exprWacther.addExpr(attrValue);
                this.expressions.push(attrValue);
            }
            // 对于字面量prop，直接设置到$component.props里面去
            else {
                attr.isExpression = false;
                attr.value = attrValue;
                this[SET_PROP](attrName, attrValue);
            }
        }

        // 子树compile
        this[COMPONENT_TREE].compile();

        // 给component扩展两个控制表达式监测的方法
        this[COMPONENT].suspendExpr = function (expr) {
            exprWacther.suspendExpr(expr);
        };
        this[COMPONENT].resumeExpr = function (expr) {
            exprWacther.resumeExpr(expr);
        };
    }

    /**
     * @override
     */
    linkScope() {
        this[COMPONENT_TREE].link();
        this.getScope().addChild(this[COMPONENT_TREE].rootScope);
    }

    /**
     * 在DOM树中插入组件节点
     *
     * @private
     * @param  {WrapNode} componentNode 组件占位节点
     * @param  {WrapNode} startNode     组件开始节点
     * @param  {WrapNode} endNode       组件结束节点
     */
    insertComponentNodes(componentNode, startNode, endNode) {
        const parentNode = componentNode.getParentNode();
        if (!parentNode) {
            return;
        }

        Node.iterate(startNode, endNode, curNode => {
            const nextNode = curNode.getNextSibling();
            parentNode.insertBefore(curNode, componentNode);

            return {
                type: 'options',
                getNextNode() {
                    return nextNode;
                },
                getChildNodes() {
                    return [];
                }
            };
        });

        componentNode.remove();
    }

    /**
     * @override
     */
    initRender(done) {
        const doneChecker = new DoneChecker(() => {
            this[COMPONENT].initMounted();
            done();
        });
        const exprWacther = this.getExpressionWatcher();

        const newProps = extend({}, this[COMPONENT].props);
        const expressionValueCache = {};
        /* eslint-disable guard-for-in,fecs-use-for-of */
        for (let attrName in this[ATTRS]) {
        /* eslint-enable guard-for-in,fecs-use-for-of */
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
        /* eslint-disable fecs-use-for-of */
        for (let propName in checkFns) {
        /* eslint-enable fecs-use-for-of */
            if (!checkFns[propName](newProps[propName])) {
                throw new Error(`invalid prop: ${propName}`);
            }
        }

        doneChecker.add(done => this[SET_PROP](newProps, null, done));

        doneChecker.add(innerDone => {
            const domUpdater = this.getDOMUpdater();
            const taskId = domUpdater.generateTaskId();
            domUpdater.addTaskFn(taskId, () => {
                this.insertComponentNodes(this[COMPONENT_NODE], this.startNode, this.endNode);
            }, innerDone);
        });
        doneChecker.add(::this[COMPONENT_TREE].initRender);

        // 到此处，组件应该就初始化完毕了。
        this[COMPONENT].$$state = componentState.READY;
        this[COMPONENT].init();

        doneChecker.complete();
    }

    /**
     * 相关表达式发生变化之后的回调函数
     *
     * @public
     * @override
     * @param  {Event}   event 事件对象
     * @param  {Function} done  完成处理的回调函数
     */
    onExpressionChange(event, done) {
        const doneChecker = new DoneChecker(done);

        if (!this.isDark) {
            const expression = event.expr;
            const expressionValue = event.newValue;
            const newProps = {};
            // this[ATTRS]是否包含当前发生改变的event.expr
            let hasExpression = false;
            /* eslint-disable guard-for-in,fecs-use-for-of */
            for (let attrName in this[ATTRS]) {
            /* eslint-enable guard-for-in,fecs-use-for-of */
                const attr = this[ATTRS][attrName];
                if (attr.expression === expression) {
                    if (attrName === 'evRest') {
                        extend(newProps, expressionValue);
                    }
                    else {
                        newProps[attrName] = expressionValue;
                    }

                    hasExpression = true;
                }
            }

            // 检查传进来的props是否合法
            const checkResult = this[CHECK_PROPS](newProps);
            if (checkResult instanceof Error) {
                throw checkResult;
            }

            // 有更新的话，才更新
            if (hasExpression) {
                doneChecker.add(done => this[SET_PROP](newProps, null, done));
            }
        }

        doneChecker.complete();
    }

    /**
     * @override
     */
    [GET_REST](attrs, value) {
        const rest = {};
        /* eslint-disable fecs-use-for-of */
        for (let propName in value) {
        /* eslint-enable fecs-use-for-of */
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
        /* eslint-disable guard-for-in,fecs-use-for-of,fecs-valid-map-set */
        for (let propName in primaryProps) {
        /* eslint-enable guard-for-in,fecs-use-for-of,fecs-valid-map-set */
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
                basicProps[line2camel(propName)] = value;
            }
        }

        const scope = this[COMPONENT_TREE].rootScope;
        const props = scope.get('props');
        scope.set('props', extend(props, basicProps), false, () => {
            if (this[COMPONENT]
                && this[COMPONENT].$$state === componentState.READY
            ) {
                this[COMPONENT].propsChangeMounted(basicProps);
            }

            done && done();
        });
        if (this[COMPONENT]
            && this[COMPONENT].$$state === componentState.READY
        ) {
            this[COMPONENT].propsChange(basicProps);
        }

        function cls(cls) {
            return cls;
        }
    }

    /**
     * 该方法仅用于检查props change后的参数合法性
     *
     * @private
     * @param {Object} newProps 新props
     * @return {Error|Undefined}
     */
    [CHECK_PROPS](newProps) {
        const checkFns = this[COMPONENT].constructor.getPropsCheckFns() || {};
        /* eslint-disable fecs-use-for-of */
        for (let propName in newProps) {
        /* eslint-enable fecs-use-for-of */
            if (!newProps.hasOwnProperty(propName)) {
                continue;
            }
            const checkFn = checkFns[propName];
            if (isFunction(checkFn) && !checkFn(newProps[propName])) {
                return new Error(`prop '${propName}' is not valid.`);
            }
        }
    }

    /**
     * @override
     */
    [REGISTER_COMPONENTS]() {
        const componentManager = this.tree.getTreeVar('componentManager');
        const curComponentManager = new ComponentManager();
        curComponentManager.setParent(componentManager);

        if (this[COMPONENT].getComponentClasses instanceof Function) {
            curComponentManager.register(this[COMPONENT].getComponentClasses());
        }

        this[COMPONENT_TREE].setTreeVar('componentManager', curComponentManager);
    }

    /**
     * 释放资源
     *
     * @override
     * @protected
     */
    release() {
        if (this[CHILDREN]) {
            if (this[CHILDREN] instanceof Children) {
                this[CHILDREN].destroy();
            }
            else {
                /* eslint-disable guard-for-in,fecs-use-for-of */
                for (let key in this[CHILDREN]) {
                    this[CHILDREN][key].destroy();
                }
                /* eslint-enable guard-for-in,fecs-use-for-of */
            }

            this[CHILDREN] = null;
        }

        this[COMPONENT_TREE].destroy();
        this[COMPONENT].destroy();
        this[COMPONENT].$$state = componentState.DESTROIED;

        this.removeFromDOM(this.startNode, this.endNode);
        this.expressions = null;

        this[COMPONENT_NODE] = null;

        super.release();
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

    /**
     * @override
     */
    getChildNodes() {
        return [];
    }

    /**
     * @override
     */
    hide(done) {
        this[COMPONENT].beforeHide();

        const doneChecker = new DoneChecker(done);
        doneChecker.add(innerDone => super.hide(innerDone));
        doneChecker.add(innerDone => this[COMPONENT_TREE].goDark(innerDone));
        doneChecker.complete();
    }

    /**
     * @override
     */
    show(done) {
        const doneChecker = new DoneChecker(() => {
            this[COMPONENT].afterShow();
            typeof done === 'function' && done();
        });
        doneChecker.add(innerDone => super.show(innerDone));
        doneChecker.add(innerDone => this[COMPONENT_TREE].restoreFromDark(innerDone));
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
