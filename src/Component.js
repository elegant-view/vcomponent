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

export default class Component {
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

    shouldUpdate(expr, exprValue, exprOldValue) {
        // 默认深比较
        return deepEqual(exprOldValue, exprValue);
    }

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
            log.warn(`don't set state data when the component 's state is not \`READY\``);
            return;
        }

        const state = this.$$scopeModel.get('state');
        set(name, value);
        this.$$scopeModel.set({state}, options.isSilent, options.done);

        function set(name, value) {
            if (isClass(name, 'String')) {
                state[name] = value;
            }
            else if (typeof name === 'object') {
                for (let key in name) {
                    if (!name.hasOwnProperty(key)) {
                        continue;
                    }

                    state[key] = name[key];
                }
            }
        }
    }

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
