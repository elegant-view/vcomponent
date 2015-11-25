var Tree = require('dom-data-bind/src/trees/Tree');
var ComponentParser = require('./ComponentParser');
var Event = require('dom-data-bind/src/Event');
var utils = require('dom-data-bind/src/utils');
var ComponentManager = require('./ComponentManager');

module.exports = Tree.extends({
    $name: 'ComponentTree',

    initialize: function (options) {
        Tree.prototype.initialize.apply(this, arguments);

        this.componentEvent = new Event();
        if (options.componentChildren) {
            this.setTreeVar('componentChildren', options.componentChildren);
        }

        var componentManager = new ComponentManager();
        componentManager.setParent(this.getTreeVar('componentManager'));
        this.setTreeVar('componentManager', componentManager);
    },

    createParser: function (ParserClass, options) {
        var instance = Tree.prototype.createParser.apply(this, arguments);

        if (instance && ParserClass === ComponentParser) {
            instance.parser.setComponentEvent(this.componentEvent);
        }

        return instance;
    },

    /**
     * 注册组件类
     * 设置绑定在树上面的额外变量。这些变量有如下特性：
     * 1、无法覆盖；
     * 2、在获取treeVars上面某个变量的时候，如果当前树取出来是undefined，那么就会到父级树的treeVars上去找，以此类推。
     *
     * @public
     * @param  {Map.<string, Component>} componentClasses 组件名和组件类的映射
     * @param {string} name  变量名
     * @param {*} value 变量值
     */
    registeComponents: function (componentClasses) {
        if (!utils.isPureObject(componentClasses)) {
            return;
        }

        var componentManager = this.getTreeVar('componentManager');
        for (var name in componentClasses) {
            var componentClass = componentClasses[name];
            // 此处占用了组件类上的name属性，外部不要用这个属性
            componentClass.$name = name;
            componentManager.registe(componentClass);
        }
    }
});