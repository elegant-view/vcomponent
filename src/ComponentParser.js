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
import utils from 'vtpl/src/utils';
import ComponentManager from './ComponentManager';
import Node from 'vtpl/src/nodes/Node';

module.exports = ExprParser.extends(
    {

        initialize(options) {
            ExprParser.prototype.initialize.apply(this, arguments);

            var componentName = utils.line2camel(this.node.getTagName().replace('ui', ''));
            var ComponentClass = this.tree.getTreeVar('componentManager').getClass(componentName);
            if (!ComponentClass) {
                throw new Error(`the component \`${componentName}\` is not registed!`);
            }

            this.$component = new ComponentClass();
            this.$component.$$parser = this;
            this.$$propsOldValue = {};
            this.$$props = {};
            this.$$componentCssClassName = this.getCssClassName(ComponentClass);
            this.$$ref = null;

            // 组件本身就有的css类名
            this.setProp('class', this.$$componentCssClassName);

            this.mount(options.tree);
        },

        mount(parentTree) {
            this.$component.componentWillMount();

            var nodesManager = parentTree.getTreeVar('nodesManager');
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
                parentTree: parentTree
            });

            this.tree.setParent(parentTree);
            this.registerComponents();
        },

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
                    var updateFn = utils.bind(this.setProp, this, attrName);
                    this.addExpr(this.$$props, attrValue, updateFn, attrName);
                }
                // 对于字面量prop，直接设置到$component.props里面去
                else {
                    this.setProp(attrName, attrValue);
                }
            }

            this.tree.traverse();
            insertComponentNodes(this.node, this.startNode, this.endNode);
            this.node = null;

            this.$component.componentDidMount();

            // 把组件节点放到 DOM 树中去
            function insertComponentNodes(componentNode, startNode, endNode) {
                var parentNode = componentNode.getParentNode();

                var delayFns = [];
                for (var curNode = startNode;
                    curNode && !curNode.isAfter(endNode);
                    curNode = curNode.getNextSibling()
                ) {
                    delayFns.push(utils.bind(insert, null, curNode));
                }
                for (var i = 0, il = delayFns.length; i < il; ++i) {
                    delayFns[i]();
                }

                componentNode.remove();

                function insert(curNode) {
                    parentNode.insertBefore(curNode, componentNode);
                }
            }
        },

        linkScope() {
            this.tree.rootScope.set('props', this.$component.props.get());
            this.tree.rootScope.set('state', this.$component.state.get());

            // 在父级数据变化的时候更新$component.props
            this.tree.$parent.rootScope.on('change', () => {
                this.renderToDom(this.$$props, this.$$propsOldValue, this.tree.$parent.rootScope);
            });

            // 在$component.props数据变化的时候更新一下this.tree.rootScope，以便触发组件内的界面更新
            this.$component.props.on('change', () => {
                this.tree.rootScope.set('props', this.$component.props.get());
            });

            // 到此处可以计算一下$$props里面存放的表达式的值了，对于计算出来的值，放到$component.props里面去。
            // 这一句代码一定要放在上一段代码的后面，为啥呢？因为此处引起的变化要反映到子树中去，这才叫做`renderToDom`。
            this.renderToDom(this.$$props, this.$$propsOldValue, this.tree.$parent.rootScope);

            // $component.state只能够在组件内部被修改，反映组件的状态。
            // 当$component.state被用户改变的时候，应该触发this.tree.rootScope的change事件，
            // 以便触发组件内的界面更新
            this.$component.state.on('change', () => {
                this.tree.rootScope.set('state', this.$component.state.get());
            });
        },

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
                var pureExprFn = this.createExprFn(expr);
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
        },

        /**
         * 处理某些需要直接反应到DOM上的props，比如css class。
         *
         * @private
         */
        renderPropsToDom() {
            var me = this;
            var domUpdater = this.tree.getTreeVar('domUpdater');
            this.$component.props.iterate(function (value, name) {
                if (name === 'class') {
                    for (var curNode = me.startNode;
                        curNode && !curNode.isAfter(me.endNode);
                        curNode = curNode.getNextSibling()
                    ) {
                        var taskId = domUpdater.generateNodeAttrUpdateId(curNode, name);
                        domUpdater.addTaskFn(taskId, utils.bind(setClass, null, curNode, value));
                    }
                }
            });

            function setClass(curNode, classes) {
                curNode.attr('class', classes);
            }
        },

        /**
         * 设置prop，不会更新DOM
         *
         * @public
         * @param {string} name  prop名字
         * @param {*} value prop值
         */
        setProp(name, value) {
            name = utils.line2camel(name);

            value = this.$component.componentWillReceiveProps(name, value);

            if (name === 'ref') {
                this.$$ref = value;
                return;
            }

            if (name === 'class') {
                var classList = Node.getClassList(value);
                classList = this.$$componentCssClassName.concat(classList || []);
                classList = utils.distinctArr(classList, cls => cls);
                this.$component.props.set('class', classList);
                return;
            }

            this.$component.props.set(name, value);
        },

        /**
         * 获取开始节点
         *
         * @protected
         * @inheritDoc
         * @return {Node}
         */
        getStartNode() {
            return this.startNode;
        },

        /**
         * 获取结束节点
         *
         * @protected
         * @inheritDoc
         * @return {Node}
         */
        getEndNode() {
            return this.endNode;
        },

        getScope() {
            return this.tree.rootScope;
        },

        registerComponents() {
            var componentManager = this.tree.getTreeVar('componentManager');
            var curComponentManager = new ComponentManager();
            curComponentManager.setParent(componentManager);
            curComponentManager.register(this.$component.componentClasses);
        },

        destroy() {
            this.$component.componentWillUnmount();
            this.$component.destroy();
            ExprParser.prototype.destroy.apply(this, arguments);
        },

        /**
         * 获取组件css类名
         *
         * @private
         * @param {Class} ComponentClass 组件类
         * @return {string} 组件css类名
         */
        getCssClassName(ComponentClass) {
            var name = [];
            for (var curCls = ComponentClass; curCls; curCls = curCls.$superClass) {
                name.push(utils.camel2line(curCls.name || curCls.$name));

                // 最多到组件基类
                if (curCls.$name === 'Component') {
                    break;
                }
            }
            return name;
        }
    },
    {
        $name: 'ComponentParser',

        /**
         * 只处理组件
         *
         * @static
         * @param {Node} node DOM节点
         * @return {boolean}
         */
        isProperNode(node) {
            var nodeType = node.getNodeType();
            if (nodeType !== Node.ELEMENT_NODE) {
                return false;
            }

            var tagName = node.getTagName();
            return tagName.indexOf('ui-') === 0;
        }
    }
);

Tree.registeParser(module.exports);

