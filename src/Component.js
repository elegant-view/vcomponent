/**
 * @file 组件基类。
 *       以`ui-`开头的标签都是组件标签。
 *       组件的生命周期状态（$$state）在ComponentParser中维护
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import componentState from './componentState';
import log from 'vtpl/log';
import {isClass, type} from './utils';
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

    getTemplate() {
        return '';
    }

    destroy() {}

    shouldUpdate(expr, exprValue, exprOldValue) {
        // 默认深比较
        return deepEqual(exprOldValue, exprValue);
    }

    cloneExpressionObject(expr, expressionObject) {
        return clone(expressionObject);
    }

    propsChange() {}

    ready() {}

    getComponentClasses() {}

    setState(name, value, options) {
        options = options || {};
        if (this.$$state !== componentState.READY) {
            return log.warn(`don't set state data when the component 's state is not \`READY\``);
        }

        const state = this.$$scopeModel.get('state');
        set(name, value);
        this.$$scopeModel.set({state}, options.isSilent, options.done);

        function set(name, value) {
            if (isClass(name, 'String')) {
                state[name] = value;
            }
            else if (type(name) === 'object') {
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

    static getStyle() {
        return '';
    }
}
