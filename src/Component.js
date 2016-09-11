/**
 * @file 组件基类。
 *       以`ui-`开头的标签都是组件标签。
 *       组件的生命周期状态（$$state）在ComponentParser中维护
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import componentState from './componentState';
import log from 'vtpl/log';
import {isClass} from './utils';
import deepEqual from 'vtpl/deepEqual';
import clone from 'vtpl/clone';

const TYPE_KEY = Symbol('type');

export function type(typeStr) {
    return function (target) {
        target[TYPE_KEY] = typeStr;
    };
}

export function getType(componentClass) {
    return componentClass[TYPE_KEY] || componentClass.name;
}

/**
 * Component
 *
 * @class
 */
export default class Component {

    /**
     * 构造函数
     *
     * @public
     */
    constructor() {
        this.refs = {};

        // 在parser里面维护
        this.$$state = null;
        // 在parser里面设置
        this.$$scopeModel = null;

        this.state = {};
        this.props = {};
    }

    /**
     * 组件模板字符串
     *
     * @public
     * @return {string} 模板字符串
     */
    getTemplate() {
        return '';
    }

    /**
     * 销毁组件
     *
     * @public
     */
    destroy() {}

    /**
     * 是否应该更新DOM
     *
     * @public
     * @param  {string} expr         表达式
     * @param  {*} exprValue    新的表达式值
     * @param  {*} exprOldValue 老的表达式值
     * @return {boolean}
     */
    shouldUpdate(expr, exprValue, exprOldValue) {
        // 默认深比较
        return deepEqual(exprOldValue, exprValue);
    }

    /**
     * 克隆表达式计算出来的数据。
     * 子类可以覆盖这个方法，提供自定义的、更高效的克隆方式。
     *
     * @public
     * @param  {string} expr             表达式
     * @param  {*} expressionObject 表达式计算出来的数据
     * @return {*}
     */
    cloneExpressionObject(expr, expressionObject) {
        return clone(expressionObject);
    }

    /**
     * 组件初始化数据都进来了，尚未挂载到DOM树上
     *
     * @public
     * @deprecated
     */
    ready() {}

    /**
     * 组件初始化数据都进来了，尚未挂载到DOM树上
     *
     * @public
     */
    init() {
        this.ready();
    }

    /**
     * 初始化完成后，挂载到了DOM树上
     *
     * @public
     * @deprecated
     */
    initMounted() {}

    /**
     * props发生了变化，注意：此处还未将props更新到DOM上去
     *
     * @public
     * @param {Object} changedProps 发生改变的props
     */
    propsChange(changedProps) {}

    /**
     * props的改变已经体现到了DOM树上
     *
     * @public
     * @param {Object} changedProps 发生改变的props
     */
    propsChangeMounted(changedProps) {}

    /**
     * 拿到本组件内部使用到的组件类，是一种配置。
     *
     * @public
     * @return {Array.<Component>} 组件类数组
     */
    getComponentClasses() {
        return [];
    }

    /**
     * 设置state值
     *
     * @protected
     * @param {string|Object} name    字符串或者对象
     * @param {*} value   要设置的值
     * @param {Object=} options 配置参数
     */
    setState(name, value, options = {}) {
        if (this.$$state !== componentState.READY) {
            log.warn('don\'t set state data when the component\'s state is not `READY`');
            return;
        }

        const state = this.$$scopeModel.get('state');
        if (isClass(name, 'String')) {
            state[name] = value;
            this.$$scopeModel.set({state}, options.isSilent, options.done);
        }
        else if (name && isClass(name, 'Object')) {
            /* eslint-disable guard-for-in,fecs-use-for-of */
            for (let key in name) {
                state[key] = name[key];
            }
            /* eslint-enable guard-for-in,fecs-use-for-of */
            this.$$scopeModel.set({state}, options.isSilent, options.done);
        }
    }

    /**
     * 组件被隐藏了,很可能DOM元素脱离了DOM树
     *
     * @public
     */
    beforeHide() {}

    /**
     * 组件显示出来了,DOM元素回到了DOM树中
     *
     * @public
     */
    afterShow() {}

    static getPropsCheckFns() {
        return {};
    }

    /**
     * 获取组件样式
     *
     * @static
     * @public
     * @return {string} 样式
     */
    static getStyle() {
        return '';
    }
}
