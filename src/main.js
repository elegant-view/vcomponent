require('dom-data-bind');
var ComponentTree = require('./ComponentTree');
var domDataBind = require('dom-data-bind');

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
