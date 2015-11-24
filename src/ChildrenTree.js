/**
 * @file 子树
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var Tree = require('dom-data-bind/trees/Tree');

module.exports = Tree.extends(
    {
        initialize: function (options) {
            if (!options.config || !options.domUpdater
                || !options.exprCalculater || !options.treeVars
                || !options.componentManager
            ) {
                throw new Error('wrong arguments');
            }

            options.componentChildren = undefined;
            delete options.componentChildren;

            this.$super.initialize(options);
        }
    }
);
