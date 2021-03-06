/**
 * @file 组件管理。ComponentManager也是有层级关系的，
 *       Tree下面的ComponentManager注册这个Tree实例用到的Component，
 *       而在Component中也可以注册此Component的tpl中将会使用到的Component。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import {isArray} from './utils';
import {getType} from './Component';

/**
 * ComponentManager
 *
 * @class
 */
export default class ComponentManager {

    /**
     * constructor
     *
     * @public
     */
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
        if (!isArray(componentClasses)) {
            return;
        }
        for (let i = 0, il = componentClasses.length; i < il; ++i) {
            let ComponentClass = componentClasses[i];
            if (!ComponentClass) {
                throw new Error('the `ComponentClass` passed in is undefined, please check your code.');
            }
            let name = getType(ComponentClass);
            this.components[name] = ComponentClass;
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
     * 销毁
     *
     * @public
     */
    destroy() {
        this.components = null;
    }
}
