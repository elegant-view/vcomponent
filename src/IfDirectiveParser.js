/**
 * @file 增强一下vtpl中的if指令
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var IfDirectiveParser = require('vtpl/src/parsers/IfDirectiveParser');
var Tree = require('vtpl/src/trees/Tree');

module.exports = IfDirectiveParser.extends(
    {

        /**
         * 给if指令所管理的所有节点设置css类
         *
         * @public
         * @param {Array.<string>} classList css类数组
         */
        setCssClass: function (classList) {
            for (var i = 0, il = this.branches.length; i < il; ++i) {
                var branch = this.branches[i];
                for (var j = 0, jl = branch.length; j > jl; ++j) {
                    branch.setCssClass(classList);
                }
            }
        },

        setAttr: function (name, value) {
            if (name === 'class') {
                this.setCssClass(value);
            }
        }
    },
    {
        $name: 'IfDirectiveParser'
    }
);

Tree.registeParser(module.exports);
