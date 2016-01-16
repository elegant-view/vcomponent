/**
 * @file 组件基类。
 *       以`ui-`开头的标签都是组件标签。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import ScopeModel from 'vtpl/src/ScopeModel';

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

    static getStyle() {
        return '';
    }
}
