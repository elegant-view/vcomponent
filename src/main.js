/**
 * @file vcomponent主文件
 * @author  yibuyisheng(yibuyisheng@163.com)
 */

require('./ChildrenDirectiveParser');
require('./ForDirectiveParser');
require('./IfDirectiveParser');
require('./ComponentParser');
require('./NodeParser');

var ComponentTree = require('./ComponentTree');
var vtpl = require('vtpl');

module.exports = {
    Component: require('./Component'),
    mount: function (options, ComponentClasses) {
        options.config = options.config || new vtpl.Config();
        var tree = new ComponentTree(options);
        tree.registeComponents(ComponentClasses);
        tree.traverse();
        return tree;
    },
    Config: vtpl.Config
};

