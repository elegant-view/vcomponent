require('./ChildrenDirectiveParser');
require('./ForDirectiveParser');
require('./IfDirectiveParser');

var ComponentTree = require('./ComponentTree');
var domDataBind = require('vtpl');

module.exports = {
    Component: require('./Component'),
    mount: function (options, ComponentClasses) {
        var tree = new ComponentTree(options);
        tree.registeComponents(ComponentClasses);
        tree.traverse();
        return tree;
    },
    Config: domDataBind.Config
};
