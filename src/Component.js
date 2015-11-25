/**
 * @file 组件基类
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var log = require('dom-data-bind/src/log');
var utils = require('dom-data-bind/src/utils');
var ComponentTree = require('./ComponentTree');
var ComponentChildren = require('./ComponentChildren');
var ComponentManager = require('./ComponentManager');
var Base = require('dom-data-bind/src/Base');

module.exports = Base.extends(
    {
        $name: 'Component',

        initialize: function (options) {
            this.componentNode = options.componentNode;
            this.tree = options.tree;
            this.event = options.event;
            this.childComponents = [];

            this.className = this.constructor.getComponentClassName();
        },

        /**
         * 给组件挂上类名
         *
         * @private
         * @param {string} className 要添加的类名
         */
        addComponentClass: function () {
            utils.traverseNoChangeNodes(this.startNode, this.endNode, function (curNode) {
                if (curNode.nodeType === 1) {
                    // TODO: 改进添加类名的兼容性
                    curNode.classList.add(this.className);
                }
            }, this);
        },

        setOutScope: function (outScope) {
            this.outScope = outScope;
        },

        beforeMount: function () {},

        afterMount: function () {},

        beforeDestroy: function () {},

        afterDestroy: function () {},

        literalAttrReady: function () {},

        /**
         * 组件模板。子类可以覆盖这个属性。
         *
         * @protected
         * @type {String}
         */
        tpl: '',

        /**
         * 组件模板的 url 地址。子类可以覆盖这个属性。
         *
         * @protected
         * @type {String}
         */
        tplUrl: '',

        /**
         * 设置组件属性。假如有如下组件：
         *
         * <ui-my-component title="${title}" name="Amy"></ui-my-component>
         *
         * 那么属性就有 title 和 name ，其中 name 的属性值不是一个表达式，所以在组件创建完成之后，就会被设置好；
         * 而 title 属性值是一个表达式，需要监听 ${title} 表达式的值及其变化，然后再设置进来。
         *
         * 设置进来的值会被直接放到组件对应的 ComponentTree 实例的 rootScope 上面去。
         *
         * 对于ref属性，特殊化，需要用这个属性来查找子组件。
         *
         * @public
         * @param {string} name  属性名
         * @param {Any} value 属性值
         */
        setAttr: function (name, value) {
            if (name === 'ref') {
                this.$$ref = value;
                return;
            }

            this.tree.rootScope.set(name, value);
        },

        /**
         * 组件挂载到 DOM 树中去。
         *
         * @private
         */
        mount: function () {
            this.beforeMount();

            var div = document.createElement('div');
            div.innerHTML = this.tpl;
            this.startNode = div.firstChild;
            this.endNode = div.lastChild;

            // 当前组件层级的组建管理器
            var componentManager = new ComponentManager();
            componentManager.setParent(this.tree.getTreeVar('componentManager'));

            // 组件的作用域是和外部的作用域隔开的
            var previousTree = this.tree;
            this.tree = new ComponentTree({
                startNode: this.startNode,
                endNode: this.endNode,
                config: previousTree.config,
                domUpdater: previousTree.domUpdater,
                exprCalculater: previousTree.exprCalculater
            });
            this.tree.setParent(previousTree);
            this.tree.setTreeVar('componentManager', componentManager);
            this.tree.setTreeVar('componentChildren', new ComponentChildren(
                this.componentNode.firstChild,
                this.componentNode.lastChild,
                this.outScope,
                this
            ));
            this.tree.registeComponents(this.componentClasses);
            this.tree.componentEvent.on('newcomponent', function (data) {
                // 监听子组件的创建
                this.childComponents.push(data);
            }, this);
            this.tree.traverse();

            // 把组件节点放到 DOM 树中去
            var parentNode = this.componentNode.parentNode;
            utils.traverseNoChangeNodes(this.startNode, this.endNode, function (curNode) {
                parentNode.insertBefore(curNode, this.componentNode);
            }, this);
            parentNode.removeChild(this.componentNode);

            this.addComponentClass();

            this.afterMount();
        },

        /**
         * 找到第一个满足条件的子组件
         *
         * @protected
         * @param  {function(Component):boolean} filterFn 过滤函数
         * @return {(Component|undefined)} 满足条件的组件，如果没有，则返回undefined
         */
        findComponent: function (filterFn) {
            if (!utils.isFunction(filterFn)) {
                return;
            }

            for (var i = 0, il = this.childComponents.length; i < il; ++i) {
                if (filterFn(this.childComponents[i])) {
                    return this.childComponents[i];
                }
            }
        },

        /**
         * 找到第所有满足条件的子组件
         *
         * @protected
         * @param  {function(Component):boolean} filterFn 过滤函数
         * @return {Array.<Component>} 满足条件的所有组件
         */
        findComponents: function (filterFn) {
            if (!utils.isFunction(filterFn)) {
                return [];
            }

            var ret = [];
            for (var i = 0, il = this.childComponents.length; i < il; ++i) {
                if (filterFn(this.childComponents[i])) {
                    ret.push(this.childComponents[i]);
                }
            }
        },

        /**
         * 根据ref查找子组件或者子节点。
         *
         * @protected
         * @param  {string} ref ref值
         * @return {(Component|Node)} 符合条件的子组件或节点
         */
        ref: function (ref) {
            var ret = this.findComponent(function (component) {
                return component.$$ref === ref;
            });

            // 不存在这样的子组件，那么就要去看看是否存在这样的子节点
            if (!ret) {
                ret = walk.call(this, this.startNode, this.endNode, function (curNode) {
                    var attr = curNode.getAttribute('ref');
                    return attr && attr === ref;
                });
            }

            return ret;

            function walk(startNode, endNode, iteraterFn) {
                if (!startNode || !endNode) {
                    return;
                }

                if (startNode === endNode) {
                    if (iteraterFn(startNode)) {
                        return startNode;
                    }

                    return walk.call(this, startNode.firstElementChild, startNode.lastElementChild, iteraterFn);
                }

                var curNode = startNode;

                iterater:
                while (curNode) {
                    for (var i = 0, il = this.childComponents.length; i < il; ++i) {
                        if (this.childComponents[i].startNode === curNode) {
                            if (this.childComponents[i].endNode === endNode) {
                                return;
                            }
                            curNode = this.childComponents[i].endNode.nextElementSibling;
                            break;
                        }
                    }

                    if (iteraterFn(curNode)) {
                        return curNode;
                    }

                    var result = walk.call(this, curNode.firstElementChild, curNode.lastElementChild, iteraterFn);
                    if (result) {
                        return result;
                    }

                    if (curNode === endNode) {
                        return;
                    }

                    curNode = curNode.nextElementSibling;
                }
            }
        },

        /**
         * 设置数据
         *
         * @protected
         * @param {string|Object} name 如果是字符串，那么第二个就是要设置的值；
         *                             如果是对象，那么就不管第二个，就认为这个对象就是要设置的键值对。
         * @param {*=} value 要设置的值
         */
        setData: function (name, value) {
            if (!this.tree || !this.tree.rootScope) {
                throw new Error('component is not ready');
            }
            var scope = this.tree.rootScope;
            scope.set.call(scope, name, value);
        },

        /**
         * 获取指定键路径的值，如果不存在的话，就返回默认值
         *
         * @protected
         * @param  {string|Array.<string>} names 如果是一个字符串，那么就直接ScopeModel#get了；
         *                                       如果是一个数组，那么说明需要走一个键的路径了。
         * @param  {*=} dft   如果没取到的默认值
         * @return {*}       返回取到的值
         */
        getData: function (names, dft) {
            if (!this.tree || !this.tree.rootScope) {
                throw new Error('component is not ready');
            }

            var scope = this.tree.rootScope;
            if (utils.isClass(names, 'String')) {
                var ret = scope.get(names);
                ret === undefined ? dft : ret;
                return ret;
            }

            if (utils.isArray(names)) {
                var curValue;
                for (var i = 0, il = names.length; i < il; ++i) {
                    var name = names[i];
                    if (i === 0) {
                        curValue = scope.get(name);
                    }
                    else {
                        curValue = curValue[name];
                    }

                    if (curValue === undefined) {
                        return dft;
                    }
                }
            }

            return dft;
        },

        /**
         * 拿到到组件模板。优先检查 tpl 是否有模板，如果有了，就不再去请求了。
         *
         * @public
         * @param  {function(string)} doneFn 模板就绪后的回调函数
         */
        getTpl: function (doneFn) {
            if (this.tpl) {
                doneFn();
            }
            else if (this.tplUrl) {
                var me = this;
                utils.xhr({
                    url: this.tplUrl
                }, function (data) {
                    me.tpl = data.responseText;
                    doneFn();
                }, function () {
                    log.warn('load tpl:', me.tplUrl, 'failed!');
                    doneFn();
                });
            }
        },

        /**
         * 销毁
         *
         * @public
         */
        destroy: function () {
            this.beforeDestroy();

            this.tree.destroy();

            this.componentNode = null;
            this.tree = null;
            this.outScope = null;
            this.startNode = null;
            this.endNode = null;

            this.afterDestroy();
        },

        /**
         * 隐藏模板
         *
         * @public
         */
        goDark: function () {
            utils.traverseNoChangeNodes(
                this.startNode,
                this.endNode,
                utils.goDark,
                this
            );
        },

        /**
         * 显示模板
         *
         * @public
         */
        restoreFromDark: function () {
            utils.traverseNoChangeNodes(
                this.startNode,
                this.endNode,
                utils.restoreFromDark,
                this
            );
        }
    },
    {

        /**
         * 获取样式字符串。
         *
         * @static
         * @return {string} 样式字符串
         */
        getStyle: function () {
            return '';
        },

        /**
         * 根据组件js类名生成组件的css类名（即由驼峰到下划线的转换）
         *
         * @static
         * @return {string} 组件css类名
         */
        getComponentClassName: function () {
            return this.$name.replace(/[A-Z]/g, function (matched, index) {
                if (index === 0) {
                    return matched.toLowerCase();
                }
                return '-' + matched.toLowerCase();
            });
        }
    }
);

