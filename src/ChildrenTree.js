/**
 * @file 子树
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var Tree = require('vtpl/src/trees/Tree');

module.exports = Tree.extends(
    {
        initialize: function (options) {
            if (!options.config
                || !options.domUpdater
                || !options.exprCalculater
            ) {
                throw new Error('wrong arguments');
            }

            options.componentChildren = undefined;
            delete options.componentChildren;

            Tree.prototype.initialize.apply(this, arguments);
        }
    },
    {
        $name: 'ChildrenTree'
    }
);
