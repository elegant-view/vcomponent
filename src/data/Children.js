/**
 * @file 组件子节点
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Data from 'vtpl/Data';

/**
 * Children
 *
 * @class
 * @extends {Data}
 */
export default class Children extends Data {

    /**
     * 开始节点
     *
     * @type {WrapNode}
     * @private
     */
    startNode;

    /**
     * 结束节点
     *
     * @type {WrapNode}
     * @private
     */
    endNode;

    /**
     * 树
     *
     * @type {Tree}
     * @private
     */
    parentTree;

    /**
     * 构造函数
     *
     * @public
     * @param  {WrapNode} startNode  开始节点
     * @param  {WrapNode} endNode    结束节点
     * @param  {Tree} parentTree 父树
     */
    constructor(startNode, endNode, parentTree) {
        super();

        this.startNode = startNode;
        this.endNode = endNode;
        this.parentTree = parentTree;
    }

    /**
     * 获取开始节点
     *
     * @public
     * @return {WrapNode}
     */
    getStartNode() {
        return this.startNode;
    }

    /**
     * 获取结束节点
     *
     * @public
     * @return {WrapNode}
     */
    getEndNode() {
        return this.endNode;
    }

    /**
     * 迭代并克隆DOM节点
     *
     * @public
     * @param  {Function} fn 迭代函数
     */
    iterateClone(fn) {
        for (let curNode = this.getStartNode();
             curNode && !curNode.isAfter(this.getEndNode());
             curNode = curNode.getNextSibling()
        ) {
            fn(curNode.cloneNode(true));
        }
    }

    /**
     * 父树
     *
     * @public
     * @return {Tree}
     */
    getParentTree() {
        return this.parentTree;
    }

    /**
     * 判断是否相等
     *
     * @override
     * @param  {Children} children 比价对象
     * @return {boolean}
     */
    equals(children) {
        if (!(children instanceof Children)) {
            return false;
        }
        return this.startNode === children.$$startNode
            && this.endNode === children.$$endNode
            && this.parentTree === children.$$parentTree;
    }

    /**
     * 克隆
     *
     * @override
     * @return {Children}
     */
    clone() {
        return new Children(this.startNode, this.endNode, this.parentTree);
    }

    /**
     * 销毁
     *
     * @public
     */
    destroy() {
        this.startNode = null;
        this.endNode = null;
        this.parentTree = null;
    }
}
