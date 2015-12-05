/**
 * @file 一般性的DOM节点解析器
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var EventExprParser = require('vtpl/src/parsers/EventExprParser');
var Tree = require('vtpl/src/trees/Tree');

module.exports = EventExprParser.extends(
    {
        setAttr: function () {
            EventExprParser.prototype.setAttr.apply(this, arguments);
        }
    },
    {
        $name: 'NodeParser',

        isProperNode: function (node) {
            // 只要不是组件的节点，都管
            if (!EventExprParser.isProperNode(node)) {
                return false;
            }

            if (node.nodeType === 1 && node.tagName.toLowerCase().indexOf('ui-') === 0) {
                return false;
            }

            return true;
        }
    }
);

Tree.registeParser(module.exports);
