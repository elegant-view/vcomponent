require('./ChildrenDirectiveParser');
require('./ForDirectiveParser');
require('./IfDirectiveParser');
require('./ComponentParser');

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


window.getParserByDomNode = function getParserByDomNode(node, tree) {
    var ret;
    walkParsers(tree.tree, function (parser) {
        if (parser.constructor.$name === 'ComponentParser') {
            if (node === parser.node || node === parser.startNode || node === parser.endNode) {
                ret = parser;
                return true;
            }
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
                for (var j = 0, jl = parserObj.parser.branches; j < jl; ++j) {
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
};

