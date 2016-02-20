/**
 * @file 给ExprParser加上处理组件props.children的能力；
 *       给ExprParser加上记录子孙的功能。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import ExprParser from 'vtpl/src/parsers/ExprParser';
import Tree from 'vtpl/src/trees/Tree';
import {bind} from 'vtpl/src/utils';
import Children from './data/Children';

let setAttrOld = ExprParser.prototype.setAttr;

/**
 * 此处增加处理children的情况
 *
 * @protected
 * @param {string} attrName  属性名
 * @param {string|Object} value 值
 */
ExprParser.prototype.setAttr = function setTextNodeValue(attrName, value) {
    if (value && value instanceof Children) {
        // 如果之前创建了这种子树，直接销毁掉。
        if (this.$$childrenTree) {
            this.$$childrenTree.destroy();
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
        setAttrOld.call(this, attrName, value);
    }
};

ExprParser.prototype.getStartNode = function getStartNode() {
    if (this.node) {
        return this.node;
    }

    return this.startNode;
};

ExprParser.prototype.getEndNode = function getEndNode() {
    if (this.node) {
        return this.node;
    }

    return this.endNode;
};

let destroyOld = ExprParser.prototype.destroy;
ExprParser.prototype.destroy = function destroy() {
    // TODO: destroy the `childrenTree`

    if (this.$$ref) {
        let children = this.tree.getTreeVar('children');
        children[this.$$ref] = null;
        delete children[this.$$ref];
    }

    destroyOld.call(this);
};

let goDarkOld = ExprParser.prototype.goDark;
ExprParser.prototype.goDark = function goDark() {
    if (this.$$childrenTree) {
        this.$$childrenTree.goDark();
    }
    else {
        goDarkOld.call(this);
    }
};

let restoreFromDarkOld = ExprParser.prototype.restoreFromDark;
ExprParser.prototype.restoreFromDark = function restoreFromDark() {
    if (this.$$childrenTree) {
        this.$$childrenTree.restoreFromDark();
    }
    else {
        restoreFromDarkOld.call(this);
    }
};

export default ExprParser;
