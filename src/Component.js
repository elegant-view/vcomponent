/**
 * @file 组件基类。
 *       以`ui-`开头的标签都是组件标签。
 *       组件的生命周期状态（$$state）在ComponentParser中维护
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import componentState from './componentState';
import log from 'vtpl/src/log';
import {isClass, type} from './utils';

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
        return exprOldValue !== exprValue;
    }
    propsChange() {}

    ready() {}

    setState(...args) {
        if (this.$$state !== componentState.READY
            && this.$$state !== componentState.BEFORE_RENDER
        ) {
            return log.warn(`don't set state data when the component 's state is not \`READY\` or \`BEFORE_RENDER\``);
        }

        // 如果当前setState调用是在beforeRender里面，则静默改变state
        if (this.$$state === componentState.BEFORE_RENDER && args.length < 3) {
            args.push(true);
        }

        let state = this.$$scopeModel.get('state');
        set(...args);
        this.$$scopeModel.set({state});

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

    static getStyle() {
        return '';
    }
}
