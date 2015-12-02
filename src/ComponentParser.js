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
var DomUpdater = require('vtpl/src/DomUpdater');

module.exports = EventExprParser.extends(
    {

        initialize: function (options) {
            EventExprParser.prototype.initialize.apply(this, arguments);
            this.componentManager = this.tree.getTreeVar('componentManager');
            this.isComponent = this.node.nodeType === 1
                && this.node.tagName.toLowerCase().indexOf('ui-') === 0;

            if (this.isComponent) {
                var componentName = utils.line2camel(this.node.tagName.toLowerCase().replace('ui', ''));

                var ComponentClass = this.componentManager.getClass(componentName);
                if (!ComponentClass) {
                    throw new Error('the component `' + componentName + '` is not registed!');
                }
                // 组件本身就应该有的css类名
                this.componentOriginCssClassList = ComponentManager.getCssClassName(ComponentClass);

                this.component = new ComponentClass();
                this.component.parser = this;

                this.mount(options.tree);
            }
        },

        collectExprs: function () {
            if (this.isComponent) {
                this.collectComponentExprs();
            }
            else {
                EventExprParser.prototype.collectExprs.apply(this, arguments);
            }
        },

        mount: function (parentTree) {
            this.component.beforeMount();

            var div = document.createElement('div');
            div.innerHTML = this.component.tpl;
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

            this.tree.registeComponents(this.component.componentClasses);

            insertComponentNodes(this.node, startNode, endNode);

            this.tree.traverse();

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

            this.component.afterMount();
        },

        /**
         * 设置当前节点或者组件的属性
         *
         * @public
         * @param {string} name 属性名
         * @param {*} value 属性值
         */
        setAttr: function (name, value) {
            if (name === 'ref') {
                this.$$ref = value;
                return;
            }

            if (this.isComponent) {
                var scope = this.tree.rootScope;
                scope.set(name, value);
            }
            else {
                EventExprParser.prototype.setAttr.apply(this, arguments);
            }
        },

        /**
         * 获取属性
         *
         * @public
         * @param  {string} name 属性名
         * @return {*}      属性值
         */
        getAttr: function (name) {
            if (this.isComponent) {
                return this.tree.rootScope.get(name);
            }

            return EventExprParser.prototype.getAttr(this, arguments);
        },

        collectComponentExprs: function () {
            var me = this;
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
                        var rawExpr = getRawExpr(expr, this.config);
                        this.exprCalculater.createExprFn(rawExpr);
                        this.exprFns[expr] = utils.bind(calculateExpr, null, rawExpr, this.exprCalculater);

                        this.updateFns[expr] = this.updateFns[expr] || [];
                        this.updateFns[expr].push(utils.bind(setAttrFn, null, attr.nodeName));
                    }
                }
                else {
                    this.setLiteralAttrsFns.push(
                        utils.bind(setAttrFn, null, attr.nodeName, attr.nodeValue)
                    );
                }
            }

            if (!hasClass) {
                this.setLiteralAttrsFns.push(
                    utils.bind(setAttrFn, null, 'class-list', this.componentOriginCssClassList)
                );
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
             * @param {Component} component 组件
             */
            function setAttrFn(name, value) {
                name = utils.line2camel(name);

                // 如果是设置组件css类，就要加上组件自身的css类
                if (name === 'classList') {
                    var classList = me.componentOriginCssClassList;
                    classList.push.apply(classList, DomUpdater.getClassList(value));
                    value = classList;
                }

                me.setAttr(name, value);
            }

            function calculateExpr(rawExpr, exprCalculater, scopeModel) {
                return exprCalculater.calculate(rawExpr, false, scopeModel);
            }

            function getRawExpr(expr, config) {
                return expr.replace(config.getExprRegExp(), function () {
                    return arguments[1];
                });
            }
        },

        /**
         * 获取开始节点
         *
         * @protected
         * @inheritDoc
         * @return {Node}
         */
        getStartNode: function () {
            if (this.isComponent) {
                return this.startNode;
            }

            return EventExprParser.prototype.getStartNode.call(this);
        },

        /**
         * 获取结束节点
         *
         * @protected
         * @inheritDoc
         * @return {Node}
         */
        getEndNode: function () {
            if (this.isComponent) {
                return this.endNode;
            }

            return EventExprParser.prototype.getEndNode.call(this);
        },

        setScope: function () {
            this.scopeModel = this.tree.rootScope;
            EventExprParser.prototype.setScope.apply(this, arguments);

            if (this.isComponent) {
                for (var i = 0, il = this.setLiteralAttrsFns.length; i < il; i++) {
                    this.setLiteralAttrsFns[i](this.component);
                }

                this.component.literalAttrReady();
            }
        },

        getScope: function () {
            return this.tree.rootScope;
        },

        // scopeModel里面的值发生了变化
        onChange: function () {
            if (this.isGoDark) {
                return;
            }

            if (this.isComponent) {
                var exprs = this.exprs;
                var exprOldValues = this.exprOldValues;
                for (var i = 0, il = exprs.length; i < il; i++) {
                    var expr = exprs[i];
                    var exprValue = this.exprFns[expr](this.scopeModel);

                    if (this.dirtyCheck(expr, exprValue, exprOldValues[expr])) {
                        var updateFns = this.updateFns[expr];
                        for (var j = 0, jl = updateFns.length; j < jl; j++) {
                            updateFns[j](exprValue, this.component);
                        }
                    }

                    exprOldValues[expr] = exprValue;
                }
            }
            else {
                EventExprParser.prototype.onChange.apply(this, arguments);
            }
        },

        goDark: function () {
            this.components && this.component.goDark();
            EventExprParser.prototype.goDark.apply(this, arguments);
        },

        restoreFromDark: function () {
            this.components && this.component.restoreFromDark();
            EventExprParser.prototype.restoreFromDark.apply(this, arguments);
        }
    },
    {
        $name: 'ComponentParser'
    }
);

Tree.registeParser(module.exports);
