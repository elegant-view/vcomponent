/**
 * @file 组件基类。
 *       以`ui-`开头的标签都是组件标签。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Base from 'vtpl/src/Base';
import ScopeModel from 'vtpl/src/ScopeModel';

module.exports = Base.extends(
    {

        /**
         * 组件初始化
         *
         * @private
         */
        initialize: function () {
            this.props = new ScopeModel();
            this.state = new ScopeModel();

            this.props.set(this.getDefaultProps());
            this.state.set(this.getInitialState());

            this.refs = {};
        },

        getTemplate: function () {
            return '';
        },

        getInitialState: function () {
            return {};
        },

        getDefaultProps: function () {
            return {};
        },

        componentWillReceiveProps: function (name, nextValue) {
            return nextValue;
        },

        shouldComponentUpdate: function (nextProps, nextState) {
            return true;
        },

        componentDidMount: function () {},

        componentWillMount: function () {},

        componentWillUnmount: function () {},

        ref: function (ref) {
            return this.parser.ref(ref);
        },

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

