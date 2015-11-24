/**
 * @file children 指令 <!-- children --> ，只有组件中才会存在该指令
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var DirectiveParser = require('dom-data-bind/DirectiveParser');
var ChildrenTree = require('./ChildrenTree');

module.exports = DirectiveParser.extends(
    {
        initialize: function (options) {
            this.$super.initialize(options);

            this.node = options.node;
        },

        collectExprs: function () {
            var componentChildren = this.tree.componentChildren;
            if (!componentChildren) {
                return;
            }

            var div = document.createElement('div');
            div.innerHTML = componentChildren.getTplHtml();

            this.childrenTree = new ChildrenTree({
                startNode: div.firstChild,
                endNode: div.lastChild,
                config: this.tree.config,
                domUpdater: this.tree.domUpdater,
                exprCalculater: this.tree.exprCalculater,
                treeVars: this.tree.treeVars,
                componentManager: this.tree.componentManager
            });
            this.childrenTree.traverse();

            this.childrenTree.rootScope.setParent(componentChildren.scope);
            componentChildren.scope.addChild(this.childrenTree.rootScope);

            while (div.childNodes.length) {
                this.node.parentNode.insertBefore(div.childNodes[0], this.node);
            }

            return true;
        },

        /**
         * 获取开始节点
         *
         * @protected
         * @inheritDoc
         * @return {Node}
         */
        getStartNode: function () {
            if (!this.childrenTree) {
                return this.node;
            }
            return this.childrenTree.startNode;
        },

        /**
         * 获取结束节点
         *
         * @protected
         * @inheritDoc
         * @return {Node}
         */
        getEndNode: function () {
            return this.node;
        },

        destroy: function () {
            this.childrenTree.destroy();

            this.node = null;
            this.childrenTree = null;

            this.$super.destroy();
        }
    },
    {
        isProperNode: function (node, config) {
            return node.nodeType === 8
                && node.nodeValue.replace(/\s/g, '') === 'children';
        }
    }
);

ChildrenTree.registeParser(module.exports);
