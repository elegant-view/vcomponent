/**
 * @file 组件基类
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var utils = require('vtpl/src/utils');
var ComponentTree = require('./ComponentTree');
var ComponentChildren = require('./ComponentChildren');
var ComponentManager = require('./ComponentManager');
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

