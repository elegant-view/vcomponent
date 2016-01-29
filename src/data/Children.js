/**
 * @file 组件子节点
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Data from 'vtpl/src/Data';

export default class Children extends Data {
    constructor(startNode, endNode, parentTree) {
        super();

        this.$$startNode = startNode;
        this.$$endNode = endNode;
        this.$$parentTree = parentTree;
    }

    getStartNode() {
        return this.$$startNode;
    }

    getEndNode() {
        return this.$$endNode;
    }

    getParentTree() {
        return this.$$parentTree;
    }

    equals(children) {
        if (!(children instanceof Children)) {
            return false;
        }
        return this.$$startNode === children.$$startNode
            && this.$$endNode === children.$$endNode
            && this.$$parentTree === children.$$parentTree;
    }

    clone() {
        return new Children(this.$$startNode, this.$$endNode, this.$$parentTree);
    }
}
