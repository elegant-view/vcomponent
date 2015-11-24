/**
 * @file 组件管理。ComponentManager也是有层级关系的，
 *       Tree下面的ComponentManager注册这个Tree实例用到的Component，
 *       而在Component中也可以注册此Component的tpl中将会使用到的Component。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

function ComponentManager() {
    this.components = {};
}

ComponentManager.prototype.registe = function (ComponentClass) {
    var name = ComponentClass.$name;
    this.components[name] = ComponentClass;
    this.mountStyle(name);
};

/**
 * 根据名字获取组件类
 *
 * @public
 * @param  {string} name 组件名
 * @return {ComponentClass}  组件类
 */
ComponentManager.prototype.getClass = function (name) {
    var component = this.components[name];
    if (component) {
        return component;
    }

    if (this.parent) {
        component = this.parent.getClass(name);
    }

    return component;
};

/**
 * 设置父级组件管理器
 *
 * @public
 * @param {ComponentManger} componentManager 组件管理器
 */
ComponentManager.prototype.setParent = function (componentManager) {
    this.parent = componentManager;
};

/**
 * 将组件的样式挂载上去
 *
 * @private
 * @param {string} componentClassName 组件js类名
 */
ComponentManager.prototype.mountStyle = function (componentClassName) {
    var style = this.components[componentClassName].getStyle();

    var styleNode = document.createElement('style');
    styleNode.innerHTML = style.replace(
        /#root#/g,
        '.' + this.components[componentClassName].getComponentClassName()
    );
    document.head.appendChild(styleNode);
};


module.exports = ComponentManager;

