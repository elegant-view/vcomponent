/**
 * @file 组件管理。ComponentManager也是有层级关系的，
 *       Tree下面的ComponentManager注册这个Tree实例用到的Component，
 *       而在Component中也可以注册此Component的tpl中将会使用到的Component。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var utils = require('dom-data-bind/src/utils');

function ComponentManager() {
    this.components = {};
}

/**
 * 注册组件。
 *
 * @public
 * @param  {Constructor} ComponentClass 组件类
 * @param  {string=} name           组件名，可选
 */
ComponentManager.prototype.registe = function (ComponentClass) {
    var name = ComponentClass.$name;
    this.components[name] = ComponentClass;
    this.mountStyle(ComponentClass);
};

/**
 * 根据名字获取组件类。在模板解析的过程中会调用这个方法。
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
 * @param {组件类} ComponentClass 组件类
 */
ComponentManager.prototype.mountStyle = function (ComponentClass) {
    var styleNodeId = 'component-' + ComponentClass.$name;

    // 判断一下，避免重复添加css
    if (!document.getElementById(styleNodeId)) {
        var style = ComponentClass.getStyle();

        var styleNode = document.createElement('style');
        styleNode.setAttribute('id', styleNodeId);
        styleNode.innerHTML = style.replace(
            /#root#/g,
            '.' + ComponentManager.getCssClassName(ComponentClass).join('.')
        );
        document.head.appendChild(styleNode);
    }

    // 将父类的css样式也加上去。父类很可能没注册，如果此处不加上去，样式可能就会缺一块。
    if (ComponentClass.$name !== 'Component') {
        this.mountStyle(ComponentClass.$superClass);
    }
};

/**
 * 获取组件的css类名。规则是根据继承关系，进行类名拼接，从而使子组件类的css具有更高优先级。
 *
 * @static
 * @param {Constructor} ComponentClass 组件类
 * @return {Array.<string>} 合成类名数组
 */
ComponentManager.getCssClassName = function (ComponentClass) {
    var name = [];
    for (var curCls = ComponentClass; curCls; curCls = curCls.$superClass) {
        name.push(utils.camel2line(curCls.$name));

        // 最多到组件基类
        if (curCls.$name === 'Component') {
            break;
        }
    }
    return name;
};


module.exports = ComponentManager;

