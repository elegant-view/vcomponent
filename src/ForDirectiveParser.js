/**
 * @file 增强for指令
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var ForDirectiveParser = require('vtpl/src/parsers/ForDirectiveParser');
var ForTree = require('vtpl/src/trees/ForTree');

module.exports = ForDirectiveParser.extends(
    {
        setCssClass: function (classList) {
            this.$$classList = classList;
            for (var i = 0, il = this.trees.length; i < il; ++i) {
                var tree = this.trees[i];
                setClasses(tree, classList);
            }
        },

        createTree: function () {
            var tree = ForDirectiveParser.prototype.createTree.apply(this, arguments);
            setClasses(tree, this.$$classList);
            return tree;
        },

        setAttr: function (name, value) {
            if (name === 'class') {
                this.setCssClass(value);
            }
        }
    },
    {
        $name: 'ForDirectiveParser'
    }
);

function setClasses(tree, classList) {
    for (var j = 0, jl = tree.tree.length; j < jl; ++j) {
        tree.tree[j].parser.setAttr('class', classList);
    }
}

ForTree.registeParser(module.exports);
