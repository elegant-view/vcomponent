/**
 * @file 组件基类
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var utils = require('vtpl/src/utils');
var Base = require('vtpl/src/Base');

module.exports = Base.extends(
    {

        /**
         * 组件初始化
         *
         * @protected
         */
        initialize: function () {},

        beforeMount: function () {},

        afterMount: function () {},

        beforeDestroy: function () {},

        afterDestroy: function () {},

        literalAttrReady: function () {},

        ref: function (ref) {
            var parserTree = this.parser.tree.tree;

            var ret;
            walk(parserTree, function (parser) {
                if (parser.isComponent && parser.$$ref === ref) {
                    ret = parser.component;
                    return true;
                }
            });
            return ret;

            function walk(parserTree, iteraterFn) {
                for (var i = 0, il = parserTree.length; i < il; ++i) {
                    var parserObj = parserTree[i];

                    // 针对if指令的情况
                    if (utils.isArray(parserObj)) {
                        if (walk(parserObj, iteraterFn)) {
                            return true;
                        }
                        continue;
                    }

                    // 针对for指令的情况
                    if (utils.isArray(parserObj.trees)) {
                        for (var j = 0, jl = parserObj.trees.length; j < jl; ++j) {
                            if (walk(parserObj.trees[j].tree, iteraterFn)) {
                                return true;
                            }
                        }
                        continue;
                    }

                    if (iteraterFn(parserObj.parser)) {
                        return true;
                    }

                    if (parserObj.children && parserObj.children.length) {
                        if (walk(parserObj.children, iteraterFn)) {
                            return true;
                        }
                    }
                }
            }
        },

        /**
         * 组件模板。子类可以覆盖这个属性。
         *
         * @protected
         * @type {String}
         */
        tpl: '',

        /**
         * 销毁
         *
         * @public
         */
        destroy: function () {
            this.beforeDestroy();

            this.afterDestroy();
        },

        setData: function (name, value) {
            var scope = this.parser.tree.rootScope;
            scope.set(name, value);
        }
    },
    {

        /**
         * 获取样式字符串。
         *
         * @static
         * @return {string} 样式字符串
         */
        getStyle: function () {
            return '';
        },

        $name: 'Component'
    }
);

