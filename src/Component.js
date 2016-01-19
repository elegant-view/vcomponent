/**
 * @file 组件基类。
 *       以`ui-`开头的标签都是组件标签。
 *       组件的生命周期状态（$$state）在ComponentParser中维护
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import ScopeModel from 'vtpl/src/ScopeModel';
import componentState from './componentState';
import log from 'vtpl/src/log';

export default class Component {
    constructor() {
        this.props = new ScopeModel();
        this.state = new ScopeModel();

        this.refs = {};
    }

    getTemplate() {
        return '';
    }

    destroy() {}

    shouldUpdate(expr, exprValue, exprOldValue) {
        return exprOldValue !== exprValue;
    }

    ready() {}

    setState(...args) {
        if (this.$$state !== componentState.READY) {
            return log.warn(`don't set state data when the component 's state is not \`READY\``);
        }

        this.state.set(...args);
    }

    static getStyle() {
        return '';
    }
}
