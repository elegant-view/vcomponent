var Tree = require('vtpl/src/trees/Tree');
var Event = require('vtpl/src/Event');
var utils = require('vtpl/src/utils');
var ComponentManager = require('./ComponentManager');

module.exports = Tree.extends({

    initialize: function (options) {
        Tree.prototype.initialize.apply(this, arguments);

        if (options.componentChildren) {
            this.setTreeVar('componentChildren', options.componentChildren);
        }

        var componentManager = new ComponentManager();
        this.setTreeVar('componentManager', componentManager);
    },

    setParent: function (parentTree) {
        Tree.prototype.setParent.apply(this, arguments);

        parentTree.rootScope.addChild(this.rootScope);
        this.rootScope.setParent(parentTree.rootScope);
    },

    createParser: function (ParserClass, options) {
        var instance = Tree.prototype.createParser.apply(this, arguments);

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
        if (!utils.isArray(componentClasses)) {
            return;
        }

        var componentManager = this.getTreeVar('componentManager');

        for (var i = 0, il = componentClasses.length; i < il; ++i) {
            var componentClass = componentClasses[i];
            componentManager.registe(componentClass);
        }
    }
}, {
    $name: 'ComponentTree'
});
