/**
 * @file 给ExprParser加上处理children的能力
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var ExprParser = require('vtpl/src/parsers/ExprParser');
var Tree = require('vtpl/src/trees/Tree');
var utils = require('vtpl/src/utils');

module.exports = ExprParser.trait(
    {

        /**
         * 此处增加处理children的情况
         *
         * @protected
         * @param {nodes/Node} node  节点
         * @param {*} value 节点值
         */
        setTextNodeValue: function (node, value) {
            if (value && value.$$type === 'CHILDREN') {
                // 如果之前创建了这种子树，直接销毁掉。
                if (this.$$childrenTree) {
                    this.$$childrenTree.destroy();
                }

                var nodesManager = this.tree.getTreeVar('nodesManager');
                this.startNode = nodesManager.createComment('children');
                this.endNode = nodesManager.createComment('/children');

                // 将children节点插入到dom树里面去
                var parentNode = this.node.getParentNode();
                parentNode.insertBefore(this.startNode, this.node);
                var delayFns = [];
                for (var curNode = value.startNode;
                    curNode && !curNode.isAfter(value.endNode);
                    curNode = curNode.getNextSibling()
                ) {
                    delayFns.push(utils.bind(parentNode.insertBefore, parentNode, curNode, this.node));
                }
                for (var i = 0, il = delayFns.length; i < il; ++i) {
                    delayFns[i]();
                }
                parentNode.insertBefore(this.endNode, this.node);
                // 移除之前的文本节点，这个节点现在已经没有用了。
                this.node.remove();
                this.node = null;

                // 创建子树
                this.$$childrenTree = new Tree({
                    startNode: this.startNode,
                    endNode: this.endNode
                });
                this.$$childrenTree.setParent(value.parentTree);
                this.$$childrenTree.rootScope.setParent(value.parentTree.rootScope);
                value.parentTree.rootScope.addChild(this.$$childrenTree.rootScope);

                this.$$childrenTree.traverse();
            }
            else {
                node.setNodeValue(value);
            }
        },

        getStartNode: function () {
            if (this.node) {
                return this.node;
            }

            return this.startNode;
        },

        getEndNode: function () {
            if (this.node) {
                return this.node;
            }

            return this.endNode;
        }
    }
);

Tree.registeParser(module.exports);
