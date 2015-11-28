/**
 * @file 组件解析器
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var Parser = require('vtpl/src/parsers/Parser');
var Tree = require('vtpl/src/trees/Tree');
var utils = require('vtpl/src/utils');

module.exports = Parser.extends(
    {

        initialize: function (options) {
            Parser.prototype.initialize.apply(this, arguments);

            this.componentManager = this.tree.getTreeVar('componentManager');

            this.node = options.node;

            this.exprs = [];
            this.exprFns = {};
            this.updateFns = {};
            this.exprOldValues = {};
        },

        setComponentEvent: function (event) {
            this.componentEvent = event;
        },

        collectExprs: function () {
            var curNode = this.node;

            var attributes = curNode.attributes;
            // 搜集不含有表达式的属性，然后在组件类创建好之后设置进组件
            this.setLiteralAttrsFns = [];
            for (var i = 0, il = attributes.length; i < il; i++) {
                var attr = attributes[i];
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

            var componentName = this.node.tagName.toLowerCase()
                .replace('ui', '')
                .replace(/-[a-z]/g, function () {
                    return arguments[0][1].toUpperCase();
                });

            var ComponentClass = this.componentManager.getClass(componentName);
            if (!ComponentClass) {
                throw new Error('the component `' + componentName + '` is not registed!');
            }

            this.component = new ComponentClass({
                componentNode: this.node,
                tree: this.tree
            });
            if (this.componentEvent) {
                this.componentEvent.trigger('newcomponent', this.component);
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
            function setAttrFn(name, value, component) {
                component.setAttr(utils.line2camel(name), value);
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
            if (!this.component) {
                return this.node;
            }

            return this.component.startNode;
        },

        /**
         * 获取结束节点
         *
         * @protected
         * @inheritDoc
         * @return {Node}
         */
        getEndNode: function () {
            if (!this.component) {
                return this.node;
            }

            return this.component.endNode;
        },

        setScope: function (scopeModel) {
            Parser.prototype.setScope.apply(this, arguments);

            this.component.setOutScope(this.scopeModel);

            this.component.mount();

            for (var i = 0, il = this.setLiteralAttrsFns.length; i < il; i++) {
                this.setLiteralAttrsFns[i](this.component);
            }

            this.component.literalAttrReady();
        },

        onChange: function () {
            if (this.isGoDark) {
                return;
            }

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

            Parser.prototype.onChange.apply(this, arguments);
        },

        goDark: function () {
            this.component.goDark();
            this.isGoDark = true;
        },

        restoreFromDark: function () {
            this.component.restoreFromDark();
            this.isGoDark = false;
        }
    },
    {
        isProperNode: function (node, config) {
            return node.nodeType === 1
                && node.tagName.toLowerCase().indexOf('ui-') === 0;
        },

        $name: 'ComponentParser'
    }
);

Tree.registeParser(module.exports);
