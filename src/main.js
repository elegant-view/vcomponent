/**
 * @file vcomponent主文件
 * @author  yibuyisheng(yibuyisheng@163.com)
 */

import ComponentParser from './ComponentParser';
import ExprParserEnhance from './ExprParserEnhance';

import ComponentManager from './ComponentManager';
import VTpl from 'vtpl';

export default class VComponent {
    constructor(options) {
        /**
         * @protected
         */
        this.vtpl = new VTpl(options);

        this.vtpl.registerParser(ExprParserEnhance);
        this.vtpl.registerParser(ComponentParser);

        this.vtpl.tree.setTreeVar('componentManager', new ComponentManager());
        this.vtpl.tree.setTreeVar('children', {});
    }

    render(done) {
        this.vtpl.render(done);
    }

    setData(...args) {
        this.vtpl.setData(...args);
    }

    getData(...args) {
        let scope = this.vtpl.tree.rootScope;
        return scope.get(...args);
    }

    /**
     * 注册组件类
     * 设置绑定在树上面的额外变量。这些变量有如下特性：
     * 1、无法覆盖；
     * 2、在获取treeVars上面某个变量的时候，如果当前树取出来是undefined，那么就会到父级树的treeVars上去找，以此类推。
     *
     * @public
     * @param {Array.<Component>} componentClasses 一堆组件
     * @param {string} name  变量名
     * @param {*} value 变量值
     */
    registerComponents(componentClasses) {
        let componentManager = this.vtpl.tree.getTreeVar('componentManager');
        componentManager.register(componentClasses);
    }

    destroy() {
        const componentManager = this.vtpl.tree.getTreeVar('componentManager');
        componentManager.destroy();

        this.vtpl.destroy();
    }

    ref(name) {
        const children = this.vtpl.tree.getTreeVar('children') || {};
        return children[name];
    }
}
