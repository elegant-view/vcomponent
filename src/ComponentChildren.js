/**
 * @file 组件的 <!-- children --> 实例，记录相关信息，方便后续 ChildrenDirectiveParser 解析
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var utils = require('./utils');

function ComponentChildren(startNode, endNode, scope, component) {
    this.div = document.createElement('div');
    if (!startNode || !endNode) {
        this.div.innerHTML = '';
    }
    else {
        utils.traverseNodes(
            startNode,
            endNode,
            function (curNode) {
                this.div.appendChild(curNode);
            },
            this
        );
    }

    this.scope = scope;
    this.component = component;
}

ComponentChildren.prototype.getTplHtml = function () {
    return this.div.innerHTML;
};

module.exports = ComponentChildren;
