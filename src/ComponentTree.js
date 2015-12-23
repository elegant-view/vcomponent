/**
 * @file 处理组件的树，继承自vtpl/trees/Tree
 * @author zhangli25(zhangli25@baidu.com)
 */

var Tree = require('vtpl/src/trees/Tree');
var utils = require('vtpl/src/utils');

module.exports = Tree.extends({

    initialize: function (options) {
        Tree.prototype.initialize.apply(this, arguments);
    },
}, {
    $name: 'ComponentTree'
});
