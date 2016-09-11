/**
 * @file 给HTMLExprParser加上处理组件props.children的能力；
 *       给HTMLExprParser加上记录子孙的功能。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import HTMLExprParser from 'vtpl/parsers/HTMLExprParser';
import Tree from 'vtpl/trees/Tree';
import Children from './data/Children';
import DoneChecker from 'vtpl/DoneChecker';

const REFERENCE = Symbol('reference');
const CHILDREN_TREE = Symbol('childrenTree');

export default class ExprParserEnhance extends HTMLExprParser {

    /**
     * @override
     */
    static priority = 3;

    /**
     * @override
     */
    constructor(...args) {
        super(...args);

        this.node = this.startNode;

        this[REFERENCE] = null;
    }

    get ref() {
        return this[REFERENCE];
    }

    set ref(value) {
        this[REFERENCE] = value;
    }

    /**
     * @inheritDoc
     * @public
     */
    collectExprs() {
        // 提前处理一下ref
        const nodeType = this.startNode.getNodeType();
        if (nodeType === Node.ELEMENT_NODE) {
            const ref = this.startNode.getAttribute('ref');
            if (ref) {
                this.setAttr('ref', ref);
            }
        }

        super.collectExprs();
    }

    /**
     * 此处增加处理children的情况
     *
     * @protected
     * @override
     * @param {*} value 值
     */
    setNodeValue(value) {
        if (value && value instanceof Children) {
            // 如果之前创建了这种子树，直接销毁掉。
            if (this[CHILDREN_TREE]) {
                throw new Error('already have a child tree.');
            }

            const nodesManager = this.tree.getTreeVar('nodesManager');
            this.startNode = nodesManager.createComment('children');
            this.endNode = nodesManager.createComment('/children');

            // 将children节点插入到dom树里面去
            const parentNode = this.node.getParentNode();
            parentNode.insertBefore(this.startNode, this.node);
            value.iterateClone(curNode => parentNode.insertBefore(curNode, this.node));
            parentNode.insertBefore(this.endNode, this.node);
            // 移除之前的文本节点，这个节点现在已经没有用了。
            this.node.remove();
            this.node = null;

            // 创建子树
            this[CHILDREN_TREE] = new Tree({
                startNode: this.startNode,
                endNode: this.endNode
            });
            this[CHILDREN_TREE].setParent(value.getParentTree());
            value.getParentTree().rootScope.addChild(this[CHILDREN_TREE].rootScope);

            this[CHILDREN_TREE].compile();
            this[CHILDREN_TREE].link();
            this[CHILDREN_TREE].initRender();
        }
        else {
            super.setNodeValue(value);
        }
    }

    /**
     * 此处增加处理ref的情况
     *
     * @protected
     * @override
     * @param {string} attrName  属性名
     * @param {string|Object} value 值
     */
    setAttr(attrName, value) {
        if (attrName === 'ref') {
            this.ref = value;
            const children = this.tree.getTreeVar('children');
            children[value] = this.node;
        }
        else {
            super.setAttr(attrName, value);
        }
    }

    getTaskId(attrName) {
        let node = this.node;
        if (this[CHILDREN_TREE]) {
            node = this.startNode;
        }

        return this.tree.getTreeVar('domUpdater').generateNodeAttrUpdateId(node, attrName);
    }

    /**
     * 释放资源
     *
     * @override
     * @protected
     */
    release() {
        if (this[CHILDREN_TREE]) {
            this[CHILDREN_TREE].destroy();
            this[CHILDREN_TREE] = null;
        }

        if (this.ref) {
            const children = this.tree.getTreeVar('children');
            children[this.ref] = null;
            delete children[this.ref];
        }
        this[REFERENCE] = null;

        super.release();
    }

    hide(done) {
        const doneChecker = new DoneChecker(done);
        if (this[CHILDREN_TREE]) {
            doneChecker.add(innerDone => this[CHILDREN_TREE].goDark(innerDone));
        }
        else {
            doneChecker.add(innerDone => super.hide(innerDone));
        }
        doneChecker.complete();
    }

    show(done) {
        const doneChecker = new DoneChecker(done);
        if (this[CHILDREN_TREE]) {
            doneChecker.add(innerDone => this[CHILDREN_TREE].restoreFromDark(innerDone));
        }
        else {
            doneChecker.add(innerDone => super.show(innerDone));
        }
        doneChecker.complete();
    }
}
