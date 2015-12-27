/**
 * @file 组件解析器。
 *       以`ui-`开头的标签都是组件标签。
 *       组件解析器实例包含的比较重要的几个属性：
 *       - 1、$$props ：组件属性的表达式函数和节点更新函数
 *           - 1、$$props[expr].exprFn ：计算表达式值的函数，类型是`function(ScopeModel):*`；
 *           - 2、$$props[expr].updateFns ：根据表达式值去更新dom的函数数组，类型是`[function(*)]`。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var ExprParser = require('vtpl/src/parsers/ExprParser');
var Tree = require('vtpl/src/trees/Tree');
var utils = require('vtpl/src/utils');
var ComponentChildren = require('./ComponentChildren');
var ComponentManager = require('./ComponentManager');
var Node = require('vtpl/src/nodes/Node');

module.exports = ExprParser.extends(
    {

        initialize: function (options) {
            ExprParser.prototype.initialize.apply(this, arguments);

            var componentName = utils.line2camel(this.node.getTagName().replace('ui', ''));
            var ComponentClass = this.tree.getTreeVar('componentManager').getClass(componentName);
            if (!ComponentClass) {
                throw new Error('the component `' + componentName + '` is not registed!');
            }

            this.$component = new ComponentClass();
            this.$component.$$parser = this;
            this.$$propsOldValue = {};
            this.$$props = {};
            this.$$componentCssClassName = this.getCssClassName(ComponentClass);
            this.$$ref = null;

            // 组件本身就应该有的css类名
            this.$component.props.set('classList', this.$$componentCssClassName);

            this.mount(options.tree);
        },

        mount: function (parentTree) {
            this.$component.componentWillMount();

            var nodesManager = parentTree.getTreeVar('nodesManager');
            var div = nodesManager.createElement('div');
            var tagName = this.node.getTagName();
            div.setInnerHTML(
                '<!-- ' + tagName + ' -->' + this.$component.tpl + '<!-- /' + tagName + ' -->'
            );

            this.startNode = div.getFirstChild();
            this.endNode = div.getLastChild();

            this.tree = new Tree({
                startNode: this.startNode,
                endNode: this.endNode
            });
            // 记录下children
            this.tree.setTreeVar(
                'componentChildren',
                new ComponentChildren(
                    this.node.getFirstChild(),
                    this.node.getLastChild(),
                    parentTree.rootScope
                )
            );

            this.tree.setParent(parentTree);
            this.registerComponents();
        },

        registerComponents: function () {
            var componentManager = this.tree.getTreeVar('componentManager');
            var curComponentManager = new ComponentManager();
            curComponentManager.setParent(componentManager);
            curComponentManager.register(this.$component.componentClasses);
        },

        collectExprs: function () {
            var config = this.tree.getTreeVar('config');
            var curNode = this.node;
            var attributes = curNode.getAttributes();
            for (var i = 0, il = attributes.length; i < il; i++) {
                var attr = attributes[i];

                var attrValue = attr.nodeValue;
                var attrName = attr.nodeName;
                if (config.getExprRegExp().test(attrValue)) {
                    var updateFn = utils.bind(this.setProp, this, attrName);
                    this.addExpr(this.$$props, attrValue, updateFn, attrName);
                }
                else {
                    this.setProp(attrName, attrValue);
                }
            }

            this.tree.traverse();
            insertComponentNodes(this.node, this.startNode, this.endNode);
            this.node = null;

            return true;

            // 把组件节点放到 DOM 树中去
            function insertComponentNodes(componentNode, startNode, endNode) {
                if (!componentNode.getParentNode()) {
                    debugger
                }
                var parentNode = componentNode.getParentNode();

                var delayFns = [];
                for (var curNode = startNode;
                    curNode && !curNode.isAfter(endNode);
                    curNode = curNode.getNextSibling()
                ) {
                    delayFns.push(utils.bind(function (curNode) {
                        parentNode.insertBefore(curNode, componentNode);
                    }, null, curNode));
                }
                for (var i = 0, il = delayFns.length; i < il; ++i) {
                    delayFns[i]();
                }

                componentNode.remove();
            }
        },

        linkScope: function () {
            this.tree.rootScope.set('props', this.$component.props.get());
            this.tree.rootScope.set('state', this.$component.state.get());

            // 过一遍字面量形式的props
            this.renderPropsToDom();

            // 如果父级tree中的数据发生变化，就可能会影响到当前组件中的props表达式的计算值，
            // 所以此处监听一下变化，在发生变化的时候更新一下this.$component.props
            this.tree.$parent.rootScope.on('change', function () {
                this.renderToDom(this.$$props, this.$$propsOldValue, this.tree.$parent.rootScope);
            }, this);

            // state发生了改变
            this.$component.state.on('change', function () {
                this.tree.rootScope.set('state', this.$component.state.get());
            }, this);

            // props发生了改变（props是在this.$$props[expr].exprFn中被改变的）
            this.$component.props.on('change', function () {
                this.tree.rootScope.set('props', this.$component.props.get());
            }, this);
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
        addExpr: function (mountObj, expr, updateFn, attrName) {
            if (!mountObj[expr]) {
                var pureExprFn = this.createExprFn(expr);
                var me = this;
                mountObj[expr] = {
                    exprFn: function (scopeModel) {
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
        renderPropsToDom: function () {
            var me = this;
            var domUpdater = this.tree.getTreeVar('domUpdater');
            this.$component.props.iterate(function (name, value) {
                if (name === 'ref') {
                    return;
                }

                if (name === 'class') {
                    for (var curNode = me.startNode;
                        curNode && !curNode.isAfter(me.endNode);
                        curNode = curNode.getNextSibling()
                    ) {
                        var taskId = domUpdater.generateNodeAttrUpdateId();
                        domUpdater.addTaskFn(taskId, utils.bind(function (curNode) {
                            curNode.attr('class', value);
                        }, null, curNode));
                    }
                }
            });
        },

        /**
         * 设置prop，不会更新DOM
         *
         * @public
         * @param {string} name  prop名字
         * @param {*} value prop值
         */
        setProp: function (name, value) {
            name = utils.line2camel(name);

            if (name === 'ref') {
                this.$$ref = value;
                return;
            }

            if (name === 'class') {
                var classList = Node.getClassList(value);
                this.$component.props.set('class', this.$$componentCssClassName.concat(classList || []));
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
        getStartNode: function () {
            return this.startNode;
        },

        /**
         * 获取结束节点
         *
         * @protected
         * @inheritDoc
         * @return {Node}
         */
        getEndNode: function () {
            return this.endNode;
        },

        getScope: function () {
            return this.tree.rootScope;
        },

        // scopeModel里面的值发生了变化
        onChange: function () {
            if (this.isGoDark) {
                return;
            }

            var exprs = this.exprs;
            var exprOldValues = this.exprOldValues;
            for (var i = 0, il = exprs.length; i < il; i++) {
                var expr = exprs[i];
                var exprValue = this.exprFns[expr](this.scopeModel);

                // 此处既可以做脏检测，防止不必要的更新，也可以防止onChange的死循环。
                var checkerFn = this.checker[name];
                if (!utils.isFunction(checkerFn)) {
                    checkerFn = defaultCheckerFn;
                }
                if (!checkerFn(expr, exprValue, exprOldValues[expr])) {
                    exprOldValues[expr] = exprValue;

                    var updateFns = this.updateFns[expr];
                    for (var j = 0, jl = updateFns.length; j < jl; j++) {
                        updateFns[j](exprValue);
                    }
                }
            }
        },

        destroy: function () {
            this.$component.componentWillUnmount();
            this.$component.destroy();
            ExprParser.prototype.destroy.apply(this, arguments);
        },

        /**
         * 遍历parserTree
         *
         * @private
         * @param  {Tree} parserTree 树
         * @param  {function(Parser):boolean} iteraterFn 迭代函数
         * @return {boolean}
         */
        walk: function (parserTree, iteraterFn) {
            for (var i = 0, il = parserTree.length; i < il; ++i) {
                var parserObj = parserTree[i];

                // 针对if指令的情况
                if (utils.isArray(parserObj)) {
                    if (this.walk(parserObj, iteraterFn)) {
                        return true;
                    }
                    continue;
                }

                // 针对for指令的情况
                if (utils.isArray(parserObj.trees)) {
                    for (var j = 0, jl = parserObj.trees.length; j < jl; ++j) {
                        if (this.walk(parserObj.trees[j].tree, iteraterFn)) {
                            return true;
                        }
                    }
                    continue;
                }

                if (iteraterFn(parserObj.parser)) {
                    return true;
                }

                if (parserObj.children && parserObj.children.length) {
                    if (this.walk(parserObj.children, iteraterFn)) {
                        return true;
                    }
                }
            }
        },

        /**
         * 获取组件css类名
         *
         * @private
         * @param {Class} ComponentClass 组件类
         * @return {string} 组件css类名
         */
        getCssClassName: function (ComponentClass) {
            var name = [];
            for (var curCls = ComponentClass; curCls; curCls = curCls.$superClass) {
                name.push(utils.camel2line(curCls.$name));

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
        isProperNode: function (node) {
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

function defaultCheckerFn(expr, exprValue, exprOldValue) {
    return exprValue === exprOldValue;
}
