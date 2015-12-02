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
            return this.parser.ref(ref);
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
            this.parser.setAttr(name, value);
        },

        getData: function (name) {
            return this.parser.getAttr(name);
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

