/**
 * @file 组件解析器
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var EventExprParser = require('vtpl/src/parsers/EventExprParser');
var Tree = require('vtpl/src/trees/Tree');
var utils = require('vtpl/src/utils');
var ComponentTree = require('./ComponentTree');
var ComponentChildren = require('./ComponentChildren');
var ComponentManager = require('./ComponentManager');

module.exports = EventExprParser.extends(
    {

        initialize: function (options) {
            EventExprParser.prototype.initialize.apply(this, arguments);

            // TODO: 删掉
            this.isComponent = true;

            this.checker = utils.isPureObject(this.checker) ? this.checker : {};
            this.componentManager = this.tree.getTreeVar('componentManager');

            var componentName = utils.line2camel(this.node.tagName.toLowerCase().replace('ui', ''));

            var ComponentClass = this.componentManager.getClass(componentName);
            if (!ComponentClass) {
                throw new Error('the component `' + componentName + '` is not registed!');
            }
            // 组件本身就应该有的css类名
            this.componentOriginCssClassList = ComponentManager.getCssClassName(ComponentClass);

            this.component = new ComponentClass();
            this.component.parser = this;
            utils.extend(this.checker, this.component.checker);

            this.mount(options.tree);
        },

        collectExprs: function () {
            var curNode = this.node;

            var attributes = curNode.attributes;
            // 搜集不含有表达式的属性，然后在组件类创建好之后设置进组件
            this.setLiteralAttrsFns = [];

            // 是否存在css类名的设置函数
            var hasClass = false;
            for (var i = 0, il = attributes.length; i < il; i++) {
                var attr = attributes[i];
                hasClass = attr.nodeName === 'class-list';

                var expr = attr.nodeValue;
                if (this.config.getExprRegExp().test(expr)) {
                    this.exprs.push(expr);
                    if (!this.exprFns[expr]) {
                        var rawExpr = this.getRawExpr(expr);
                        this.exprCalculater.createExprFn(rawExpr);
                        this.exprFns[expr] = utils.bind(calculateExpr, null, rawExpr, this.exprCalculater);

                        this.updateFns[expr] = this.updateFns[expr] || [];
                        this.updateFns[expr].push(utils.bind(setAttrFn, this, attr.nodeName));
                    }
                }
                else {
                    this.setLiteralAttrsFns.push(
                        utils.bind(setAttrFn, this, attr.nodeName, attr.nodeValue, true)
                    );
                }
            }

            if (!hasClass) {
                this.setLiteralAttrsFns.push(
                    utils.bind(setAttrFn, this, 'class', [])
                );
            }

            this.tree.traverse();
            insertComponentNodes(this.node, this.startNode, this.endNode);
            this.node = null;

            // 把组件节点放到 DOM 树中去
            function insertComponentNodes(componentNode, startNode, endNode) {
                var parentNode = componentNode.parentNode;
                utils.traverseNodes(
                    startNode,
                    endNode,
                    function (curNode) {
                        parentNode.insertBefore(curNode, componentNode);
                    }
                );
                parentNode.removeChild(componentNode);
            }

            return true;

            /**
             * 设置组件属性。
             * 由于HTML标签中不能写驼峰形式的属性名，
             * 所以此处会将中横线形式的属性转换成驼峰形式。
             *
             * @inner
             * @param {string} name      属性名
             * @param {string} value     属性值
             * @param {boolean} isLiteral 是否是常量属性
             * @param {Component} component 组件
             */
            function setAttrFn(name, value, isLiteral) {
                name = utils.line2camel(name);
                if (name === 'class' && isLiteral) {
                    value = this.componentOriginCssClassList.concat(this.tree.domUpdater.getClassList(value));
                    if (isLiteral) {
                        this.componentOriginCssClassList = value;
                    }
                }
                this.setAttr(name, value);
            }

            function calculateExpr(rawExpr, exprCalculater, scopeModel) {
                return exprCalculater.calculate(rawExpr, false, scopeModel);
            }
        },

        getRawExpr: function (expr) {
            return expr.replace(this.config.getExprRegExp(), function () {
                return arguments[1];
            });
        },

        mount: function (parentTree) {
            this.component.componentWillMount();

            var div = document.createElement('div');
            var splitNode = parentTree.domUpdater.splitElement(this.node);
            div.innerHTML = '<!-- ' + splitNode[0] + ' -->'
                + this.component.tpl
                + '<!-- ' + splitNode[1] + ' -->';
            var startNode = div.firstChild;
            var endNode = div.lastChild;

            this.startNode = startNode;
            this.endNode = endNode;

            // 组件的作用域是和外部的作用域隔开的
            this.tree = new ComponentTree({
                startNode: startNode,
                endNode: endNode,
                config: parentTree.config,
                domUpdater: parentTree.domUpdater,
                exprCalculater: parentTree.exprCalculater,

                // componentChildren不能传给子级组件树，可以传给子级for树。
                componentChildren: new ComponentChildren(
                    this.node.firstChild,
                    this.node.lastChild,
                    parentTree.rootScope
                )
            });

            this.tree.setParent(parentTree);
            this.tree.getTreeVar('componentManager', true)
                .setParent(parentTree.getTreeVar('componentManager'));

            this.tree.registeComponents(this.component.componentClasses);
        },

        /**
         * 设置当前节点或者组件的属性
         *
         * @public
         * @param {string} name 属性名
         * @param {*} value 属性值
         * @return {boolean}
         */
        setAttr: function (name, value) {
            if (name === 'ref') {
                this.$$ref = value;
                return true;
            }

            if (name === 'class') {
                value = this.componentOriginCssClassList.concat(this.tree.domUpdater.getClassList(value));

                for (var i = 0, il = this.tree.tree.length; i < il; ++i) {
                    var parserObj = this.tree.tree[i];
                    parserObj.parser.setAttr
                        && parserObj.parser.setAttr(
                            'class',
                            this.tree.domUpdater.getClassList(value)
                        );
                }
            }

            var scope = this.tree.rootScope;
            scope.set(name, value);

            return true;
        },

        /**
         * 获取属性
         *
         * @public
         * @param  {string} name 属性名
         * @return {*}      属性值
         */
        getAttr: function (name) {
            return this.tree.rootScope.get(name);
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

        setScope: function () {
            for (var i = 0, il = this.setLiteralAttrsFns.length; i < il; i++) {
                this.setLiteralAttrsFns[i]();
            }

            EventExprParser.prototype.setScope.call(this, this.tree.rootScope);

            this.component.componentDidMount();
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

        goDark: function () {
            this.component.goDark();
        },

        restoreFromDark: function () {
            this.component.restoreFromDark();
        },

        ref: function (ref) {
            var parserTree = this.tree.tree;

            var ret;
            this.walk(parserTree, function (parser) {
                if (parser.$$ref === ref) {
                    ret = parser.component;
                    return true;
                }
            });
            return ret;
        },

        destroy: function () {
            this.component.componentWillUnmount();
            this.component.destroy();
            EventExprParser.prototype.destroy.apply(this, arguments);
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
            return node.nodeType === 1
                && node.tagName.toLowerCase().indexOf('ui-') === 0;
        }
    }
);

Tree.registeParser(module.exports);

function defaultCheckerFn(expr, exprValue, exprOldValue) {
    return exprValue === exprOldValue;
}
