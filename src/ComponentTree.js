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
    },

    /**
     * 根据DOM节点找到对应的解析器对象，主要用于debug。
     *
     * @public
     * @param  {Node} node dom节点
     * @return {(Parser|undefined)}  解析器对象
     */
    parser: function (node) {
        var ret;
        walkParsers(this.tree, function (parser) {
            if (node === parser.node
                || node === parser.startNode
                || node === parser.endNode
            ) {
                ret = parser;
                return true;
            }
        });
        return ret;

        function walkParsers(parsers, iteraterFn) {
            for (var i = 0, il = parsers.length; i < il; ++i) {
                var parserObj = parsers[i];
                if (iteraterFn(parserObj.parser)) {
                    return true;
                }

                // for指令
                if (parserObj.parser.trees && parserObj.parser.trees) {
                    for (var j = 0, jl = parserObj.parser.trees.length; j < jl; ++j) {
                        if (walkParsers(parserObj.parser.trees[j].tree, iteraterFn)) {
                            return true;
                        }
                    }
                }
                // if指令
                else if (parserObj.parser.branches) {
                    for (j = 0, jl = parserObj.parser.branches; j < jl; ++j) {
                        if (walkParsers(parserObj.parser.branches[j], iteraterFn)) {
                            return true;
                        }
                    }
                }
                // 组件
                else if (parserObj.parser.isComponent) {
                    if (walkParsers(parserObj.parser.tree.tree, iteraterFn)) {
                        return true;
                    }
                }

                if (walkParsers(parserObj.children, iteraterFn)) {
                    return true;
                }
            }
        }
    }
}, {
    $name: 'ComponentTree'
});
