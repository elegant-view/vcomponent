/**
 * @file vcomponent主文件
 * @author  yibuyisheng(yibuyisheng@163.com)
 */

import './ComponentParser';
import './ChildrenParser';

import ComponentManager from './ComponentManager';
import VTpl from 'vtpl';
import Component from './Component';

function VComponent(options) {
    this.$vtpl = new VTpl(options);
    this.$vtpl.$tree.setTreeVar('componentManager', new ComponentManager());
}

VComponent.prototype.render = function () {
    this.$vtpl.render();
};

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
VComponent.prototype.registerComponents = function (componentClasses) {
    var componentManager = this.$vtpl.$tree.getTreeVar('componentManager');
    componentManager.register(componentClasses);
};

VComponent.prototype.destroy = function () {
    var componentManager = this.$vtpl.$tree.getTreeVar('componentManager');
    componentManager.destroy();

    this.$vtpl.destroy();
};

VComponent.Component = Component;

export default VComponent;
