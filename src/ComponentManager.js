/**
 * @file 组件管理。ComponentManager也是有层级关系的，
 *       Tree下面的ComponentManager注册这个Tree实例用到的Component，
 *       而在Component中也可以注册此Component的tpl中将会使用到的Component。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import utils from './utils';

export default class ComponentManager {
    constructor() {
        this.components = {};
    }

    /**
     * 批量注册组件
     *
     * @public
     * @param  {Array.<Class>} componentClasses 组件类数组
     */
    register(componentClasses) {
        if (!utils.isArray(componentClasses)) {
            return;
        }
        for (let i = 0, il = componentClasses.length; i < il; ++i) {
            let ComponentClass = componentClasses[i];
            if (!ComponentClass) {
                throw new Error('the `ComponentClass` passed in is undefined, please check your code.');
            }
            let name = ComponentClass.name;
            this.components[name] = ComponentClass;
            this.mountStyle(ComponentClass);
        }
    }


    /**
     * 根据名字获取组件类。在模板解析的过程中会调用这个方法。
     *
     * @public
     * @param  {string} name 组件名
     * @return {ComponentClass}  组件类
     */
    getClass(name) {
        let component = this.components[name];
        if (component) {
            return component;
        }

        if (this.parent) {
            component = this.parent.getClass(name);
        }

        return component;
    }

    /**
     * 设置父级组件管理器
     *
     * @public
     * @param {ComponentManger} componentManager 组件管理器
     */
    setParent(componentManager) {
        this.parent = componentManager;
    }

    /**
     * 将组件的样式挂载上去
     *
     * @private
     * @param {Class} ComponentClass 组件类
     */
    mountStyle(ComponentClass) {
        let componentName = ComponentClass.name;
        let styleNodeId = 'component-' + componentName;

        // 判断一下，避免重复添加css
        if (!document.getElementById(styleNodeId)) {
            let style = (ComponentClass.getStyle instanceof Function && ComponentClass.getStyle()) || '';
            if (style) {
                let styleNode = document.createElement('style');
                styleNode.setAttribute('id', styleNodeId);
                styleNode.innerText = style;
                document.head.appendChild(styleNode);
            }
        }

        // 将父类的css样式也加上去。父类很可能没注册，如果此处不加上去，样式可能就会缺一块。
        if (componentName !== 'Component') {
            this.mountStyle(utils.getSuper(ComponentClass));
        }
    }

    /**
     * 卸载掉组件样式
     *
     * @private
     * @param {Class} ComponentClass 组件类
     */
    unmountStyle(ComponentClass) {
        let componentName = ComponentClass.name;
        let styleNodeId = 'component-' + componentName;

        let el = document.getElementById(styleNodeId);
        if (el) {
            el.parentNode.removeChild(el);
        }

        if (componentName !== 'Component') {
            this.unmountStyle(utils.getSuper(ComponentClass));
        }
    }

    destroy() {
        /* eslint-disable guard-for-in */
        for (let name in this.components) {
        /* eslint-enable guard-for-in */
            this.unmountStyle(this.components[name]);
        }

        this.components = null;
    }
}
