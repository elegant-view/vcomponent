/**
 * @file 给ExprParser加上处理组件props.children的能力；
 *       给ExprParser加上记录子孙的功能。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import ExprParser from 'vtpl/parsers/ExprParser';
import Tree from 'vtpl/trees/Tree';
import {bind} from 'vtpl/utils';
import Children from './data/Children';

export default class ExprParserEnhance extends ExprParser {

    /**
     * 此处增加处理children的情况
     *
     * @protected
     * @param {string} attrName  属性名
     * @param {string|Object} value 值
     */
    setAttr(attrName, value) {
        if (value && value instanceof Children) {
            // 如果之前创建了这种子树，直接销毁掉。
            if (this.$$childrenTree) {
                throw new Error('already have a child tree.');
            }

            let nodesManager = this.tree.getTreeVar('nodesManager');
            this.startNode = nodesManager.createComment('children');
            this.endNode = nodesManager.createComment('/children');

            // 将children节点插入到dom树里面去
            let parentNode = this.node.getParentNode();
            parentNode.insertBefore(this.startNode, this.node);
            let delayFns = [];
            for (let curNode = value.getStartNode();
                 curNode && !curNode.isAfter(value.getEndNode());
                 curNode = curNode.getNextSibling()
            ) {
                delayFns.push(bind(parentNode.insertBefore, parentNode, curNode, this.node));
            }
            for (let i = 0, il = delayFns.length; i < il; ++i) {
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
            this.$$childrenTree.setParent(value.getParentTree());
            this.$$childrenTree.rootScope.setParent(value.getParentTree().rootScope);
            value.getParentTree().rootScope.addChild(this.$$childrenTree.rootScope);

            this.$$childrenTree.compile();
            this.$$childrenTree.link();
            this.$$childrenTree.initRender();
        }
        else if (attrName === 'ref') {
            this.$$ref = value;
            let children = this.tree.getTreeVar('children');
            children[value] = this.node;
        }
        else {
            super.setAttr(attrName, value);
        }
    }

    getStartNode() {
        if (this.node) {
            return this.node;
        }

        return this.startNode;
    }

    getEndNode() {
        if (this.node) {
            return this.node;
        }

        return this.endNode;
    }

    getTaskId(attrName) {
        let node = this.node;
        if (this.$$childrenTree) {
            node = this.startNode;
        }

        return this.tree.getTreeVar('domUpdater').generateNodeAttrUpdateId(node, attrName);
    }

    destroy() {
        if (this.$$childrenTree) {
            this.$$childrenTree.destroy();
        }

        if (this.$$ref) {
            let children = this.tree.getTreeVar('children');
            children[this.$$ref] = null;
            delete children[this.$$ref];
        }

        this.removeFromDOM(this.node, this.node);
        this.removeFromDOM(this.startNode, this.endNode);

        super.destroy();
    }

    goDark() {
        if (this.$$childrenTree) {
            this.$$childrenTree.goDark();
        }
        else {
            super.goDark();
        }
    }

    restoreFromDark() {
        if (this.$$childrenTree) {
            this.$$childrenTree.restoreFromDark();
        }
        else {
            super.restoreFromDark();
        }
    }
}
