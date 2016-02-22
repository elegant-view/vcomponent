define(function() { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ((function(modules) {
	// Check all modules for deduplicated modules
	for(var i in modules) {
		if(Object.prototype.hasOwnProperty.call(modules, i)) {
			switch(typeof modules[i]) {
			case "function": break;
			case "object":
				// Module can be created from a template
				modules[i] = (function(_m) {
					var args = _m.slice(1), fn = modules[_m[0]];
					return function (a,b,c) {
						fn.apply(this, [a,b,c].concat(args));
					};
				}(modules[i]));
				break;
			default:
				// Module is a copy of another module
				modules[i] = modules[modules[i]];
				break;
			}
		}
	}
	return modules;
}([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file vcomponent主文件
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author  yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Component = exports.VComponent = undefined;

	var _ComponentParser = __webpack_require__(1);

	var _ComponentParser2 = _interopRequireDefault(_ComponentParser);

	var _ExprParserEnhance = __webpack_require__(17);

	var _ExprParserEnhance2 = _interopRequireDefault(_ExprParserEnhance);

	var _ComponentManager = __webpack_require__(12);

	var _ComponentManager2 = _interopRequireDefault(_ComponentManager);

	var _vtpl = __webpack_require__(23);

	var _vtpl2 = _interopRequireDefault(_vtpl);

	var _Component = __webpack_require__(36);

	var _Component2 = _interopRequireDefault(_Component);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var VComponent = exports.VComponent = function () {
	    function VComponent(options) {
	        _classCallCheck(this, VComponent);

	        this.$vtpl = new _vtpl2.default(options);
	        this.$vtpl.registerParser(_ComponentParser2.default);
	        this.$vtpl.$tree.setTreeVar('componentManager', new _ComponentManager2.default());
	        this.$vtpl.$tree.setTreeVar('children', {});
	    }

	    _createClass(VComponent, [{
	        key: 'render',
	        value: function render() {
	            this.$vtpl.render();
	        }
	    }, {
	        key: 'setData',
	        value: function setData() {
	            var _$vtpl;

	            (_$vtpl = this.$vtpl).setData.apply(_$vtpl, arguments);
	        }
	    }, {
	        key: 'getData',
	        value: function getData() {
	            var scope = this.$vtpl.$tree.rootScope;
	            return scope.get.apply(scope, arguments);
	        }

	        /**
	         * 注册组件类
	         * 设置绑定在树上面的额外变量。这些变量有如下特性：
	         * 1、无法覆盖；
	         * 2、在获取treeVars上面某个变量的时候，如果当前树取出来是undefined，那么就会到父级树的treeVars上去找，以此类推。
	         *
	         * @public
	         * @param {Array.<Component>} componentClasses 一堆组件
	         * @param {string} name  变量名
	         * @param {*} value 变量值
	         */

	    }, {
	        key: 'registerComponents',
	        value: function registerComponents(componentClasses) {
	            var componentManager = this.$vtpl.$tree.getTreeVar('componentManager');
	            componentManager.register(componentClasses);
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            var componentManager = this.$vtpl.$tree.getTreeVar('componentManager');
	            componentManager.destroy();

	            this.$vtpl.destroy();
	        }
	    }, {
	        key: 'ref',
	        value: function ref(name) {
	            var children = this.$vtpl.$tree.getTreeVar('children') || {};
	            return children[name];
	        }
	    }]);

	    return VComponent;
	}();

	exports.VComponent = VComponent;
	exports.Component = _Component2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _ExprParser2 = __webpack_require__(2);

	var _ExprParser3 = _interopRequireDefault(_ExprParser2);

	var _utils = __webpack_require__(10);

	var _ComponentManager = __webpack_require__(12);

	var _ComponentManager2 = _interopRequireDefault(_ComponentManager);

	var _Node = __webpack_require__(13);

	var _Node2 = _interopRequireDefault(_Node);

	var _componentState = __webpack_require__(14);

	var _componentState2 = _interopRequireDefault(_componentState);

	var _Children = __webpack_require__(15);

	var _Children2 = _interopRequireDefault(_Children);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 组件解析器。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *       以`ui-`开头的标签都是组件标签。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *       组件解析器实例包含的比较重要的几个属性：
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *       - 1、$$props ：组件属性的表达式函数和节点更新函数
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           - 1、$$props[expr].exprFn ：计算表达式值的函数，类型是`function(ScopeModel):*`；
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           - 2、$$props[expr].updateFns ：根据表达式值去更新dom的函数数组，类型是`[function(*)]`。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var ComponentParser = function (_ExprParser) {
	    _inherits(ComponentParser, _ExprParser);

	    function ComponentParser(options) {
	        _classCallCheck(this, ComponentParser);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ComponentParser).call(this, options));

	        _this.$$componentTree = null;
	        _this.$$componentCssClassName = null;
	        _this.$component = null;
	        _this.$$ref = null;
	        return _this;
	    }

	    _createClass(ComponentParser, [{
	        key: 'createComponent',
	        value: function createComponent() {
	            var componentName = (0, _utils.line2camel)(this.node.getTagName().replace('ui', ''));
	            var ComponentClass = this.tree.getTreeVar('componentManager').getClass(componentName);
	            if (!ComponentClass) {
	                throw new Error('the component `' + componentName + '` is not registed!');
	            }

	            this.$component = new ComponentClass();
	            this.$component.$$state = _componentState2.default.INITIALIZING;

	            this.$$componentCssClassName = this.getCssClassName(ComponentClass);

	            this.$$updatePropFns = {};
	        }

	        // 必须在组件创建之后

	    }, {
	        key: 'createComponentTree',
	        value: function createComponentTree() {
	            var nodesManager = this.tree.getTreeVar('nodesManager');
	            var fragment = nodesManager.createDocumentFragment();
	            var tagName = this.node.getTagName();

	            fragment.setInnerHTML('<!-- ' + tagName + ' -->' + this.$component.getTemplate() + '<!-- /' + tagName + ' -->');

	            this.startNode = fragment.getFirstChild();
	            this.endNode = fragment.getLastChild();

	            this.$$componentTree = this.tree.createTree({
	                startNode: this.startNode,
	                endNode: this.endNode
	            });

	            this.$$componentTree.rootScope.set({ props: this.$component.props, state: this.$component.state });

	            // 记录下children
	            this.setProp('children', new _Children2.default(this.node.getFirstChild(), this.node.getLastChild(), this.tree));

	            this.$$componentTree.setParent(this.tree);

	            // 用于存放当前组件下的子组件
	            this.$$componentTree.setTreeVar('children', this.$component.refs);
	        }

	        /**
	         * d-rest是一个特殊属性
	         */

	    }, {
	        key: 'collectExprs',
	        value: function collectExprs() {
	            var _this2 = this;

	            this.createComponent();
	            this.createComponentTree();
	            this.registerComponents();

	            // 组件本身就有的css类名
	            this.setProp('class', this.$$componentCssClassName);

	            // 将scope注入到component里面去
	            this.$component.$$scopeModel = this.$$componentTree.rootScope;

	            var config = this.tree.getTreeVar('config');
	            var exprWacther = this.tree.getExprWatcher();
	            var curNode = this.node;
	            var attributes = curNode.getAttributes();
	            var attrs = {};
	            for (var i = 0, il = attributes.length; i < il; i++) {
	                var attr = attributes[i];
	                var attrValue = attr.nodeValue;
	                var attrName = attr.nodeName;

	                attrs[attrName] = true;

	                // 对于含有表达式的prop，把表达式记录下来，并且生成相应的表达式值计算函数和prop更新函数。
	                if (config.getExprRegExp().test(attrValue)) {
	                    exprWacther.addExpr(attrValue);
	                    exprWacther.setExprEqualsFn(attrValue, (0, _utils.bind)(this.shouldUpdate, this));
	                    exprWacther.setExprCloneFn(attrValue, (0, _utils.bind)(this.cloneExpressionObject, this));

	                    var updateFns = this.$$updatePropFns[attrValue] || [];
	                    attrName === 'd-rest' ? updateFns.push(function (value) {
	                        return _this2.setRestProps(value, attrs);
	                    }) : updateFns.push((0, _utils.bind)(this.setProp, this, attrName));
	                    this.$$updatePropFns[attrValue] = updateFns;
	                }
	                // 对于字面量prop，直接设置到$component.props里面去
	                else {
	                        this.setProp(attrName, attrValue);
	                    }
	            }

	            // 子树先compile完，再把整棵树插入到DOM中
	            this.$$componentTree.compile();
	            insertComponentNodes(this.node, this.startNode, this.endNode);

	            this.node = null;

	            // 把组件节点放到 DOM 树中去
	            function insertComponentNodes(componentNode, startNode, endNode) {
	                var parentNode = componentNode.getParentNode();

	                var delayFns = [];
	                for (var _curNode = startNode; _curNode && !_curNode.isAfter(endNode); _curNode = _curNode.getNextSibling()) {
	                    delayFns.push((0, _utils.bind)(insert, null, _curNode));
	                }
	                for (var i = 0, il = delayFns.length; i < il; ++i) {
	                    delayFns[i]();
	                }

	                componentNode.remove();

	                function insert(curNode) {
	                    parentNode.insertBefore(curNode, componentNode);
	                }
	            }
	        }
	    }, {
	        key: 'linkScope',
	        value: function linkScope() {
	            var _this3 = this;

	            var exprWacther = this.tree.getExprWatcher();

	            this.$$componentTree.link();

	            this.$$componentTree.rootScope.setParent(this.tree.rootScope);
	            this.tree.rootScope.addChild(this.$$componentTree.rootScope);

	            exprWacther.on('change', function (event) {
	                if (_this3.isGoDark) {
	                    return;
	                }

	                var updateFns = _this3.$$updatePropFns[event.expr];
	                if (updateFns && updateFns.length) {
	                    (0, _utils.forEach)(updateFns, function (fn) {
	                        return fn(event.newValue);
	                    });
	                }
	            });
	        }
	    }, {
	        key: 'initRender',
	        value: function initRender() {
	            var _this4 = this;

	            var exprWacther = this.tree.getExprWatcher();
	            // 初始化一下界面
	            (0, _utils.forEach)(this.$component.props, function (value, key) {
	                _this4.setProp(key, value);
	            });

	            (0, _utils.forEach)(this.$$updatePropFns, function (updateFns, expr) {
	                (0, _utils.forEach)(updateFns, function (fn) {
	                    return fn(exprWacther.calculate(expr));
	                });
	            });

	            this.$$componentTree.initRender();

	            // 到此处，组件应该就初始化完毕了。
	            this.$component.$$state = _componentState2.default.READY;
	            this.$component.ready();
	        }
	    }, {
	        key: 'setRestProps',
	        value: function setRestProps(value, attrs) {
	            if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
	                return;
	            }

	            for (var key in value) {
	                if (!(key in attrs)) {
	                    this.setProp(key, value[key]);
	                }
	            }
	        }

	        /**
	         * 设置prop，不会更新DOM
	         *
	         * @public
	         * @param {string} name  prop名字
	         * @param {*} value prop值
	         */

	    }, {
	        key: 'setProp',
	        value: function setProp(name, value) {
	            name = (0, _utils.line2camel)(name);

	            if (name === 'ref') {
	                this.$$ref = value;
	                // 把当前组件存放到父组件的treeVar里面去
	                var childComponents = this.tree.getTreeVar('children');
	                childComponents[this.$$ref] = this.$component;
	                return;
	            }

	            if (name === 'class') {
	                var classList = _Node2.default.getClassList(value);
	                classList = this.$$componentCssClassName.concat(classList || []);
	                classList = (0, _utils.distinctArr)(classList, function (cls) {
	                    return cls;
	                });

	                set.call(this, this.$$componentTree.rootScope, name, classList);
	                return;
	            }

	            set.call(this, this.$$componentTree.rootScope, name, value);

	            function set(scopeModel, name, value) {
	                var props = scopeModel.get('props');
	                props[name] = value;
	                scopeModel.set('props', props);

	                if (this.$component && this.$component.$$state === _componentState2.default.READY) {
	                    this.$component.propsChange();
	                }
	            }
	        }

	        /**
	         * 获取开始节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */

	    }, {
	        key: 'getStartNode',
	        value: function getStartNode() {
	            if (this.node) {
	                return this.node;
	            }
	            return this.startNode;
	        }

	        /**
	         * 获取结束节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */

	    }, {
	        key: 'getEndNode',
	        value: function getEndNode() {
	            // 如果node还存在，说明组件标签还没有被模板所替换，此时的结束节点还应该是node
	            if (this.node) {
	                return this.node;
	            }
	            return this.endNode;
	        }
	    }, {
	        key: 'getScope',
	        value: function getScope() {
	            return this.tree.rootScope;
	        }
	    }, {
	        key: 'registerComponents',
	        value: function registerComponents() {
	            var componentManager = this.tree.getTreeVar('componentManager');
	            var curComponentManager = new _ComponentManager2.default();
	            curComponentManager.setParent(componentManager);

	            if (this.$component.getComponentClasses instanceof Function) {
	                curComponentManager.register(this.$component.getComponentClasses());
	            }

	            this.$$componentTree.setTreeVar('componentManager', curComponentManager);
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.$component.destroy();
	            this.$component.$$state = _componentState2.default.DESTROIED;
	            _ExprParser3.default.prototype.destroy.apply(this, arguments);
	        }

	        /**
	         * 获取组件css类名
	         *
	         * @private
	         * @param {Class} ComponentClass 组件类
	         * @return {string} 组件css类名
	         */

	    }, {
	        key: 'getCssClassName',
	        value: function getCssClassName(ComponentClass) {
	            var name = [];
	            for (var curCls = ComponentClass; curCls; curCls = (0, _utils.getSuper)(curCls)) {
	                var curName = curCls.name;
	                name.push((0, _utils.camel2line)(curName));

	                // 最多到组件基类
	                if (curName === 'Component') {
	                    break;
	                }
	            }
	            return name;
	        }
	    }, {
	        key: 'getChildNodes',
	        value: function getChildNodes() {
	            return [];
	        }
	    }, {
	        key: 'goDark',
	        value: function goDark() {
	            if (this.isGoDark) {
	                return;
	            }
	            this.$$componentTree.goDark();
	            this.isGoDark = true;
	        }
	    }, {
	        key: 'restoreFromDark',
	        value: function restoreFromDark() {
	            if (!this.isGoDark) {
	                return;
	            }
	            this.$$componentTree.restoreFromDark();
	            this.isGoDark = false;
	        }

	        /**
	        * 只处理组件
	        *
	        * @static
	        * @param {Node} node DOM节点
	        * @return {boolean}
	        */

	    }], [{
	        key: 'isProperNode',
	        value: function isProperNode(node) {
	            var nodeType = node.getNodeType();
	            if (nodeType !== _Node2.default.ELEMENT_NODE) {
	                return false;
	            }

	            var tagName = node.getTagName();
	            return tagName.indexOf('ui-') === 0;
	        }
	    }]);

	    return ComponentParser;
	}(_ExprParser3.default);

	exports.default = ComponentParser;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _ScopeModel = __webpack_require__(3);

	var _ScopeModel2 = _interopRequireDefault(_ScopeModel);

	var _Parser2 = __webpack_require__(6);

	var _Parser3 = _interopRequireDefault(_Parser2);

	var _utils = __webpack_require__(4);

	var _Node = __webpack_require__(9);

	var _Node2 = _interopRequireDefault(_Node);

	var _parserState = __webpack_require__(8);

	var _parserState2 = _interopRequireDefault(_parserState);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 表达式解析器，一个文本节点或者元素节点对应一个表达式解析器实例。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *       包含的比较重要的几个属性：
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *       - 1、node ：当前节点，是nodes/Node类型的，可能为元素节点和文本节点；
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *       - 2、exprFns ：表达式函数和节点更新函数
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           - 1、exprFns[expr].exprFn ：计算表达式值的函数，类型是`function(ScopeModel):*`；
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           - 2、exprFns[expr].updateFns ：根据表达式值去更新dom的函数数组，类型是`[function(*)]`。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *       - 3、tree ：当前解析器挂靠的树。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	// import log from '../log';

	var ExprParser = function (_Parser) {
	    _inherits(ExprParser, _Parser);

	    /**
	     * 初始化
	     *
	     * @inheritDoc
	     * @param  {Object} options 参数
	     * @param  {Node} options.node 要解析的DOM节点
	     */

	    function ExprParser(options) {
	        _classCallCheck(this, ExprParser);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExprParser).call(this, options));

	        _this.node = options.node;

	        /**
	         * DOM节点属性与更新属性的任务id的映射
	         * @type {Object}
	         */
	        _this.attrToDomTaskIdMap = {};

	        _this.isGoDark = false;

	        _this.$exprUpdateFns = {};
	        return _this;
	    }

	    /**
	     * 搜集过程
	     *
	     * @public
	     */

	    _createClass(ExprParser, [{
	        key: 'collectExprs',
	        value: function collectExprs() {
	            var _this2 = this;

	            var nodeType = this.node.getNodeType();
	            var domUpdater = this.tree.getTreeVar('domUpdater');
	            var exprWatcher = this.tree.getExprWatcher();

	            // 文本节点
	            if (nodeType === _Node2.default.TEXT_NODE) {
	                var nodeValue = this.node.getNodeValue();
	                if (isExpr(nodeValue)) {
	                    exprWatcher.addExpr(nodeValue);

	                    var updateFns = this.$exprUpdateFns[nodeValue] || [];
	                    updateFns.push(function (exprValue, callback) {
	                        var parser = _this2;
	                        domUpdater.addTaskFn(_this2.getTaskId('nodeValue'), function () {
	                            parser.setAttr('nodeValue', exprValue);
	                            callback && callback();
	                        });
	                    });
	                    this.$exprUpdateFns[nodeValue] = updateFns;
	                }
	                return;
	            }

	            // 元素节点
	            if (nodeType === _Node2.default.ELEMENT_NODE) {
	                var attributes = this.node.getAttributes();
	                for (var i = 0, il = attributes.length; i < il; ++i) {
	                    var attribute = attributes[i];
	                    if (!isExpr.call(this, attribute.value)) {
	                        this.setAttr(attribute.name, attribute.value);
	                        continue;
	                    }

	                    exprWatcher.addExpr(attribute.value);

	                    var updateFns = this.$exprUpdateFns[attribute.value] || [];
	                    updateFns.push((0, _utils.bind)(updateAttr, this, this.getTaskId(attribute.name), domUpdater, attribute.name));
	                    this.$exprUpdateFns[attribute.value] = updateFns;
	                }
	            }

	            function updateAttr(taskId, domUpdater, attrName, exprValue, callback) {
	                var _this3 = this;

	                domUpdater.addTaskFn(taskId, function () {
	                    _this3.setAttr(attrName, exprValue);
	                    callback && callback();
	                });
	            }

	            function isExpr(expr) {
	                return (/\$\{(.+?)\}/.test(expr)
	                );
	            }
	        }

	        /**
	         * 设置属性
	         *
	         * @protected
	         * @param {string} attrName  属性名
	         * @param {string} attrValue 属性值
	         */

	    }, {
	        key: 'setAttr',
	        value: function setAttr(attrName, attrValue) {
	            var _this4 = this;

	            if (_Node2.default.isEventName(attrName) || attrName === 'on-outclick') {
	                var eventName = attrName.replace('on-', '');
	                this.node.off(eventName);
	                this.node.on(eventName, function (event) {
	                    var exprCalculater = _this4.tree.getTreeVar('exprCalculater');
	                    exprCalculater.createExprFn(attrValue, true);

	                    var localScope = new _ScopeModel2.default();
	                    localScope.setParent(_this4.tree.rootScope);
	                    localScope.set('event', event);
	                    exprCalculater.calculate(attrValue, true, localScope);
	                });
	            } else {
	                this.node.attr(attrName, attrValue);
	            }
	        }

	        /**
	         * 将界面更新相关函数和scopeModel关联起来，顺便记得在初始的时候刷一下界面
	         *
	         * @public
	         */

	    }, {
	        key: 'linkScope',
	        value: function linkScope() {
	            var _this5 = this;

	            var exprWatcher = this.tree.getExprWatcher();
	            exprWatcher.on('change', function (event) {
	                var updateFns = _this5.$exprUpdateFns[event.expr];
	                // 此处并不会处理isGoDark为true的情况，因为Node那边处理了。
	                if (updateFns && updateFns.length) {
	                    (0, _utils.forEach)(updateFns, function (fn) {
	                        return fn(event.newValue);
	                    });
	                }
	            });
	        }
	    }, {
	        key: 'initRender',
	        value: function initRender() {
	            var exprWatcher = this.tree.getExprWatcher();
	            (0, _utils.forEach)(this.$exprUpdateFns, function (fns, expr) {
	                (0, _utils.forEach)(fns, function (fn) {
	                    return fn(exprWatcher.calculate(expr));
	                });
	            });
	        }

	        /**
	         * 获取开始节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */

	    }, {
	        key: 'getStartNode',
	        value: function getStartNode() {
	            return this.node;
	        }

	        /**
	         * 获取结束节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */

	    }, {
	        key: 'getEndNode',
	        value: function getEndNode() {
	            return this.node;
	        }

	        /**
	         * 销毁
	         *
	         * @inheritDoc
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.node = null;
	            this.exprFns = null;
	            this.exprOldValues = null;
	            this.attrToDomTaskIdMap = null;

	            _Parser3.default.prototype.destroy.call(this);
	        }

	        /**
	         * 节点“隐藏”起来
	         *
	         * @public
	         */

	    }, {
	        key: 'goDark',
	        value: function goDark() {
	            var _this6 = this;

	            if (this.isGoDark) {
	                return;
	            }
	            // 前面故意保留一个空格，因为DOM中不可能出现节点的属性key第一个字符为空格的，
	            // 避免了冲突。
	            var taskId = this.getTaskId(' hide');
	            var domUpdater = this.tree.getTreeVar('domUpdater');
	            domUpdater.addTaskFn(taskId, function () {
	                return _this6.node.hide();
	            });

	            this.isGoDark = true;
	        }

	        /**
	         * 节点“显示”出来
	         *
	         * @public
	         */

	    }, {
	        key: 'restoreFromDark',
	        value: function restoreFromDark() {
	            var _this7 = this;

	            if (!this.isGoDark) {
	                return;
	            }
	            var taskId = this.getTaskId(' hide');
	            var domUpdater = this.tree.getTreeVar('domUpdater');
	            domUpdater.addTaskFn(taskId, function () {
	                return _this7.node.show();
	            });

	            this.isGoDark = false;
	        }

	        /**
	         * 根据DOM节点的属性名字拿到一个任务id。
	         *
	         * @protected
	         * @param  {string} attrName 属性名字
	         * @return {string}          任务id
	         */

	    }, {
	        key: 'getTaskId',
	        value: function getTaskId(attrName) {
	            return this.tree.getTreeVar('domUpdater').generateNodeAttrUpdateId(this.node, attrName);
	        }

	        /**
	         * 判断节点是否是应该由当前处理器来处理
	         *
	         * @static
	         * @param  {Node}  node 节点
	         * @return {boolean}
	         */

	    }], [{
	        key: 'isProperNode',
	        value: function isProperNode(node) {
	            var nodeType = node.getNodeType();
	            return nodeType === _Node2.default.ELEMENT_NODE || nodeType === _Node2.default.TEXT_NODE;
	        }
	    }]);

	    return ExprParser;
	}(_Parser3.default);

	exports.default = ExprParser;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utils = __webpack_require__(4);

	var _Event2 = __webpack_require__(5);

	var _Event3 = _interopRequireDefault(_Event2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 数据容器
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var ScopeModel = function (_Event) {
	    _inherits(ScopeModel, _Event);

	    function ScopeModel() {
	        var _Object$getPrototypeO;

	        _classCallCheck(this, ScopeModel);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ScopeModel)).call.apply(_Object$getPrototypeO, [this].concat(args)));

	        _this.store = {};
	        _this.parent;
	        _this.children = [];
	        return _this;
	    }

	    _createClass(ScopeModel, [{
	        key: 'setParent',
	        value: function setParent(parent) {
	            if (!(parent instanceof ScopeModel)) {
	                throw new TypeError('wrong scope parent');
	            }
	            this.parent = parent;
	        }
	    }, {
	        key: 'addChild',
	        value: function addChild(child) {
	            this.children.push(child);
	        }
	    }, {
	        key: 'removeChild',
	        value: function removeChild(child) {
	            var children = [];
	            for (var i = 0, il = this.children.length; i < il; ++i) {
	                if (this.children[i] !== child) {
	                    children.push(this.children[i]);
	                }
	            }
	            this.children = children;
	        }
	    }, {
	        key: 'set',
	        value: function set(name, value, isSilent) {
	            var changeObj = undefined;

	            if ((0, _utils.isClass)(name, 'String')) {
	                changeObj = setProperty(this, name, value);
	                if (changeObj && !isSilent) {
	                    change(this, [changeObj]);
	                }
	            } else if ((0, _utils.type)(name) === 'object') {
	                var changes = [];
	                for (var key in name) {
	                    if (!name.hasOwnProperty(key)) {
	                        continue;
	                    }

	                    changeObj = setProperty(this, key, name[key]);
	                    if (changeObj) {
	                        changes.push(changeObj);
	                    }
	                }
	                isSilent = value;
	                !isSilent && change(this, changes);
	            }
	        }
	    }, {
	        key: 'get',
	        value: function get(name) {
	            if (arguments.length > 1 || name === undefined) {
	                return (0, _utils.extend)({}, this.store);
	            }

	            if (name in this.store) {
	                return this.store[name];
	            }

	            if (this.parent) {
	                return this.parent.get(name);
	            }
	        }
	    }, {
	        key: 'iterate',
	        value: function iterate(fn, context) {
	            if (!(0, _utils.isFunction)(fn)) {
	                return;
	            }

	            /* eslint-disable guard-for-in */
	            for (var key in this.store) {
	                fn.call(context, this.store[key], key);
	            }
	            /* eslint-enable guard-for-in */
	        }
	    }]);

	    return ScopeModel;
	}(_Event3.default);

	exports.default = ScopeModel;

	/**
	 * 设置单个属性值
	 *
	 * @param {ScopeModel} model 作为容器的Model对象
	 * @param {string} name 属性名
	 * @param {Mixed} value 对应的值
	 * @return {meta.ChangeRecord} 一个变化记录项
	 * @ignore
	 */

	function setProperty(model, name, value) {
	    var type = model.store.hasOwnProperty(name) ? 'change' : 'add';
	    var oldValue = model.store[name];
	    model.store[name] = value;

	    // 只是粗略记录一下set了啥
	    return {
	        type: type,
	        name: name,
	        oldValue: oldValue,
	        newValue: value
	    };
	}

	/**
	 * 自己触发的change事件，就要负责到底，即通知所有的子孙scope。
	 *
	 * @param {ScopeModel} rootModel model对象
	 * @param {Array.<Object>} changes 值改变记录
	 */
	function change(rootModel, changes) {
	    var delayFns = getDelayFns(rootModel, 'change');
	    (0, _utils.forEach)(delayFns, function (fn) {
	        return fn();
	    });

	    function getDelayFns(model, eventName) {
	        var delayFns = [];

	        // 直接锁定model的所有事件回调函数，防止前面的事件回调函数污染回调函数队列。
	        var handlers = model.getEventHandlers(eventName);
	        if (handlers && handlers.length) {
	            (0, _utils.forEach)(handlers, function (handler) {
	                delayFns.push(function () {
	                    model.invokeEventHandler(handler, {
	                        type: eventName,
	                        model: rootModel,
	                        changes: changes
	                    });
	                });
	            });
	        }

	        // 遍历子孙model
	        for (var i = 0, il = model.children.length; i < il; ++i) {
	            delayFns.push.apply(delayFns, getDelayFns(model.children[i], 'parentchange'));
	        }

	        return delayFns;
	    }
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.slice = slice;
	exports.extend = extend;
	exports.each = each;
	exports.forEach = forEach;
	exports.isClass = isClass;
	exports.isArray = isArray;
	exports.isNumber = isNumber;
	exports.isFunction = isFunction;
	exports.getClassNameOf = getClassNameOf;
	exports.isPureObject = isPureObject;
	exports.bind = bind;
	exports.isSubClassOf = isSubClassOf;
	exports.regExpEncode = regExpEncode;
	exports.camel2line = camel2line;
	exports.line2camel = line2camel;
	exports.distinctArr = distinctArr;
	exports.regExpEncode = regExpEncode;
	exports.type = type;
	exports.empty = empty;
	/**
	 * @file 一堆项目里面常用的方法
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */

	function slice(arr, start, end) {
	    return Array.prototype.slice.call(arr, start, end);
	}

	/**
	 * 超级简单的 extend ，因为本库对 extend 没那高的要求，
	 * 等到有要求的时候再完善。
	 *
	 * @inner
	 * @param  {Object} target 目标对象
	 * @return {Object}        最终合并后的对象
	 */
	function extend(target) {
	    var srcs = slice(arguments, 1);
	    for (var i = 0, il = srcs.length; i < il; i++) {
	        /* eslint-disable guard-for-in */
	        for (var key in srcs[i]) {
	            target[key] = srcs[i][key];
	        }
	        /* eslint-enable guard-for-in */
	    }
	    return target;
	}

	function each(arr, fn, context) {
	    if (isArray(arr)) {
	        for (var i = 0, il = arr.length; i < il; i++) {
	            if (fn.call(context, arr[i], i, arr)) {
	                break;
	            }
	        }
	    } else if ((typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) === 'object') {
	        for (var k in arr) {
	            if (fn.call(context, arr[k], k, arr)) {
	                break;
	            }
	        }
	    }
	}

	function forEach(arr, fn, context) {
	    /* eslint-disable guard-for-in */
	    for (var i in arr) {
	        /* eslint-enable guard-for-in */
	        fn.call(context, arr[i], i, arr);
	    }
	}

	function isClass(obj, clsName) {
	    return Object.prototype.toString.call(obj) === '[object ' + clsName + ']';
	}

	function isArray(arr) {
	    return isClass(arr, 'Array');
	}

	function isNumber(obj) {
	    return isClass(obj, 'Number');
	}

	function isFunction(obj) {
	    return isClass(obj, 'Function');
	}

	function getClassNameOf(obj) {
	    return Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1];
	}

	/**
	 * 是否是一个纯对象，满足如下条件：
	 *
	 * 1、除了内置属性之外，没有其他继承属性；
	 * 2、constructor 是 Object
	 *
	 * @param {Any} obj 待判断的变量
	 * @return {boolean}
	 */
	function isPureObject(obj) {
	    if (!isClass(obj, 'Object')) {
	        return false;
	    }

	    for (var k in obj) {
	        if (!obj.hasOwnProperty(k)) {
	            return false;
	        }
	    }

	    return true;
	}

	function bind(fn, thisArg) {
	    if (!isFunction(fn)) {
	        return;
	    }

	    var bind = Function.prototype.bind || function () {
	        var args = arguments;
	        var obj = args.length > 0 ? args[0] : undefined;
	        var me = this;
	        return function () {
	            var totalArgs = Array.prototype.concat.apply(Array.prototype.slice.call(args, 1), arguments);
	            return me.apply(obj, totalArgs);
	        };
	    };
	    return bind.apply(fn, [thisArg].concat(Array.prototype.slice.call(arguments, 2)));
	}

	function isSubClassOf(SubClass, SuperClass) {
	    return SubClass.prototype instanceof SuperClass;
	}

	/**
	 * 对传入的字符串进行创建正则表达式之前的转义，防止字符串中的一些字符成为关键字。
	 *
	 * @param  {string} str 待转义的字符串
	 * @return {string}     转义之后的字符串
	 */
	function regExpEncode(str) {
	    return '\\' + str.split('').join('\\');
	}

	/**
	 * 将字符串中的驼峰命名方式改为短横线的形式
	 *
	 * @public
	 * @param  {string} str 要转换的字符串
	 * @return {string}
	 */
	function camel2line(str) {
	    return str.replace(/[A-Z]/g, function (matched, index) {
	        if (index === 0) {
	            return matched.toLowerCase();
	        }
	        return '-' + matched.toLowerCase();
	    });
	}

	/**
	 * 将字符串中的短横线命名方式改为驼峰的形式
	 *
	 * @public
	 * @param  {string} str 要转换的字符串
	 * @return {string}
	 */
	function line2camel(str) {
	    return str.replace(/-[a-z]/g, function (matched) {
	        return matched[1].toUpperCase();
	    });
	}

	function distinctArr(arr, hashFn) {
	    hashFn = isFunction(hashFn) ? hashFn : function (elem) {
	        return String(elem);
	    };
	    var obj = {};
	    for (var i = 0, il = arr.length; i < il; ++i) {
	        obj[hashFn(arr[i])] = arr[i];
	    }

	    var ret = [];
	    for (var key in obj) {
	        if (!obj.hasOwnProperty(key)) {
	            continue;
	        }

	        ret.push(obj[key]);
	    }

	    return ret;
	}

	function regExpEncode(str) {
	    return '\\' + str.split('').join('\\');
	}

	function type(obj) {
	    return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
	}

	function empty() {}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 事件
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utils = __webpack_require__(4);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Event = function () {
	    function Event() {
	        _classCallCheck(this, Event);

	        this.evnts = {};
	    }

	    _createClass(Event, [{
	        key: 'on',
	        value: function on(eventName, fn, context) {
	            if (!(0, _utils.isFunction)(fn)) {
	                return;
	            }

	            this.evnts[eventName] = this.evnts[eventName] || [];

	            this.evnts[eventName].push({ fn: fn, context: context });
	        }
	    }, {
	        key: 'trigger',
	        value: function trigger(eventName) {
	            var _arguments = arguments,
	                _this = this;

	            var fnObjs = this.evnts[eventName];
	            if (fnObjs && fnObjs.length) {
	                (function () {
	                    var args = (0, _utils.slice)(_arguments, 1);

	                    // 这个地方现在不处理事件回调队列污染的问题了，
	                    // 因为对于本库来说，收效甚微，同时可以在另外的地方解决掉由此带来的bug
	                    (0, _utils.forEach)(fnObjs, function (fnObj) {
	                        return _this.invokeEventHandler.apply(_this, [fnObj].concat(_toConsumableArray(args)));
	                    });
	                })();
	            }
	        }
	    }, {
	        key: 'invokeEventHandler',
	        value: function invokeEventHandler(handler) {
	            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                args[_key - 1] = arguments[_key];
	            }

	            return handler.fn.apply(handler.context, args);
	        }
	    }, {
	        key: 'getEventHandlers',
	        value: function getEventHandlers(eventName) {
	            return this.evnts[eventName];
	        }
	    }, {
	        key: 'off',
	        value: function off(eventName, fn) {
	            var _this2 = this;

	            if (arguments.length === 0) {
	                this.evnts = {};
	            }

	            if (!fn) {
	                this.evnts[eventName] = null;
	                return;
	            }

	            var fnObjs = this.evnts[eventName];
	            if (fnObjs && fnObjs.length) {
	                (function () {
	                    var newFnObjs = [];
	                    (0, _utils.forEach)(fnObjs, function (fnObj) {
	                        if (fn !== fnObj.fn) {
	                            newFnObjs.push(fnObj);
	                        }
	                    });
	                    _this2.evnts[eventName] = newFnObjs;
	                })();
	            }
	        }
	    }, {
	        key: 'isAllRemoved',
	        value: function isAllRemoved() {
	            var eventName = undefined;
	            var fn = undefined;
	            if (arguments.length === 0 || arguments.length > 2) {
	                throw new TypeError('wrong arguments');
	            }

	            if (arguments.length >= 1 && (0, _utils.isClass)(arguments[0], 'String')) {
	                eventName = arguments[0];
	            }
	            if (arguments.length === 2 && (0, _utils.isFunction)(arguments[1])) {
	                fn = arguments[1];
	            }

	            var fnObjs = this.evnts[eventName];
	            if (fnObjs && fnObjs.length) {
	                if (fn) {
	                    for (var i = 0, il = fnObjs.length; i < il; ++i) {
	                        var fnObj = fnObjs[i];
	                        if (fnObj.fn === fn) {
	                            return false;
	                        }
	                    }
	                }

	                // 只传了eventName，没有传callback，存在eventName对应的回调函数
	                return false;
	            }

	            return true;
	        }
	    }]);

	    return Event;
	}();

	exports.default = Event;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Base2 = __webpack_require__(7);

	var _Base3 = _interopRequireDefault(_Base2);

	var _parserState = __webpack_require__(8);

	var _parserState2 = _interopRequireDefault(_parserState);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 解析器的抽象基类
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var Parser = function (_Base) {
	  _inherits(Parser, _Base);

	  function Parser(options) {
	    _classCallCheck(this, Parser);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Parser).call(this, options));

	    _this.$state = _parserState2.default.INITIALIZING;
	    _this.tree = options.tree;
	    return _this;
	  }

	  /**
	   * 隐藏当前parser实例相关的节点。具体子类实现
	   *
	   * @public
	   * @abstract
	   */

	  _createClass(Parser, [{
	    key: 'goDark',
	    value: function goDark() {}

	    /**
	     * 显示相关元素
	     *
	     * @public
	     * @abstract
	     */

	  }, {
	    key: 'restoreFromDark',
	    value: function restoreFromDark() {}

	    /**
	     * 获取解析器当前状态下的开始DOM节点。
	     *
	     * 由于有的解析器会将之前的节点移除掉，那么就会对遍历带来影响了，
	     * 所以此处提供两个获取开始节点和结束节点的方法。
	     *
	     * @public
	     * @return {Node} DOM节点对象
	     */

	  }, {
	    key: 'getStartNode',
	    value: function getStartNode() {
	      return this.startNode;
	    }

	    /**
	     * 获取解析器当前状态下的结束DOM节点
	     *
	     * @public
	     * @return {Node} 节点对象
	     */

	  }, {
	    key: 'getEndNode',
	    value: function getEndNode() {
	      return this.endNode;
	    }

	    /**
	     * 搜集表达式，生成表达式函数和 DOM 更新函数。具体子类实现
	     *
	     * @abstract
	     * @public
	     */

	  }, {
	    key: 'collectExprs',
	    value: function collectExprs() {}

	    /**
	     * 绑定scope model
	     *
	     * @public
	     */

	  }, {
	    key: 'linkScope',
	    value: function linkScope() {}

	    /**
	     * 初始渲染
	     *
	     * @public
	     */

	  }, {
	    key: 'initRender',
	    value: function initRender() {}

	    /**
	     * 销毁解析器，将界面恢复成原样
	     *
	     * @public
	     */

	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.tree = null;
	    }
	  }]);

	  return Parser;
	}(_Base3.default);

	exports.default = Parser;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @file 所有类的基类
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */

	var Base = function Base() {
	    _classCallCheck(this, Base);
	};

	Base.trait = function trait(props) {
	    var proto = this.prototype;
	    /* eslint-disable guard-for-in */
	    for (var key in props) {
	        proto[key] = props[key];
	    }
	    /* eslint-enable guard-for-in */

	    return this;
	};

	exports.default = Base;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @file 解析器状态
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */

	exports.default = {
	    INITIALIZING: 1,
	    BEGIN_COMPILING: 2,
	    END_COMPILING: 3,
	    BEGIN_LINK: 4,
	    END_LINK: 5,
	    BEGIN_INIT_RENDER: 6,
	    END_INIT_RENDER: 7,
	    READY: 8,
	    DESTROIED: 9
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 实现一套本库需要的节点类，将所有直接操作DOM的代码都封装在这里。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *       如无特别说明，以`$`符号开头的成员变量是受保护的，以`$$`符号开头的成员变量是私有的。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utils = __webpack_require__(4);

	var _Event = __webpack_require__(5);

	var _Event2 = _interopRequireDefault(_Event);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Node = function () {
	    function Node(node, manager) {
	        _classCallCheck(this, Node);

	        this.$node = node;
	        this.$manager = manager;

	        this.$event = new _Event2.default();
	        this.$nodeEventFns = {};

	        this.$$isGoDark = false;
	    }

	    _createClass(Node, [{
	        key: 'getNodeType',
	        value: function getNodeType() {
	            return this.$node.nodeType;
	        }
	    }, {
	        key: 'getChildNodes',
	        value: function getChildNodes() {
	            var nodes = [];
	            var childNodes = this.$node.childNodes;
	            for (var i = 0, il = childNodes.length; i < il; ++i) {
	                nodes.push(this.$manager.getNode(childNodes[i]));
	            }
	            return nodes;
	        }
	    }, {
	        key: 'getFirstChild',
	        value: function getFirstChild() {
	            return this.$manager.getNode(this.$node.firstChild);
	        }
	    }, {
	        key: 'getLastChild',
	        value: function getLastChild() {
	            return this.$manager.getNode(this.$node.lastChild);
	        }
	    }, {
	        key: 'equal',
	        value: function equal(node) {
	            return this.$node === node.$node;
	        }
	    }, {
	        key: 'getParentNode',
	        value: function getParentNode() {
	            var parentNode = this.$node.parentNode || this.$commentNode && this.$commentNode.parentNode;
	            if (!parentNode) {
	                return null;
	            }

	            return this.$manager.getNode(parentNode);
	        }
	    }, {
	        key: 'getNextSibling',
	        value: function getNextSibling() {
	            var nextSibling = this.$node.nextSibling || this.$commentNode && this.$commentNode.nextSibling;
	            if (!nextSibling) {
	                return null;
	            }

	            return this.$manager.getNode(nextSibling);
	        }
	    }, {
	        key: 'getPreviousSibling',
	        value: function getPreviousSibling() {
	            var previousSibling = this.$node.previousSibling || this.$commentNode && this.$commentNode.previousSibling;
	            if (!previousSibling) {
	                return null;
	            }

	            return this.$manager.getNode(previousSibling);
	        }
	    }, {
	        key: 'getAttribute',
	        value: function getAttribute(name) {
	            return this.$node.getAttribute(name);
	        }
	    }, {
	        key: 'setAttribute',
	        value: function setAttribute(name, value) {
	            this.$node.setAttribute(name, value);
	        }
	    }, {
	        key: 'getAttributes',
	        value: function getAttributes() {
	            return this.$node.attributes;
	        }
	    }, {
	        key: 'getNodeValue',
	        value: function getNodeValue() {
	            return this.$node.nodeValue;
	        }
	    }, {
	        key: 'setNodeValue',
	        value: function setNodeValue(value) {
	            if (this.$$isGoDark) {
	                this.$$nodeValue = value;
	            } else {
	                this.$node.nodeValue = value;
	            }
	        }
	    }, {
	        key: 'appendChild',
	        value: function appendChild(node) {
	            this.$node.appendChild(node.$node);
	        }
	    }, {
	        key: 'cloneNode',
	        value: function cloneNode() {
	            return this.$manager.getNode(this.$node.cloneNode.apply(this.$node, arguments));
	        }
	    }, {
	        key: 'insertBefore',
	        value: function insertBefore(newNode, referenceNode) {
	            return this.$manager.getNode(this.$node.insertBefore(newNode.$node, referenceNode.$node));
	        }
	    }, {
	        key: 'getInnerHTML',
	        value: function getInnerHTML() {
	            return this.$node.innerHTML;
	        }
	    }, {
	        key: 'setInnerHTML',
	        value: function setInnerHTML(html) {
	            this.$node.innerHTML = html;
	        }
	    }, {
	        key: 'getTagName',
	        value: function getTagName() {
	            return this.$node.tagName.toLowerCase();
	        }
	    }, {
	        key: 'getValue',
	        value: function getValue() {
	            return this.$node.value;
	        }

	        /**
	         * 判断当前节点是否和node是兄弟关系，并且在node之后。
	         *
	         * @public
	         * @param  {Node}  node 要对比的节点
	         * @return {boolean}
	         */

	    }, {
	        key: 'isAfter',
	        value: function isAfter(node) {
	            if (!this.isBrotherWith(node) || this.equal(node)) {
	                return false;
	            }

	            for (var curNode = node.$node; curNode; curNode = curNode.nextSibling) {
	                if (curNode === this.$node) {
	                    return true;
	                }
	            }

	            return false;
	        }
	    }, {
	        key: 'isBrotherWith',
	        value: function isBrotherWith(node) {
	            return this.getParentNode().equal(node.getParentNode());
	        }

	        /**
	         * 获取或设定属性值。
	         * 如果参数只有一个，并且第一个参数是字符串类型，说明是获取属性值；
	         * 如果参数有两个，并且第一个参数是字符串类型，说明是设置属性值；
	         *
	         * TODO: 完善
	         *
	         * @param {string} name  节点属性名
	         * @param {*=} value 节点属性值
	         * @return {*}
	         */

	    }, {
	        key: 'attr',
	        value: function attr(name, value) {
	            if (this.getNodeType() === Node.TEXT_NODE && name === 'nodeValue') {
	                if (arguments.length === 1) {
	                    return this.getNodeValue();
	                }

	                return this.setNodeValue(value);
	            }

	            if (this.getNodeType() !== Node.ELEMENT_NODE) {
	                return;
	            }

	            // 只有一个参数，那就归到获取属性的范畴
	            if (arguments.length === 1) {
	                return this.getAttribute(name);
	            }

	            if (this.getNodeType() === Node.ELEMENT_NODE) {
	                if (name === 'style' && (0, _utils.isPureObject)(value)) {
	                    return this.setStyle(value);
	                }

	                if (name === 'class') {
	                    return this.setClass(value);
	                }

	                if (Node.isEventName(name)) {
	                    return this.on(name.replace('on', ''), value);
	                }

	                // 外部点击事件
	                if (name === 'onoutclick') {
	                    return this.on('outclick', value);
	                }
	            }

	            this.setAttribute(name, value);
	        }
	    }, {
	        key: 'setClass',
	        value: function setClass(klass) {
	            if (!klass) {
	                return;
	            }

	            this.$node.className = Node.getClassList(klass).join(' ');
	        }
	    }, {
	        key: 'setStyle',
	        value: function setStyle(styleObj) {
	            for (var k in styleObj) {
	                if (styleObj.hasOwnProperty(k)) {
	                    this.$node.style[k] = styleObj[k];
	                }
	            }
	        }
	    }, {
	        key: 'remove',
	        value: function remove() {
	            if (!this.$node.parentNode) {
	                return;
	            }
	            this.$node.parentNode.removeChild(this.$node);
	        }
	    }, {
	        key: 'on',
	        value: function on(eventName, callback) {
	            this.$event.on(eventName, callback);

	            var me = this;
	            if (!(0, _utils.isFunction)(this.$nodeEventFns[eventName])) {
	                if (eventName === 'outclick') {
	                    this.$nodeEventFns[eventName] = function (event) {
	                        event = event || window.event;
	                        if (me.$node !== event.target && !me.$node.contains(event.target)) {
	                            me.$event.trigger(eventName, event);
	                        }
	                    };
	                    window.addEventListener('click', this.$nodeEventFns[eventName]);
	                } else {
	                    this.$nodeEventFns[eventName] = function (event) {
	                        event = event || window.event;
	                        me.$event.trigger(eventName, event);
	                    };
	                    this.$node.addEventListener(eventName, this.$nodeEventFns[eventName]);
	                }
	            }
	        }
	    }, {
	        key: 'off',
	        value: function off(eventName, callback) {
	            this.$event.off(eventName, callback);

	            if (this.$event.isAllRemoved(eventName, callback)) {
	                var eventFn = undefined;
	                eventFn = this.$nodeEventFns[eventName];
	                if (eventName === 'outclick') {
	                    window.removeEventListener('click', eventFn);
	                } else {
	                    this.$node.removeEventListener(eventName, this.$nodeEventFns[eventName]);
	                }
	                this.$nodeEventFns[eventName] = null;
	            }
	        }
	    }, {
	        key: 'getNodeId',
	        value: function getNodeId() {
	            return this.$node[this.$manager.$$domNodeIdKey];
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            if (!this.$$isGoDark) {
	                return;
	            }

	            if (this.$node.nodeType === Node.ELEMENT_NODE) {
	                this.$node.style.display = null;
	            } else if (this.$node.nodeType === Node.TEXT_NODE) {
	                if (this.$$nodeValue !== undefined) {
	                    this.$node.nodeValue = this.$$nodeValue;
	                    this.$$nodeValue = undefined;
	                }
	            }

	            this.$$isGoDark = false;
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            if (this.$$isGoDark) {
	                return;
	            }

	            if (this.$node.nodeType === Node.ELEMENT_NODE) {
	                this.$node.style.display = 'none';
	            } else if (this.$node.nodeType === Node.TEXT_NODE) {
	                this.$$nodeValue = this.$node.nodeValue;
	                this.$node.nodeValue = '';
	            }

	            this.$$isGoDark = true;
	        }
	    }, {
	        key: 'getOuterHTML',
	        value: function getOuterHTML() {
	            var div = document.createElement('div');
	            div.appendChild(this.$node.cloneNode(true));
	            var html = div.innerHTML;
	            div = null;
	            return html;
	        }
	    }, {
	        key: 'isInDom',
	        value: function isInDom() {
	            return !!this.$node.parentNode;
	        }
	    }, {
	        key: 'getDOMNode',
	        value: function getDOMNode() {
	            return this.$node;
	        }

	        /**
	         * 销毁，做一些清理工作：
	         * 1、清理outclick；
	         * 2、清理事件；
	         *
	         * @public
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.$event.off();

	            /* eslint-disable guard-for-in */
	            for (var eventName in this.$nodeEventFns) {
	                /* eslint-enable guard-for-in */
	                var eventFn = this.$nodeEventFns[eventName];
	                if (eventName === 'outclick') {
	                    window.removeEventListener('click', eventFn);
	                } else {
	                    this.$node.removeEventListener(eventName, eventFn);
	                }
	            }
	        }
	    }], [{
	        key: 'getClassList',
	        value: function getClassList(klass) {
	            var klasses = [];
	            if ((0, _utils.isClass)(klass, 'String')) {
	                klasses = klass.split(' ');
	            } else if ((0, _utils.isPureObject)(klass)) {
	                for (var k in klass) {
	                    if (klass[k]) {
	                        klasses.push(klass[k]);
	                    }
	                }
	            } else if ((0, _utils.isArray)(klass)) {
	                klasses = klass;
	            }

	            return (0, _utils.distinctArr)(klasses);
	        }
	    }, {
	        key: 'isEventName',
	        value: function isEventName(str) {
	            var eventList = this.eventList;

	            if (str.indexOf('on-') !== 0) {
	                return;
	            }
	            str = str.slice(3);
	            for (var i = 0, il = eventList.length; i < il; ++i) {
	                if (str === eventList[i]) {
	                    return true;
	                }
	            }

	            return false;
	        }

	        /**
	         * 将NodeList转换成真正的数组
	         *
	         * @static
	         * @param {(NodeList|Array.<Node>)} nodeList DOM节点列表
	         * @return {Array.<Node>}
	         */

	    }, {
	        key: 'toArray',
	        value: function toArray(nodeList) {
	            if ((0, _utils.isArray)(nodeList)) {
	                return nodeList;
	            }

	            try {
	                return (0, _utils.slice)(nodeList, 0);
	            } catch (e) {
	                // IE8 及更早版本将 NodeList 实现为一个 COM 对象，因此只能一个一个遍历出来。
	                var list = [];
	                for (var i = 0, il = nodeList.length; i < il; ++i) {
	                    list.push(nodeList[i]);
	                }
	                return list;
	            }
	        }

	        /**
	         * 遍历DOM树。
	         *
	         * 遍历过程会受iterateFn影响：
	         * - 如果iterateFn返回true，则说明要跳出遍历了（即不会遍历当前节点的下一个兄弟节点），但是在跳出之前，还是要遍历完当前节点的子孙节点的；
	         * - 如果iterateFn返回一个节点对象，做如下判断：
	         *     - 如果这个节点不是当前节点之后的兄弟节点，则抛出异常；
	         *     - 如果是，则将当前节点设为这个节点对象。
	         * - 如果返回的是其他值，则自动将当前节点设为下一个兄弟节点。
	         *
	         * 此处有个很蛋碎的问题，就是如果iterateFn里面做了破坏DOM树形结构的操作的话，遍历就会出现困难。
	         * 所以在实际操作中建议延迟处理（即遍历完之后）这种破坏结构的DOM操作。
	         *
	         * @static
	         * @param {Node} startNode 起始节点
	         * @param {Node} endNode 终止节点
	         * @param {function(Node):(Node|undefined|boolean)} iterateFn 迭代函数。
	         *                             如果这个函数返回了一个Node对象，则把这个Node对象当成下一个要遍历的节点。
	         * @return {boolean} 如果是true，说明在遍历子节点的时候中途中断了，不需要继续遍历了。
	         */

	    }, {
	        key: 'iterate',
	        value: function iterate(startNode, endNode, iterateFn) {
	            if (!(0, _utils.isFunction)(iterateFn)) {
	                return;
	            }

	            var curNode = startNode;
	            while (curNode) {
	                var nextNode = iterateFn(curNode);

	                if (!nextNode) {
	                    if (iterateChildren(curNode)) {
	                        return true;
	                    }
	                    curNode = curNode.getNextSibling();
	                } else if (nextNode === true) {
	                    iterateChildren(curNode);
	                    return true;
	                }
	                // 对于给定了下一个节点的情况，就不再遍历curNode的子节点了
	                else if (nextNode instanceof Node) {
	                        if (!nextNode.isAfter(curNode)) {
	                            throw new Error('wrong next node');
	                        }

	                        curNode = nextNode;
	                    }
	                    // 外部提供获取下一个节点和获取当前节点的子节点方法
	                    else if (nextNode.type === 'options') {
	                            var childNodes = nextNode.getChildNodes instanceof Function ? nextNode.getChildNodes(curNode) : Node.ELEMENT_NODE === curNode.getNodeType() ? curNode.getChildNodes() : [];

	                            if (iterateChildren(childNodes)) {
	                                return true;
	                            }

	                            curNode = nextNode.getNextNode instanceof Function ? nextNode.getNextNode(curNode) : curNode.getNextSibling();
	                        }

	                if (curNode && curNode.isAfter(endNode)) {
	                    curNode = null;
	                }
	            }

	            function iterateChildren(childNodes) {
	                if (childNodes.length) {
	                    var isBreak = Node.iterate(childNodes[0], childNodes[childNodes.length - 1], iterateFn);
	                    if (isBreak === true) {
	                        curNode = null;
	                        return true;
	                    }
	                }
	            }
	        }
	    }]);

	    return Node;
	}();

	(0, _utils.extend)(Node, {
	    ELEMENT_NODE: 1,
	    ATTRIBUTE_NODE: 2,
	    TEXT_NODE: 3,
	    CDATA_SECTION_NODE: 4,
	    ENTITY_REFERENCE_NODE: 5,
	    ENTITY_NODE: 6,
	    PROCESSING_INSTRUCTION_NODE: 7,
	    COMMENT_NODE: 8,
	    DOCUMENT_NODE: 9,
	    DOCUMENT_TYPE_NODE: 10,
	    DOCUMENT_FRAGMENT_NODE: 11,
	    NOTATION_NODE: 12,

	    eventList: ('blur focus focusin focusout load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select submit keydown keypress keyup error contextmenu').split(' ')
	});

	exports.default = Node;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.type = exports.isClass = exports.forEach = exports.bind = exports.distinctArr = exports.camel2line = exports.line2camel = exports.isArray = exports.getSuper = undefined;

	var _utils = __webpack_require__(11);

	var getSuper = undefined; /**
	                           * @file 扩展一下`vtpl/src/utils`
	                           * @author yibuyisheng(yibuyisheng@163.com)
	                           */

	if (Object.getPrototypeOf) {
	    exports.getSuper = getSuper = function getSuper(cls) {
	        return Object.getPrototypeOf(cls.prototype).constructor;
	    };
	} else {
	    exports.getSuper = getSuper = function getSuper(cls) {
	        return cls.prototype.__proto__.constructor;
	    };
	}

	exports.getSuper = getSuper;
	exports.isArray = _utils.isArray;
	exports.line2camel = _utils.line2camel;
	exports.camel2line = _utils.camel2line;
	exports.distinctArr = _utils.distinctArr;
	exports.bind = _utils.bind;
	exports.forEach = _utils.forEach;
	exports.isClass = _utils.isClass;
	exports.type = _utils.type;

/***/ },
/* 11 */
4,
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 组件管理。ComponentManager也是有层级关系的，
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *       Tree下面的ComponentManager注册这个Tree实例用到的Component，
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *       而在Component中也可以注册此Component的tpl中将会使用到的Component。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utils = __webpack_require__(10);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ComponentManager = function () {
	    function ComponentManager() {
	        _classCallCheck(this, ComponentManager);

	        this.components = {};
	    }

	    /**
	     * 批量注册组件
	     *
	     * @public
	     * @param  {Array.<Class>} componentClasses 组件类数组
	     */

	    _createClass(ComponentManager, [{
	        key: 'register',
	        value: function register(componentClasses) {
	            if (!(0, _utils.isArray)(componentClasses)) {
	                return;
	            }
	            for (var i = 0, il = componentClasses.length; i < il; ++i) {
	                var ComponentClass = componentClasses[i];
	                if (!ComponentClass) {
	                    throw new Error('the `ComponentClass` passed in is undefined, please check your code.');
	                }
	                var name = ComponentClass.name;
	                this.components[name] = ComponentClass;
	                this.mountStyle(ComponentClass);
	            }
	        }

	        /**
	         * 根据名字获取组件类。在模板解析的过程中会调用这个方法。
	         *
	         * @public
	         * @param  {string} name 组件名
	         * @return {ComponentClass}  组件类
	         */

	    }, {
	        key: 'getClass',
	        value: function getClass(name) {
	            var component = this.components[name];
	            if (component) {
	                return component;
	            }

	            if (this.parent) {
	                component = this.parent.getClass(name);
	            }

	            return component;
	        }

	        /**
	         * 设置父级组件管理器
	         *
	         * @public
	         * @param {ComponentManger} componentManager 组件管理器
	         */

	    }, {
	        key: 'setParent',
	        value: function setParent(componentManager) {
	            this.parent = componentManager;
	        }

	        /**
	         * 将组件的样式挂载上去
	         *
	         * @private
	         * @param {组件类} ComponentClass 组件类
	         */

	    }, {
	        key: 'mountStyle',
	        value: function mountStyle(ComponentClass) {
	            var componentName = ComponentClass.name;
	            var styleNodeId = 'component-' + componentName;

	            // 判断一下，避免重复添加css
	            if (!document.getElementById(styleNodeId)) {
	                var style = ComponentClass.getStyle instanceof Function && ComponentClass.getStyle() || '';
	                if (style) {
	                    var styleNode = document.createElement('style');
	                    styleNode.setAttribute('id', styleNodeId);
	                    styleNode.innerText = style;
	                    document.head.appendChild(styleNode);
	                }
	            }

	            // 将父类的css样式也加上去。父类很可能没注册，如果此处不加上去，样式可能就会缺一块。
	            if (componentName !== 'Component') {
	                this.mountStyle((0, _utils.getSuper)(ComponentClass));
	            }
	        }

	        // TODO

	    }, {
	        key: 'destroy',
	        value: function destroy() {}
	    }]);

	    return ComponentManager;
	}();

	exports.default = ComponentManager;

/***/ },
/* 13 */
9,
/* 14 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @file 组件状态枚举
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */

	exports.default = {
	    INITIALIZING: 1,
	    READY: 2,
	    DESTROIED: 3,
	    BEFORE_RENDER: 4
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Data2 = __webpack_require__(16);

	var _Data3 = _interopRequireDefault(_Data2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 组件子节点
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var Children = function (_Data) {
	    _inherits(Children, _Data);

	    function Children(startNode, endNode, parentTree) {
	        _classCallCheck(this, Children);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Children).call(this));

	        _this.$$startNode = startNode;
	        _this.$$endNode = endNode;
	        _this.$$parentTree = parentTree;
	        return _this;
	    }

	    _createClass(Children, [{
	        key: 'getStartNode',
	        value: function getStartNode() {
	            return this.$$startNode;
	        }
	    }, {
	        key: 'getEndNode',
	        value: function getEndNode() {
	            return this.$$endNode;
	        }
	    }, {
	        key: 'getParentTree',
	        value: function getParentTree() {
	            return this.$$parentTree;
	        }
	    }, {
	        key: 'equals',
	        value: function equals(children) {
	            if (!(children instanceof Children)) {
	                return false;
	            }
	            return this.$$startNode === children.$$startNode && this.$$endNode === children.$$endNode && this.$$parentTree === children.$$parentTree;
	        }
	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new Children(this.$$startNode, this.$$endNode, this.$$parentTree);
	        }
	    }]);

	    return Children;
	}(_Data3.default);

	exports.default = Children;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @file 数据基类，这个用于scope里面的数据，主要实现了clone和equals方法
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */

	var Data = function () {
	    function Data() {
	        _classCallCheck(this, Data);
	    }

	    _createClass(Data, [{
	        key: 'clone',
	        value: function clone() {
	            throw new Error('please implement the `clone` method first!');
	        }
	    }, {
	        key: 'equals',
	        value: function equals() {
	            throw new Error('please implement the `equal` method first!');
	        }
	    }, {
	        key: 'toString',
	        value: function toString() {
	            return '';
	        }
	    }]);

	    return Data;
	}();

	exports.default = Data;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _ExprParser = __webpack_require__(2);

	var _ExprParser2 = _interopRequireDefault(_ExprParser);

	var _Tree = __webpack_require__(18);

	var _Tree2 = _interopRequireDefault(_Tree);

	var _utils = __webpack_require__(11);

	var _Children = __webpack_require__(15);

	var _Children2 = _interopRequireDefault(_Children);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @file 给ExprParser加上处理组件props.children的能力；
	 *       给ExprParser加上记录子孙的功能。
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */

	var setAttrOld = _ExprParser2.default.prototype.setAttr;

	/**
	 * 此处增加处理children的情况
	 *
	 * @protected
	 * @param {string} attrName  属性名
	 * @param {string|Object} value 值
	 */
	_ExprParser2.default.prototype.setAttr = function setTextNodeValue(attrName, value) {
	    if (value && value instanceof _Children2.default) {
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
	        for (var curNode = value.getStartNode(); curNode && !curNode.isAfter(value.getEndNode()); curNode = curNode.getNextSibling()) {
	            delayFns.push((0, _utils.bind)(parentNode.insertBefore, parentNode, curNode, this.node));
	        }
	        for (var i = 0, il = delayFns.length; i < il; ++i) {
	            delayFns[i]();
	        }
	        parentNode.insertBefore(this.endNode, this.node);
	        // 移除之前的文本节点，这个节点现在已经没有用了。
	        this.node.remove();
	        this.node = null;

	        // 创建子树
	        this.$$childrenTree = new _Tree2.default({
	            startNode: this.startNode,
	            endNode: this.endNode
	        });
	        this.$$childrenTree.setParent(value.getParentTree());
	        this.$$childrenTree.rootScope.setParent(value.getParentTree().rootScope);
	        value.getParentTree().rootScope.addChild(this.$$childrenTree.rootScope);

	        this.$$childrenTree.compile();
	        this.$$childrenTree.link();
	        this.$$childrenTree.initRender();
	    } else if (attrName === 'ref') {
	        this.$$ref = value;
	        var children = this.tree.getTreeVar('children');
	        children[value] = this.node;
	    } else {
	        setAttrOld.call(this, attrName, value);
	    }
	};

	_ExprParser2.default.prototype.getStartNode = function getStartNode() {
	    if (this.node) {
	        return this.node;
	    }

	    return this.startNode;
	};

	_ExprParser2.default.prototype.getEndNode = function getEndNode() {
	    if (this.node) {
	        return this.node;
	    }

	    return this.endNode;
	};

	var destroyOld = _ExprParser2.default.prototype.destroy;
	_ExprParser2.default.prototype.destroy = function destroy() {
	    // TODO: destroy the `childrenTree`

	    if (this.$$ref) {
	        var children = this.tree.getTreeVar('children');
	        children[this.$$ref] = null;
	        delete children[this.$$ref];
	    }

	    destroyOld.call(this);
	};

	var goDarkOld = _ExprParser2.default.prototype.goDark;
	_ExprParser2.default.prototype.goDark = function goDark() {
	    if (this.$$childrenTree) {
	        this.$$childrenTree.goDark();
	    } else {
	        goDarkOld.call(this);
	    }
	};

	var restoreFromDarkOld = _ExprParser2.default.prototype.restoreFromDark;
	_ExprParser2.default.prototype.restoreFromDark = function restoreFromDark() {
	    if (this.$$childrenTree) {
	        this.$$childrenTree.restoreFromDark();
	    } else {
	        restoreFromDarkOld.call(this);
	    }
	};

	exports.default = _ExprParser2.default;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utils = __webpack_require__(4);

	var _ScopeModel = __webpack_require__(3);

	var _ScopeModel2 = _interopRequireDefault(_ScopeModel);

	var _Base2 = __webpack_require__(7);

	var _Base3 = _interopRequireDefault(_Base2);

	var _Node = __webpack_require__(9);

	var _Node2 = _interopRequireDefault(_Node);

	var _ExprWatcher = __webpack_require__(19);

	var _ExprWatcher2 = _interopRequireDefault(_ExprWatcher);

	var _parserState = __webpack_require__(8);

	var _parserState2 = _interopRequireDefault(_parserState);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 最终的树
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var Tree = function (_Base) {
	    _inherits(Tree, _Base);

	    /**
	     * 树的初始化方法。
	     *
	     * @protected
	     * @param  {Object} options 初始化参数
	     * @param {nodes/Node} options.startNode 这棵树要解析的dom块的开始节点
	     * @param {nodes/Node} options.endNode 这棵树要解析的dom块的结束节点
	     */

	    function Tree(options) {
	        _classCallCheck(this, Tree);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Tree).call(this, options));

	        _this.startNode = options.startNode;
	        _this.endNode = options.endNode;

	        _this.treeVars = {};
	        _this.$parsers = [];
	        _this.$parent = null;
	        _this.$$nodeIdParserMap = {};

	        _this.rootScope = new _ScopeModel2.default();

	        _this.$exprWatcher = null;
	        return _this;
	    }

	    /**
	     * 设置绑定在树上面的额外变量。这些变量有如下特性：
	     * 1、无法覆盖；
	     * 2、在获取treeVars上面某个变量的时候，如果当前树取出来是undefined，那么就会到父级树的treeVars上去找，以此类推。
	     *
	     * @public
	     * @param {string} name  变量名
	     * @param {*} value 变量值
	     * @return {boolean} 是否设置成功
	     */

	    _createClass(Tree, [{
	        key: 'setTreeVar',
	        value: function setTreeVar(name, value) {
	            if (this.treeVars[name] !== undefined) {
	                return false;
	            }
	            this.treeVars[name] = value;
	            return true;
	        }

	        /**
	         * 去掉树上的变量
	         *
	         * @public
	         * @param  {string} name 变量名
	         */

	    }, {
	        key: 'unsetTreeVar',
	        value: function unsetTreeVar(name) {
	            this.treeVars[name] = undefined;
	        }

	        /**
	         * 获取绑定到树上的额外变量
	         *
	         * @public
	         * @param  {string} name                  变量名
	         * @param  {boolean=} shouldNotFindInParent 如果在当前树中没找到，是否到父级树中去找。
	         *                                         true就代表不去，false就代表要去
	         * @return {*}
	         */

	    }, {
	        key: 'getTreeVar',
	        value: function getTreeVar(name, shouldNotFindInParent) {
	            var val = this.treeVars[name];
	            if (!shouldNotFindInParent && val === undefined && this.$parent) {
	                val = this.$parent.getTreeVar(name);
	            }
	            return val;
	        }

	        /**
	         * 设置树的父级，对于数变量的查询就形成了一条向上的链。
	         *
	         * @public
	         * @param {Tree} parent 父级树
	         */

	    }, {
	        key: 'setParent',
	        value: function setParent(parent) {
	            this.$parent = parent;
	        }

	        /**
	         * 拿到当前树所属的表达式监视器。
	         * 这个表达式监视器是和当前树的rootScope绑定的，也就是说只能监视当前树管辖范围内的表达式。
	         *
	         * @public
	         * @return {ExprWatcher} 表达式监视器
	         */

	    }, {
	        key: 'getExprWatcher',
	        value: function getExprWatcher() {
	            return this.$exprWatcher;
	        }

	        /**
	         * 获取当前树下所有的解析器对象
	         *
	         * @public
	         * @return {Array.<Parser>}
	         */

	    }, {
	        key: 'getParsers',
	        value: function getParsers() {
	            return this.$parsers;
	        }

	        /**
	         * 编译
	         *
	         * @public
	         */

	    }, {
	        key: 'compile',
	        value: function compile() {
	            var _this2 = this;

	            this.$exprWatcher = new _ExprWatcher2.default(this.rootScope, this.getTreeVar('exprCalculater'));

	            var delayFns = [];
	            _Node2.default.iterate(this.startNode, this.endNode, function (node) {
	                var options = {
	                    startNode: node,
	                    node: node,
	                    tree: _this2
	                };

	                var parser = undefined;
	                var ParserClasses = _this2.getTreeVar('parserClasses');
	                for (var i = 0, il = ParserClasses.length; i < il; ++i) {
	                    var ParserClass = ParserClasses[i];
	                    parser = _this2.createParser(ParserClass, options);

	                    if (!parser) {
	                        continue;
	                    }
	                    _this2.$parsers.push(parser);
	                    break;
	                }

	                if (!parser) {
	                    throw new Error('no such parser');
	                }

	                delayFns.push(handle);

	                function handle() {
	                    parser.$state = _parserState2.default.BEGIN_COMPILING;
	                    parser.collectExprs();
	                    parser.$state = _parserState2.default.END_COMPILING;
	                }

	                return {
	                    type: 'options',
	                    getNextNode: function getNextNode(curNode) {
	                        return parser.getEndNode().getNextSibling();
	                    },
	                    getChildNodes: function getChildNodes(curNode) {
	                        if (parser.getChildNodes instanceof Function) {
	                            return parser.getChildNodes();
	                        }
	                        return curNode.getChildNodes();
	                    }
	                };
	            });

	            for (var i = 0, il = delayFns.length; i < il; ++i) {
	                delayFns[i]();
	            }
	        }

	        /**
	         * 连接
	         *
	         * @public
	         */

	    }, {
	        key: 'link',
	        value: function link() {
	            for (var i = 0, il = this.$parsers.length; i < il; ++i) {
	                var parser = this.$parsers[i];
	                // 将解析器对象和对应树的scope绑定起来
	                parser.$state = _parserState2.default.BEGIN_LINK;
	                parser.linkScope();
	                parser.$state = _parserState2.default.END_LINK;
	            }

	            this.$exprWatcher.start();
	        }

	        /**
	         * 初始第一次渲染
	         *
	         * @public
	         */

	    }, {
	        key: 'initRender',
	        value: function initRender() {
	            for (var i = 0, il = this.$parsers.length; i < il; ++i) {
	                var parser = this.$parsers[i];
	                // 将解析器对象和对应树的scope绑定起来
	                parser.$state = _parserState2.default.BEGIN_INIT_RENDER;
	                parser.initRender();
	                parser.$state = _parserState2.default.READY;
	            }
	        }
	    }, {
	        key: 'goDark',
	        value: function goDark() {
	            // 调用这棵树下面所有解析器的goDark方法
	            (0, _utils.forEach)(this.$parsers, function (parser) {
	                return parser.goDark();
	            });
	        }
	    }, {
	        key: 'restoreFromDark',
	        value: function restoreFromDark() {
	            (0, _utils.forEach)(this.$parsers, function (parser) {
	                return parser.restoreFromDark();
	            });
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            walk(this.$parsers);

	            this.startNode = null;
	            this.endNode = null;
	            this.config = null;

	            this.$parser = null;
	            this.treeVars = null;

	            this.$$nodeIdParserMap = null;

	            function walk(parsers) {
	                (0, _utils.each)(parsers, function (parser) {
	                    parser.destroy();
	                    parser.$state = _parserState2.default.DETROIED;
	                });
	            }
	        }

	        /**
	         * 创建解析器实例。
	         *
	         * @inner
	         * @param {Class} ParserClass parser 类
	         * @param  {Object} options 初始化参数
	         * @return {Object}         返回值
	         */

	    }, {
	        key: 'createParser',
	        value: function createParser(ParserClass, options) {
	            var startNode = options.startNode || options.node;
	            var config = this.getTreeVar('config');
	            if (!ParserClass.isProperNode(startNode, config)) {
	                return;
	            }

	            var endNode = undefined;
	            if (ParserClass.findEndNode) {
	                endNode = ParserClass.findEndNode(startNode, config);

	                if (!endNode) {
	                    throw ParserClass.getNoEndNodeError();
	                } else if (endNode.parentNode !== startNode.parentNode) {
	                    throw new Error('the relationship between start node and end node is not brotherhood!');
	                }
	            }

	            var parser = new ParserClass((0, _utils.extend)(options, {
	                endNode: endNode
	            }));

	            var key = !endNode || startNode.equal(endNode) ? startNode.getNodeId() : startNode.getNodeId() + '-' + endNode.getNodeId();
	            this.$$nodeIdParserMap[key] = parser;

	            return parser;
	        }

	        /**
	         * 给parser开放的创建树的方法
	         *
	         * @public
	         * @param {Object} options 参数
	         * @return {Tree}
	         */

	    }, {
	        key: 'createTree',
	        value: function createTree(options) {
	            return new Tree(options);
	        }
	    }]);

	    return Tree;
	}(_Base3.default);

	exports.default = Tree;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utils = __webpack_require__(4);

	var _Event2 = __webpack_require__(5);

	var _Event3 = _interopRequireDefault(_Event2);

	var _clone = __webpack_require__(20);

	var _clone2 = _interopRequireDefault(_clone);

	var _deepEqual = __webpack_require__(22);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _Data = __webpack_require__(21);

	var _Data2 = _interopRequireDefault(_Data);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 表达式检测器。检测器实例应该是跟树实例绑定在一起的
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var ExprWatcher = function (_Event) {
	    _inherits(ExprWatcher, _Event);

	    function ExprWatcher(scopeModel, exprCalculater) {
	        _classCallCheck(this, ExprWatcher);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExprWatcher).call(this));

	        _this.$$scopeModel = scopeModel;
	        _this.$$exprCalculater = exprCalculater;

	        _this.$$exprs = {};
	        _this.$$paramNameToExprMap = {};
	        _this.$$exprOldValues = {};

	        _this.$$exprEqualFn = {};
	        _this.$$exprCloneFn = {};
	        return _this;
	    }

	    /**
	     * 添加变量名到表达式的映射
	     *
	     * @private
	     * @param {Array.<string>} names 分析出来的expr依赖的一组变量
	     * @param {string} expr  表达式
	     */

	    _createClass(ExprWatcher, [{
	        key: 'addParamName2ExprMap',
	        value: function addParamName2ExprMap(names, expr) {
	            for (var i = 0, il = names.length; i < il; ++i) {
	                var paramName = names[i];
	                var exprArr = this.$$paramNameToExprMap[paramName] || [];
	                exprArr.push(expr);
	                this.$$paramNameToExprMap[paramName] = exprArr;
	            }
	        }

	        /**
	         * 根据变量的名字拿到受该变量影响的表达式
	         *
	         * @private
	         * @param  {string} name 变量名
	         * @return {Array.<string>} 受影响的表达式
	         */

	    }, {
	        key: 'getExprsByParamName',
	        value: function getExprsByParamName(name) {
	            return this.$$paramNameToExprMap[name];
	        }

	        /**
	         * 添加要检测的表达式
	         *
	         * @public
	         * @param {string} expr 表达式字符串，带有`${}`的
	         */

	    }, {
	        key: 'addExpr',
	        value: function addExpr(expr) {
	            var _this2 = this;

	            var _generateExpressionFu = this.generateExpressionFunction(expr);

	            var paramNameDependency = _generateExpressionFu.paramNameDependency;
	            var fn = _generateExpressionFu.fn;

	            this.addParamName2ExprMap(paramNameDependency, expr);
	            this.$$exprs[expr] = function () {
	                return fn(_this2.$$scopeModel);
	            };
	        }
	    }, {
	        key: 'setExprEqualsFn',
	        value: function setExprEqualsFn(expr, equalFn) {
	            this.$$exprEqualFn[expr] = equalFn;
	        }
	    }, {
	        key: 'setExprCloneFn',
	        value: function setExprCloneFn(expr, cloneFn) {
	            this.$$exprCloneFn[expr] = cloneFn;
	        }

	        /**
	         * 生成表达式计算函数
	         *
	         * @private
	         * @param  {string} expr 表达式字符串
	         * @return {Object}
	         */

	    }, {
	        key: 'generateExpressionFunction',
	        value: function generateExpressionFunction(expr) {
	            var _this3 = this;

	            // 先去掉expr里面前后空格
	            expr = expr.replace(/^\s+|\s+$/g, '');

	            var exprs = expr.match(/\$\{(.+?)\}/g);
	            if (!exprs || !exprs.length) {
	                return;
	            }

	            var paramNameDependency = [];
	            var rawExprs = [];
	            for (var i = 0, il = exprs.length; i < il; ++i) {
	                var rawExpr = exprs[i].replace(/^\$\{|\}$/g, '');
	                rawExprs.push(rawExpr);

	                var _$$exprCalculater$cre = this.$$exprCalculater.createExprFn(rawExpr, false);

	                var paramNames = _$$exprCalculater$cre.paramNames;

	                paramNameDependency.push.apply(paramNameDependency, paramNames);
	            }

	            return {
	                paramNameDependency: paramNameDependency,
	                fn: function fn(scopeModel) {
	                    if (rawExprs.length === 1) {
	                        return _this3.$$exprCalculater.calculate(rawExprs[0], false, _this3.$$scopeModel);
	                    }
	                    return expr.replace(/\$\{(.+?)\}/g, function () {
	                        return _this3.$$exprCalculater.calculate(arguments.length <= 1 ? undefined : arguments[1], false, _this3.$$scopeModel);
	                    });
	                }
	            };
	        }

	        /**
	         * 开始监听scopeModel的变化
	         *
	         * @public
	         */

	    }, {
	        key: 'start',
	        value: function start() {
	            this.$$scopeModel.on('change', this.check, this);
	            this.$$scopeModel.on('parentchange', this.check, this);
	        }

	        /**
	         * 停止监听
	         *
	         * @public
	         */

	    }, {
	        key: 'stop',
	        value: function stop() {
	            this.$$scopeModel.off('change', this.check, this);
	        }

	        /**
	         * 检查this.$$exprs里面的脏值情况，如果脏了，就会触发change事件
	         *
	         * @private
	         * @param {Event} event 附带的一些参数
	         */

	    }, {
	        key: 'check',
	        value: function check(event) {
	            var _this4 = this;

	            var delayFns = [];

	            (0, _utils.forEach)(event.changes, function (change) {
	                var influencedExprs = _this4.getExprsByParamName(change.name);

	                (0, _utils.forEach)(influencedExprs, function (expr) {
	                    var fn = _this4.$$exprs[expr];
	                    delayFns.push((0, _utils.bind)(calculate, _this4, expr, fn));
	                });
	            });
	            (0, _utils.forEach)(delayFns, function (fn) {
	                return fn();
	            });

	            function calculate(expr, fn) {
	                var exprValue = fn();
	                var oldValue = this.$$exprOldValues[expr];

	                var equals = (0, _utils.bind)(this.$$exprEqualFn[expr], null) || (0, _utils.bind)(this.equals, this);
	                var clone = (0, _utils.bind)(this.$$exprCloneFn[expr], null) || (0, _utils.bind)(this.dump, this);

	                if (!equals(expr, exprValue, oldValue)) {
	                    this.trigger('change', { expr: expr, newValue: exprValue, oldValue: oldValue });
	                    this.$$exprOldValues[expr] = clone(expr, exprValue);
	                }
	            }
	        }

	        /**
	         * 计算表达式的值
	         *
	         * @public
	         * @param  {string} expr 表达式字符串`${name}`
	         * @return {*}      计算结果
	         */

	    }, {
	        key: 'calculate',
	        value: function calculate(expr) {
	            return this.$$exprs[expr]();
	        }

	        /**
	         * 深复制一份obj（只针对可枚举的属性）。
	         *
	         * @private
	         * @param {string} expr 对应的表达式
	         * @param  {*} obj 要复制的对象
	         * @return {*} 复制好的对象
	         */

	    }, {
	        key: 'dump',
	        value: function dump(expr, obj) {
	            if (obj instanceof _Data2.default) {
	                return obj.clone();
	            }

	            return (0, _clone2.default)(obj);
	        }

	        /**
	         * 深度检查两个对象是否相等
	         *
	         * @private
	         * @param  {string} expr     表达式字符串
	         * @param  {*} newValue 新值
	         * @param  {*} oldValue 旧值
	         * @return {boolean} 是否相等
	         */

	    }, {
	        key: 'equals',
	        value: function equals(expr, newValue, oldValue) {
	            if (newValue instanceof _Data2.default) {
	                return newValue.equals(oldValue);
	            }
	            if (oldValue instanceof _Data2.default) {
	                return oldValue.equals(newValue);
	            }

	            return (0, _deepEqual2.default)(newValue, oldValue);
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.stop();
	        }
	    }]);

	    return ExprWatcher;
	}(_Event3.default);

	exports.default = ExprWatcher;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * @file 对象拷贝
	                                                                                                                                                                                                                                                   * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                   */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = clone;

	var _utils = __webpack_require__(4);

	var _Data = __webpack_require__(21);

	var _Data2 = _interopRequireDefault(_Data);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 拷贝对象
	 *
	 * @param {*} value 要拷贝的
	 * @param {number=} deep 拷贝的深度，默认全部拷贝
	 * @param {function(*,Number):*} customizer.i.clone 克隆函数
	 * @return {*}
	 */
	function clone(value, deep) {
	    if (deep === undefined) {
	        deep = Number.POSITIVE_INFINITY;
	    }
	    if (deep <= 0) {
	        return value;
	    }

	    var typeOfValue = typeof value === 'undefined' ? 'undefined' : _typeof(value);

	    // 基本类型
	    if (typeOfValue === 'undefined' || typeOfValue === 'boolean' || typeOfValue === 'string' || typeOfValue === 'number'
	    // 不考虑Safari5、Chrome7之前`typeof [正则]`也是function的问题
	     || typeOfValue === 'function' || value === null) {
	        return value;
	    }

	    var className = (0, _utils.getClassNameOf)(value);

	    // 包装类型和日期
	    if (className === 'Number' || className === 'Boolean' || className === 'String' || className === 'Date') {
	        return new { Number: Number, Boolean: Boolean, String: String, Date: Date }[className](value.valueOf());
	    }

	    if (className === 'Array') {
	        var _ret = function () {
	            var ret = [];
	            (0, _utils.forEach)(value, function (item) {
	                ret.push(clone(item, deep - 1));
	            });
	            return {
	                v: ret
	            };
	        }();

	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    }

	    if (value instanceof _Data2.default) {
	        return value.clone();
	    }

	    // 遍历对象属性，所以此处只能克隆可枚举的属性
	    var ret = {};
	    /* eslint-disable guard-for-in */
	    for (var key in value) {
	        /* eslint-enable guard-for-in */
	        ret[key] = clone(value[key], deep - 1);
	    }
	    return ret;
	}

/***/ },
/* 21 */
16,
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * @file 深比较
	                                                                                                                                                                                                                                                   * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                   */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = deepEqual;

	var _utils = __webpack_require__(4);

	var _Data = __webpack_require__(21);

	var _Data2 = _interopRequireDefault(_Data);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function unwrap(value) {
	    if ((0, _utils.isClass)(value, 'Number') || (0, _utils.isClass)(value, 'Boolean') || (0, _utils.isClass)(value, 'String') || (0, _utils.isClass)(value, 'Date')) {
	        return value.valueOf();
	    }

	    return value;
	}

	function isBaseType(value) {
	    var typeOfValue = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	    return typeOfValue === 'undefined' || typeOfValue === 'boolean' || typeOfValue === 'string' || typeOfValue === 'number' || typeOfValue === 'function' || value === null || (0, _utils.isClass)(value, 'Number') || (0, _utils.isClass)(value, 'Boolean') || (0, _utils.isClass)(value, 'String') || (0, _utils.isClass)(value, 'Date');
	}

	function deepEqual(value1, value2) {
	    // 基类型比较
	    if (isBaseType(value1) || isBaseType(value2)) {
	        return unwrap(value1) === unwrap(value2);
	    }

	    var className1 = (0, _utils.getClassNameOf)(value1);
	    var className2 = (0, _utils.getClassNameOf)(value2);

	    // 类型不同
	    if (className1 !== className2) {
	        return false;
	    }

	    if (className1 === 'Array') {
	        if (value1.length !== value2.length) {
	            return false;
	        }

	        for (var i = 0, il = value1.length; i < il; ++i) {
	            if (!deepEqual(value1[i], value2[i])) {
	                return false;
	            }
	        }

	        return true;
	    }

	    if (value1 instanceof _Data2.default) {
	        return value1.equals(value2);
	    }

	    /* eslint-disable guard-for-in */
	    var keys = {};
	    for (var key in value1) {
	        keys[key] = true;
	    }
	    for (var key in value2) {
	        keys[key] = true;
	    }

	    for (var key in keys) {
	        if (value1[key] !== value2[key] && !deepEqual(value1[key], value2[key])) {
	            return false;
	        }
	    }
	    return true;
	    /* eslint-enable guard-for-in */
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file vtpl主文件
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _ForDirectiveParser = __webpack_require__(24);

	var _ForDirectiveParser2 = _interopRequireDefault(_ForDirectiveParser);

	var _IfDirectiveParser = __webpack_require__(26);

	var _IfDirectiveParser2 = _interopRequireDefault(_IfDirectiveParser);

	var _DirectiveParser = __webpack_require__(25);

	var _DirectiveParser2 = _interopRequireDefault(_DirectiveParser);

	var _ExprParser = __webpack_require__(27);

	var _ExprParser2 = _interopRequireDefault(_ExprParser);

	var _VarDirectiveParser = __webpack_require__(28);

	var _VarDirectiveParser2 = _interopRequireDefault(_VarDirectiveParser);

	var _Tree = __webpack_require__(29);

	var _Tree2 = _interopRequireDefault(_Tree);

	var _ExprCalculater = __webpack_require__(30);

	var _ExprCalculater2 = _interopRequireDefault(_ExprCalculater);

	var _DomUpdater = __webpack_require__(32);

	var _DomUpdater2 = _interopRequireDefault(_DomUpdater);

	var _utils = __webpack_require__(4);

	var _Config = __webpack_require__(33);

	var _Config2 = _interopRequireDefault(_Config);

	var _NodesManager = __webpack_require__(34);

	var _NodesManager2 = _interopRequireDefault(_NodesManager);

	var _Parser = __webpack_require__(6);

	var _Parser2 = _interopRequireDefault(_Parser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var VTpl = function () {
	    function VTpl(options) {
	        _classCallCheck(this, VTpl);

	        options = (0, _utils.extend)({
	            config: new _Config2.default()
	        }, options);

	        this.$nodesManager = new _NodesManager2.default();
	        if (options.startNode) {
	            options.startNode = this.$nodesManager.getNode(options.startNode);
	        }
	        if (options.endNode) {
	            options.endNode = this.$nodesManager.getNode(options.endNode);
	        }
	        if (options.node) {
	            options.node = this.$nodesManager.getNode(options.node);
	        }

	        this.$options = options;

	        var tree = new _Tree2.default(this.$options);
	        tree.setTreeVar('exprCalculater', new _ExprCalculater2.default());
	        tree.setTreeVar('domUpdater', new _DomUpdater2.default());
	        tree.setTreeVar('config', this.$options.config);
	        tree.setTreeVar('nodesManager', this.$nodesManager);
	        tree.setTreeVar('parserClasses', []);
	        this.$tree = tree;

	        // 注册一批解析器
	        this.registerParser(_ForDirectiveParser2.default);
	        this.registerParser(_IfDirectiveParser2.default);
	        this.registerParser(_DirectiveParser2.default);
	        this.registerParser(_ExprParser2.default);
	        this.registerParser(_VarDirectiveParser2.default);
	    }

	    _createClass(VTpl, [{
	        key: 'setExprEqualFn',
	        value: function setExprEqualFn(expr, handler) {
	            var exprWatcher = this.$tree.getExprWatcher();
	            exprWatcher.setExprEqualFn(expr, handler);
	        }
	    }, {
	        key: 'setExprCloneFn',
	        value: function setExprCloneFn(expr, handler) {
	            var exprWatcher = this.$tree.getExprWatcher();
	            exprWatcher.setExprCloneFn(expr, handler);
	        }

	        /**
	         * 注册一下解析器类。
	         *
	         * 解析器类的命中规则是：
	         *
	         * 当遇到一个节点的时候，会严格按照ParserClasses数组的顺序来判断当前的节点是否归该解析器类处理（isProperNode）。
	         * 所以，越是靠前的解析器类，就拥有越高的优先级。
	         *
	         * 在注册解析器类的时候，这个顺序就会定下来，并且子类拥有比父类更高的优先级。
	         *
	         * @param  {Class} parserClass 解析器类
	         */

	    }, {
	        key: 'registerParser',
	        value: function registerParser(parserClass) {
	            if (!(0, _utils.isSubClassOf)(parserClass, _Parser2.default)) {
	                throw new TypeError('wrong parser class');
	            }

	            var parserClasses = this.$tree.getTreeVar('parserClasses');
	            parserClasses.push(parserClass);
	            parserClasses.sort(function (prev, next) {
	                return (0, _utils.isSubClassOf)(prev, next) ? -1 : 1;
	            });
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            this.$tree.compile();
	            this.$tree.link();
	            this.$tree.getTreeVar('domUpdater').start();
	            this.$tree.initRender();
	        }
	    }, {
	        key: 'setData',
	        value: function setData() {
	            var scope = this.$tree.rootScope;
	            scope.set.apply(scope, arguments);
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.$tree.getTreeVar('exprCalculater').destroy();
	            this.$tree.getTreeVar('domUpdater').destroy();

	            this.$tree.destroy();
	            this.$nodesManager.destroy();

	            this.$nodesManager = null;
	            this.$options = null;
	            this.$tree = null;
	        }
	    }]);

	    return VTpl;
	}();

	exports.default = VTpl;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _DirectiveParser2 = __webpack_require__(25);

	var _DirectiveParser3 = _interopRequireDefault(_DirectiveParser2);

	var _utils = __webpack_require__(4);

	var _Node = __webpack_require__(9);

	var _Node2 = _interopRequireDefault(_Node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file for 指令
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var ForDirectiveParser = function (_DirectiveParser) {
	    _inherits(ForDirectiveParser, _DirectiveParser);

	    function ForDirectiveParser(options) {
	        _classCallCheck(this, ForDirectiveParser);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ForDirectiveParser).call(this, options));

	        _this.startNode = options.startNode;
	        _this.endNode = options.endNode;

	        _this.tplSeg = null;
	        _this.expr = null;
	        _this.updateFn = null;
	        _this.trees = [];
	        _this.$$itemVariableName = null;
	        return _this;
	    }

	    _createClass(ForDirectiveParser, [{
	        key: 'collectExprs',
	        value: function collectExprs() {
	            // for指令之间没有节点，啥也不干
	            if (this.startNode.getNextSibling().equal(this.endNode)) {
	                return;
	            }

	            // 将for指令之间的节点抽出来，放在tplSeg里面作为样板缓存，后面会根据这个样板生成具体的DOM结构。
	            var nodesManager = this.tree.getTreeVar('nodesManager');
	            this.tplSeg = nodesManager.createDocumentFragment('div');
	            for (var curNode = this.startNode.getNextSibling(); curNode && !curNode.isAfter(this.endNode.getPreviousSibling());) {
	                var nextNode = curNode.getNextSibling();
	                this.tplSeg.appendChild(curNode);
	                curNode = nextNode;
	            }

	            var expr = this.startNode.getNodeValue().replace('for:', '');
	            try {
	                var _expr$match = expr.match(/^\s*([$\w.\[\]]+)\s+as\s+([$\w]+)\s*$/);

	                var _expr$match2 = _slicedToArray(_expr$match, 3);

	                this.listExpr = _expr$match2[1];
	                this.$$itemVariableName = _expr$match2[2];
	            } catch (error) {
	                throw new Error('wrong for expression ' + expr);
	            }

	            var exprWatcher = this.tree.getExprWatcher();
	            this.listExpr = '${' + this.listExpr + '}';
	            exprWatcher.addExpr(this.listExpr);

	            this.updateFn = this.createUpdateFn(this.startNode.getNextSibling(), this.endNode.getPreviousSibling());
	        }
	    }, {
	        key: 'linkScope',
	        value: function linkScope() {
	            var _this2 = this;

	            var exprWatcher = this.tree.getExprWatcher();
	            exprWatcher.on('change', function (event) {
	                if (!_this2.isGoDark && event.expr === _this2.listExpr) {
	                    _this2.updateFn(event.newValue);
	                }
	            });
	        }
	    }, {
	        key: 'initRender',
	        value: function initRender() {
	            var exprWatcher = this.tree.getExprWatcher();
	            this.updateFn(exprWatcher.calculate(this.listExpr));
	        }

	        /**
	         * 创建更新函数。
	         * 更新函数会根据迭代的数据动态地创建Tree实例：迭代了多少次，就会创建多少个。
	         * for指令下的Tree实例目前是不会销毁的，除非解析器实例被销毁。
	         * for指令下的Tree实例只会随着迭代次数的增加而增多，并不会消减。
	         *
	         * @private
	         * @param  {nodes/Node} startNode 起始节点
	         * @param  {nodes/Node} endNode   结束节点
	         * @return {function(*,ScopeModel)}           dom更新函数
	         */

	    }, {
	        key: 'createUpdateFn',
	        value: function createUpdateFn(startNode, endNode) {
	            var parser = this;
	            var itemVariableName = this.$$itemVariableName;
	            return function (listObj) {
	                var index = 0;
	                /* eslint-disable guard-for-in */
	                for (var k in listObj) {
	                    /* eslint-enable guard-for-in */
	                    var local = {
	                        key: k,
	                        index: index
	                    };
	                    local[itemVariableName] = listObj[k];

	                    if (!parser.trees[index]) {
	                        parser.trees[index] = parser.createTree();
	                        parser.trees[index].compile();
	                        parser.trees[index].link();
	                        parser.trees[index].initRender();
	                    }

	                    parser.trees[index].restoreFromDark();
	                    parser.trees[index].rootScope.set(local);

	                    ++index;
	                }

	                for (var i = index, il = parser.trees.length; i < il; ++i) {
	                    parser.trees[i].goDark();
	                }
	            };
	        }
	    }, {
	        key: 'goDark',
	        value: function goDark() {
	            if (this.isGoDark) {
	                return;
	            }
	            (0, _utils.forEach)(this.trees, function (tree) {
	                return tree.goDark();
	            });
	            this.isGoDark = true;
	        }
	    }, {
	        key: 'restoreFromDark',
	        value: function restoreFromDark() {
	            if (!this.isGoDark) {
	                return;
	            }
	            (0, _utils.forEach)(this.trees, function (tree) {
	                return tree.restoreFromDark();
	            });
	            this.isGoDark = false;
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            (0, _utils.forEach)(this.trees, function (tree) {
	                return tree.destroy();
	            });

	            this.tplSeg = null;
	            this.expr = null;
	            this.exprFn = null;
	            this.updateFn = null;
	            this.startNode = null;
	            this.endNode = null;

	            _get(Object.getPrototypeOf(ForDirectiveParser.prototype), 'destroy', this).call(this);
	        }

	        /**
	         * 创建树
	         *
	         * @protected
	         * @return {Tree}
	         */

	    }, {
	        key: 'createTree',
	        value: function createTree() {
	            var parser = this;
	            var nodesManager = this.tree.getTreeVar('nodesManager');
	            var copySeg = nodesManager.createDocumentFragment('div');
	            copySeg.setInnerHTML(this.tplSeg.getInnerHTML());

	            var childNodes = copySeg.getChildNodes();
	            var startNode = childNodes[0];
	            var endNode = childNodes[childNodes.length - 1];

	            var curNode = startNode;
	            while (curNode && !curNode.isAfter(endNode)) {
	                var nextNode = curNode.getNextSibling();
	                parser.endNode.getParentNode().insertBefore(curNode, parser.endNode);
	                curNode = nextNode;
	            }

	            var tree = _get(Object.getPrototypeOf(ForDirectiveParser.prototype), 'createTree', this).call(this, this.tree, startNode, endNode);
	            return tree;
	        }

	        // 主要用于遍历的时候，不让遍历器进入子孙节点

	    }, {
	        key: 'getChildNodes',
	        value: function getChildNodes() {
	            return [];
	        }
	    }, {
	        key: 'getEndNode',
	        value: function getEndNode() {
	            return this.endNode;
	        }
	    }, {
	        key: 'getStartNode',
	        value: function getStartNode() {
	            return this.startNode;
	        }
	    }], [{
	        key: 'isProperNode',
	        value: function isProperNode(node, config) {
	            return _DirectiveParser3.default.isProperNode(node, config) && config.forPrefixRegExp.test(node.getNodeValue());
	        }
	    }, {
	        key: 'isEndNode',
	        value: function isEndNode(node, config) {
	            var nodeType = node.getNodeType();
	            return nodeType === _Node2.default.COMMENT_NODE && config.forEndPrefixRegExp.test(node.getNodeValue());
	        }
	    }, {
	        key: 'findEndNode',
	        value: function findEndNode() {
	            return this.walkToEnd.apply(this, arguments);
	        }
	    }, {
	        key: 'getNoEndNodeError',
	        value: function getNoEndNodeError() {
	            return new Error('the `for` directive is not properly ended!');
	        }
	    }]);

	    return ForDirectiveParser;
	}(_DirectiveParser3.default);

	exports.default = ForDirectiveParser;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Parser2 = __webpack_require__(6);

	var _Parser3 = _interopRequireDefault(_Parser2);

	var _Node = __webpack_require__(9);

	var _Node2 = _interopRequireDefault(_Node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 指令解析器抽象类。指令节点一定是注释节点
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var DirectiveParser = function (_Parser) {
	    _inherits(DirectiveParser, _Parser);

	    function DirectiveParser(options) {
	        _classCallCheck(this, DirectiveParser);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DirectiveParser).call(this, options));

	        _this.node = options.node;
	        return _this;
	    }

	    /**
	     * 根据父级数创建子树。
	     *
	     * @protected
	     * @param  {Tree} parentTree 父级树
	     * @param {nodes/Node} startNode 开始节点
	     * @param {nodes/Node} endNode 结束节点
	     * @return {Tree}  创建好的子树
	     */

	    _createClass(DirectiveParser, [{
	        key: 'createTree',
	        value: function createTree(parentTree, startNode, endNode) {
	            var tree = this.tree.createTree({
	                startNode: startNode,
	                endNode: endNode
	            });
	            tree.setParent(parentTree);
	            tree.rootScope.setParent(parentTree.rootScope);
	            parentTree.rootScope.addChild(tree.rootScope);
	            return tree;
	        }
	    }, {
	        key: 'getStartNode',
	        value: function getStartNode() {
	            return this.node;
	        }
	    }, {
	        key: 'getEndNode',
	        value: function getEndNode() {
	            return this.node;
	        }
	    }], [{
	        key: 'isProperNode',
	        value: function isProperNode(node, config) {
	            return node.getNodeType() === _Node2.default.COMMENT_NODE;
	        }
	    }, {
	        key: 'isEndNode',
	        value: function isEndNode() {
	            return true;
	        }

	        /**
	         * 对于分起始部分和结束部分的指令，找到结束部分指令对应的节点。
	         * 仅供内部使用。
	         *
	         * @param {nodes/Node} startNode 开始寻找的节点
	         * @param {Config} config 配置
	         * @return {nodes/Node}
	         */

	    }, {
	        key: 'walkToEnd',
	        value: function walkToEnd(startNode, config) {
	            var curNode = startNode;
	            // 为了应对指令嵌套
	            var stackCounter = 0;
	            while (curNode = curNode.getNextSibling()) {
	                if (this.isProperNode(curNode, config)) {
	                    ++stackCounter;
	                }

	                if (this.isEndNode(curNode, config)) {
	                    if (stackCounter === 0) {
	                        return curNode;
	                    }
	                    --stackCounter;
	                }
	            }
	        }
	    }]);

	    return DirectiveParser;
	}(_Parser3.default);

	exports.default = DirectiveParser;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _DirectiveParser2 = __webpack_require__(25);

	var _DirectiveParser3 = _interopRequireDefault(_DirectiveParser2);

	var _utils = __webpack_require__(4);

	var _Node = __webpack_require__(9);

	var _Node2 = _interopRequireDefault(_Node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file if 指令。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *       在实现中有个纠结点：如果if指令嵌套的话，外层if的branchTree不能直接向下广播change事件，但是branchTree又要能够拿到外层scope的数据。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *       处理方式：
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           renderDom方法用于将scopeModel中的变化反应到DOM中去，如果某个分支处于不该显示的状态，会有一个godark的标记。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var IfDirectiveParser = function (_DirectiveParser) {
	    _inherits(IfDirectiveParser, _DirectiveParser);

	    function IfDirectiveParser(options) {
	        _classCallCheck(this, IfDirectiveParser);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IfDirectiveParser).call(this, options));

	        _this.startNode = options.startNode;
	        _this.endNode = options.endNode;

	        _this.exprs = [];
	        _this.$branchTrees = [];

	        _this.isGoDark = false;
	        return _this;
	    }

	    _createClass(IfDirectiveParser, [{
	        key: 'collectExprs',
	        value: function collectExprs() {
	            var _this2 = this;

	            var branchNodeStack = [];
	            // 这个计数器是用来处理if指令嵌套问题的。
	            // 当nestCounter为0的时候，遇到的各种if相关指令才属于当前parser的，
	            // 否则是嵌套的if指令
	            var nestCounter = 0;
	            var config = this.tree.getTreeVar('config');
	            _Node2.default.iterate(this.startNode, this.endNode, function (node) {
	                var ifNodeType = getIfNodeType(node, _this2.tree.getTreeVar('config'));
	                // if
	                if (ifNodeType === IfDirectiveParser.IF_START) {
	                    // 已经有了一个if分支，再来一个if分支，说明很可能是if嵌套
	                    if (branchNodeStack.length) {
	                        ++nestCounter;
	                        return;
	                    }

	                    branchNodeStack.push({ node: node, type: ifNodeType });
	                }
	                // elif
	                else if (ifNodeType === IfDirectiveParser.ELIF || ifNodeType === IfDirectiveParser.ELSE) {
	                        // 有嵌套，就不管这个分支了
	                        if (nestCounter) {
	                            return;
	                        }

	                        if (!branchNodeStack.length ||
	                        // 前面一个分支既不是`if`，也不是`elif`
	                        branchNodeStack[branchNodeStack.length - 1].type !== IfDirectiveParser.IF_START && branchNodeStack[branchNodeStack.length - 1].type !== IfDirectiveParser.ELIF) {
	                            throw new Error('wrong `if` directive syntax');
	                        }
	                        branchNodeStack.push({ node: node, type: ifNodeType });
	                    }
	                    // /if
	                    else if (ifNodeType === IfDirectiveParser.IF_END) {
	                            // 有嵌套，此时要退出一层嵌套
	                            if (nestCounter) {
	                                --nestCounter;
	                                return;
	                            }

	                            branchNodeStack.push({ node: node, type: ifNodeType });
	                        }

	                // 是 if 节点或者 elif 节点，搜集表达式
	                if (ifNodeType === IfDirectiveParser.IF_START || ifNodeType === IfDirectiveParser.ELIF) {
	                    var expr = '${' + node.getNodeValue().replace(config.getAllIfRegExp(), '') + '}';
	                    expr = expr.replace(/\n/g, ' ');
	                    _this2.exprs.push(expr);

	                    var exprWatcher = _this2.tree.getExprWatcher();
	                    exprWatcher.addExpr(expr);
	                }

	                if (ifNodeType === IfDirectiveParser.ELSE) {
	                    _this2.$$hasElseBranch = true;
	                }
	            });

	            for (var i = 0, il = branchNodeStack.length - 1; i < il; ++i) {
	                var curNode = branchNodeStack[i];
	                var nextNode = branchNodeStack[i + 1];

	                var curNodeNextSibling = curNode.node.getNextSibling();
	                // curNode 和 nextNode 之间没有节点
	                if (curNodeNextSibling.equal(nextNode.node)) {
	                    this.$branchTrees.push(null);
	                } else {
	                    var branchTree = this.tree.createTree({
	                        startNode: curNodeNextSibling,
	                        endNode: nextNode.node.getPreviousSibling()
	                    });
	                    branchTree.setParent(this.tree);

	                    this.$branchTrees.push(branchTree);
	                    branchTree.compile();

	                    this.tree.rootScope.addChild(branchTree.rootScope);
	                    branchTree.rootScope.setParent(this.tree.rootScope);
	                }
	            }
	        }
	    }, {
	        key: 'linkScope',
	        value: function linkScope() {
	            var _this3 = this;

	            var exprWatcher = this.tree.getExprWatcher();

	            for (var i = 0, il = this.$branchTrees.length; i < il; ++i) {
	                this.$branchTrees[i].link();
	            }

	            exprWatcher.on('change', function (event) {
	                if (_this3.isGoDark) {
	                    return;
	                }

	                var hasExpr = false;
	                for (var i = 0, il = _this3.exprs.length; i < il; ++i) {
	                    if (_this3.exprs[i] === event.expr) {
	                        hasExpr = true;
	                        break;
	                    }
	                }

	                if (!hasExpr) {
	                    return;
	                }

	                _this3.renderDOM(_this3);
	            });
	        }
	    }, {
	        key: 'initRender',
	        value: function initRender() {
	            this.renderDOM(this);

	            for (var i = 0, il = this.$branchTrees.length; i < il; ++i) {
	                this.$branchTrees[i].initRender();
	            }
	        }
	    }, {
	        key: 'renderDOM',
	        value: function renderDOM() {
	            if (this.isGoDark) {
	                return;
	            }

	            var exprWatcher = this.tree.getExprWatcher();
	            var exprs = this.exprs;
	            var hasShowBranch = false;
	            var i = 0;
	            for (var il = exprs.length; i < il; ++i) {
	                var expr = exprs[i];
	                var exprValue = exprWatcher.calculate(expr);
	                var branchTree = this.$branchTrees[i];
	                if (exprValue) {
	                    hasShowBranch = true;
	                    branchTree.restoreFromDark();
	                } else {
	                    branchTree.goDark();
	                }
	            }

	            if (this.$$hasElseBranch) {
	                this.$branchTrees[i][hasShowBranch ? 'goDark' : 'restoreFromDark']();
	            }
	        }
	    }, {
	        key: 'getChildNodes',
	        value: function getChildNodes() {
	            return [];
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            for (var i = 0, il = this.$branchTrees.length; i < il; ++i) {
	                var branchTree = this.$branchTrees[i];
	                branchTree.destroy();
	            }

	            this.startNode = null;
	            this.endNode = null;
	            this.exprs = null;
	            this.$branchTrees = null;

	            _get(Object.getPrototypeOf(IfDirectiveParser.prototype), 'destroy', this).call(this);
	        }
	    }, {
	        key: 'getStartNode',
	        value: function getStartNode() {
	            return this.startNode;
	        }
	    }, {
	        key: 'getEndNode',
	        value: function getEndNode() {
	            return this.endNode;
	        }

	        // 转入隐藏状态

	    }, {
	        key: 'goDark',
	        value: function goDark() {
	            if (this.isGoDark) {
	                return;
	            }
	            (0, _utils.forEach)(this.$branchTrees, function (tree) {
	                return tree.goDark();
	            });
	            this.isGoDark = true;
	        }

	        // 从隐藏状态恢复

	    }, {
	        key: 'restoreFromDark',
	        value: function restoreFromDark() {
	            if (!this.isGoDark) {
	                return;
	            }
	            (0, _utils.forEach)(this.$branchTrees, function (tree) {
	                return tree.restoreFromDark();
	            });
	            this.isGoDark = false;

	            this.renderDOM();
	        }
	    }], [{
	        key: 'isProperNode',
	        value: function isProperNode(node, config) {
	            return getIfNodeType(node, config) === IfDirectiveParser.IF_START;
	        }
	    }, {
	        key: 'isEndNode',
	        value: function isEndNode(node, config) {
	            return getIfNodeType(node, config) === IfDirectiveParser.IF_END;
	        }
	    }, {
	        key: 'findEndNode',
	        value: function findEndNode() {
	            return this.walkToEnd.apply(this, arguments);
	        }
	    }, {
	        key: 'getNoEndNodeError',
	        value: function getNoEndNodeError() {
	            return new Error('the if directive is not properly ended!');
	        }
	    }]);

	    return IfDirectiveParser;
	}(_DirectiveParser3.default);

	IfDirectiveParser.IF_START = 1;
	IfDirectiveParser.ELIF = 2;
	IfDirectiveParser.ELSE = 3;
	IfDirectiveParser.IF_END = 4;

	function getIfNodeType(node, config) {
	    var nodeType = node.getNodeType();
	    if (nodeType !== _Node2.default.COMMENT_NODE) {
	        return;
	    }

	    var nodeValue = node.getNodeValue();
	    if (config.ifPrefixRegExp.test(nodeValue)) {
	        return IfDirectiveParser.IF_START;
	    }

	    if (config.elifPrefixRegExp.test(nodeValue)) {
	        return IfDirectiveParser.ELIF;
	    }

	    if (config.elsePrefixRegExp.test(nodeValue)) {
	        return IfDirectiveParser.ELSE;
	    }

	    if (config.ifEndPrefixRegExp.test(nodeValue)) {
	        return IfDirectiveParser.IF_END;
	    }
	}

	exports.default = IfDirectiveParser;

/***/ },
/* 27 */
2,
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _DirectiveParser2 = __webpack_require__(25);

	var _DirectiveParser3 = _interopRequireDefault(_DirectiveParser2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 变量定义指令解析器
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var VarDirectiveParser = function (_DirectiveParser) {
	    _inherits(VarDirectiveParser, _DirectiveParser);

	    function VarDirectiveParser(options) {
	        _classCallCheck(this, VarDirectiveParser);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VarDirectiveParser).call(this, options));

	        _this.node = options.node;
	        _this.updateFn = null;

	        _this.$$expr = null;
	        _this.$$leftValueName = null;
	        return _this;
	    }

	    _createClass(VarDirectiveParser, [{
	        key: 'collectExprs',
	        value: function collectExprs() {
	            var nodeValue = this.node.getNodeValue();

	            this.$$expr = '${' + nodeValue.slice(nodeValue.indexOf('=', 0) + 1) + '}';

	            var exprWatcher = this.tree.getExprWatcher();
	            exprWatcher.addExpr(this.$$expr);

	            try {
	                this.$$leftValueName = nodeValue.match(/var:\s*([\w\$]+)=/)[1];
	            } catch (e) {
	                throw new Error('wrong var expression ' + this.$$leftValueName);
	            }
	        }
	    }, {
	        key: 'linkScope',
	        value: function linkScope() {
	            var _this2 = this;

	            var exprWatcher = this.tree.getExprWatcher();
	            exprWatcher.on('change', function (event) {
	                if (!_this2.isGoDark && event.expr === _this2.$$expr) {
	                    _this2.tree.rootScope.set(_this2.$$leftValueName, exprWatcher.calculate(_this2.$$expr));
	                }
	            });
	        }
	    }, {
	        key: 'initRender',
	        value: function initRender() {
	            var exprWatcher = this.tree.getExprWatcher();
	            this.tree.rootScope.set(this.$$leftValueName, exprWatcher.calculate(this.$$expr));
	        }

	        /**
	         * 获取开始节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */

	    }, {
	        key: 'getStartNode',
	        value: function getStartNode() {
	            return this.node;
	        }

	        /**
	         * 获取结束节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */

	    }, {
	        key: 'getEndNode',
	        value: function getEndNode() {
	            return this.node;
	        }
	    }, {
	        key: 'goDark',
	        value: function goDark() {
	            this.isGoDark = true;
	        }
	    }, {
	        key: 'restoreFromDark',
	        value: function restoreFromDark() {
	            this.isGoDark = false;
	        }
	    }], [{
	        key: 'isProperNode',
	        value: function isProperNode(node, config) {
	            var nodeValue = node.getNodeValue();
	            return _DirectiveParser3.default.isProperNode(node) && nodeValue.replace(/^\s+/, '').indexOf(config.varName + ':') === 0;
	        }
	    }]);

	    return VarDirectiveParser;
	}(_DirectiveParser3.default);

	exports.default = VarDirectiveParser;

/***/ },
/* 29 */
18,
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 表达式计算器
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utils = __webpack_require__(4);

	var _log = __webpack_require__(31);

	var _log2 = _interopRequireDefault(_log);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ExprCalculater = function () {
	    function ExprCalculater() {
	        _classCallCheck(this, ExprCalculater);

	        this.fns = {};

	        this.exprNameMap = {};
	        this.exprNameRegExp = /\.?\$?([a-z|A-Z]+|([a-z|A-Z]+[0-9]+[a-z|A-Z]*))/g;
	    }

	    /**
	     * 创建表达式计算函数
	     *
	     * @public
	     * @param  {string} expr        纯正的表达式字符串。`---${name}---`就不是纯正的，而`name`就算是纯正的。
	     * @param  {boolean} avoidReturn 最后生成的表达式计算函数是否需要返回值
	     * @return {Object}             返回生成的表达式计算对象。
	     */

	    _createClass(ExprCalculater, [{
	        key: 'createExprFn',
	        value: function createExprFn(expr, avoidReturn) {
	            if (expr === 'klass') {
	                throw new Error('`klass` is the preserved word for `class`');
	            }
	            // 对expr='class'进行下转换
	            if (expr === 'class') {
	                expr = 'klass';
	            }

	            avoidReturn = !!avoidReturn;
	            this.fns[expr] = this.fns[expr] || {};
	            if (this.fns[expr][avoidReturn]) {
	                return this.fns[expr][avoidReturn];
	            }

	            var params = getVariableNamesFromExpr(this, expr);
	            var fn = new Function(params, (avoidReturn ? '' : 'return ') + expr);

	            var exprObj = {
	                paramNames: params,
	                fn: fn
	            };
	            this.fns[expr][avoidReturn] = exprObj;
	            return exprObj;
	        }
	    }, {
	        key: 'calculate',
	        value: function calculate(expr, avoidReturn, scopeModel) {
	            // 对expr='class'进行下转换
	            if (expr === 'class') {
	                expr = 'klass';
	            }

	            var fnObj = this.fns[expr][avoidReturn];
	            if (!fnObj) {
	                throw new Error('no such expression function created!');
	            }

	            var fnArgs = [];
	            for (var i = 0, il = fnObj.paramNames.length; i < il; i++) {
	                var param = fnObj.paramNames[i];
	                var value = scopeModel.get(param);
	                fnArgs.push(value === undefined ? '' : value);
	            }

	            var result = undefined;
	            try {
	                result = fnObj.fn.apply(null, fnArgs);
	            } catch (e) {
	                // 将表达式的错误打印出来，方便调试
	                _log2.default.info(e.stack, '\n', expr, scopeModel);
	                result = '';
	            }
	            return result;
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.fns = null;
	            this.exprNameMap = null;
	            this.exprNameRegExp = null;
	        }
	    }]);

	    return ExprCalculater;
	}();

	/**
	 * 从表达式中抽离出变量名
	 *
	 * @inner
	 * @param {ExprCalculater} me 对应实例
	 * @param  {string} expr 表达式字符串，类似于 `${name}` 中的 name
	 * @return {Array.<string>}      变量名数组
	 */

	exports.default = ExprCalculater;
	function getVariableNamesFromExpr(me, expr) {
	    if (me.exprNameMap[expr]) {
	        return me.exprNameMap[expr];
	    }

	    var reg = /[\$|_|a-z|A-Z]{1}(?:[a-z|A-Z|0-9|\$|_]*)/g;

	    var names = {};
	    for (var name = reg.exec(expr); name; name = reg.exec(expr)) {
	        var restStr = expr.slice(name.index + name[0].length);

	        // 是左值
	        if (/^\s*=(?!=)/.test(restStr)) {
	            continue;
	        }

	        // 变量名前面是否存在 `.` ，或者变量名是否位于引号内部
	        if (name.index && (expr[name.index - 1] === '.' || isInQuote(expr.slice(0, name.index), restStr))) {
	            continue;
	        }

	        names[name[0]] = true;
	    }

	    var ret = [];
	    (0, _utils.each)(names, function (isOk, name) {
	        if (isOk) {
	            ret.push(name);
	        }
	    });
	    me.exprNameMap[expr] = ret;

	    return ret;

	    function isInQuote(preStr, restStr) {
	        return preStr.lastIndexOf('\'') + 1 && restStr.indexOf('\'') + 1 || preStr.lastIndexOf('"') + 1 && restStr.indexOf('"') + 1;
	    }
	}

/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @file 日志打印输出，方便debug
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */

	/* eslint-disable no-console */
	exports.default = {
	    error: function error() {
	        if (!console || !console.error) {
	            return;
	        }

	        console.error.apply(console, arguments);
	    },
	    warn: function warn() {
	        if (!console || !console.warn) {
	            return;
	        }

	        console.warn.apply(console, arguments);
	    },
	    info: function info() {
	        if (!console || !console.info) {
	            return;
	        }

	        console.info.apply(console, arguments);
	    }
	};
	/* eslint-enable no-console */

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file DOM 更新器
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utils = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DomUpdater = function () {
	    function DomUpdater() {
	        _classCallCheck(this, DomUpdater);

	        this.tasks = {};
	        this.isExecuting = false;
	        this.doneFns = [];
	        this.counter = 0;

	        this.$$nodeAttrNameTaskIdMap = {};

	        this.$$isExecuting = false;
	    }

	    /**
	     * 生成任务ID。
	     * 为啥会有任务ID呢？
	     * 因为此处存在这样一种策略：
	     * 如果两个任务的ID是一样的，那么认为是同一个性质的任务，后面的任务将会覆盖掉前面的任务。
	     *
	     * 比如，在设置DOM元素节点的title属性的时候，第一次设置为`zhangsan`，第二次设置为`lisi`，
	     * 如果这两次设置操作是在某一次批量操作中进行的，那么第一次设置完全可以抛弃，直接将title设置为`lisi`。
	     *
	     * @public
	     * @return {number} 任务ID号
	     */

	    _createClass(DomUpdater, [{
	        key: 'generateTaskId',
	        value: function generateTaskId() {
	            return this.counter++;
	        }

	        /**
	         * 对于DOM元素的属性更新，提供一种更方便的获取任务ID的方法
	         *
	         * @public
	         * @param  {vtpl/src/nodes/Node} node     节点对象
	         * @param  {string} attrName 要设置的属性名称
	         * @return {number}          任务ID
	         */

	    }, {
	        key: 'generateNodeAttrUpdateId',
	        value: function generateNodeAttrUpdateId(node, attrName) {
	            var key = node.getNodeId() + '-' + attrName;
	            if (!this.$$nodeAttrNameTaskIdMap[key]) {
	                this.$$nodeAttrNameTaskIdMap[key] = this.generateTaskId();
	            }

	            return this.$$nodeAttrNameTaskIdMap[key];
	        }

	        /**
	         * 将任务添加至队列，等待执行。理论上来说，任务函数里面不能存在异步操作。
	         * 注意：此处callback并不一定会调用到，因为当前设置的任务可能被后续任务覆盖掉而得不到执行的机会。
	         *
	         * @public
	         * @param {number} taskId 任务ID
	         * @param {function()} taskFn 任务函数
	         * @param {function(Error, *)} callback 执行结果的回调函数
	         */

	    }, {
	        key: 'addTaskFn',
	        value: function addTaskFn(taskId, taskFn, callback) {
	            this.tasks[taskId] = {
	                fn: taskFn,
	                notifyFn: callback || _utils.empty
	            };
	        }

	        /**
	         * 销毁
	         *
	         * @public
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.stop();
	            this.tasks = null;
	        }

	        /**
	         * 停止执行任务
	         *
	         * @public
	         */

	    }, {
	        key: 'stop',
	        value: function stop() {
	            this.$$isExecuting = false;
	        }

	        /**
	         * 开始监控并执行任务队列中的任务
	         *
	         * @public
	         */

	    }, {
	        key: 'start',
	        value: function start() {
	            if (this.$$isExecuting) {
	                return;
	            }

	            this.$$isExecuting = true;
	            execute.call(this);

	            function execute() {
	                var _this = this;

	                requestAnimationFrame(function () {
	                    if (!_this.$$isExecuting) {
	                        return;
	                    }

	                    /* eslint-disable guard-for-in */
	                    for (var taskId in _this.tasks) {
	                        /* eslint-enable guard-for-in */
	                        var task = _this.tasks[taskId];
	                        if (!task) {
	                            continue;
	                        }

	                        try {
	                            task.notifyFn(null, task.fn());
	                        } catch (error) {
	                            task.notifyFn(error);
	                        }
	                        if (_this.tasks) {
	                            _this.tasks[taskId] = null;
	                        }
	                    }
	                    execute.call(_this);
	                });
	            }
	        }
	    }]);

	    return DomUpdater;
	}();

	exports.default = DomUpdater;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 配置
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utils = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Config = function () {
	    function Config() {
	        _classCallCheck(this, Config);

	        this.exprPrefix = '${';
	        this.exprSuffix = '}';

	        this.ifName = 'if';
	        this.elifName = 'elif';
	        this.elseName = 'else';
	        this.ifEndName = '/if';

	        this.ifPrefixRegExp = /^\s*if:\s*/;
	        this.elifPrefixRegExp = /^\s*elif:\s*/;
	        this.elsePrefixRegExp = /^\s*else\s*/;
	        this.ifEndPrefixRegExp = /^\s*\/if\s*/;

	        this.forName = 'for';
	        this.forEndName = '/for';

	        this.forPrefixRegExp = /^\s*for:\s*/;
	        this.forEndPrefixRegExp = /^\s*\/for\s*/;

	        this.eventPrefix = 'event';

	        this.varName = 'var';

	        this.scopeName = 'scope';
	        this.scopeEndName = '/scope';
	    }

	    _createClass(Config, [{
	        key: 'setExprPrefix',
	        value: function setExprPrefix(prefix) {
	            this.exprPrefix = prefix;
	        }
	    }, {
	        key: 'setExprSuffix',
	        value: function setExprSuffix(suffix) {
	            this.exprSuffix = suffix;
	        }
	    }, {
	        key: 'getExprRegExp',
	        value: function getExprRegExp() {
	            if (!this.exprRegExp) {
	                this.exprRegExp = new RegExp((0, _utils.regExpEncode)(this.exprPrefix) + '(.+?)' + (0, _utils.regExpEncode)(this.exprSuffix), 'g');
	            }
	            this.exprRegExp.lastIndex = 0;
	            return this.exprRegExp;
	        }
	    }, {
	        key: 'getAllIfRegExp',
	        value: function getAllIfRegExp() {
	            if (!this.allIfRegExp) {
	                this.allIfRegExp = new RegExp('\\s*(' + this.ifName + '|' + this.elifName + '|' + this.elseName + '|' + this.ifEndName + '):\\s*', 'g');
	            }
	            this.allIfRegExp.lastIndex = 0;
	            return this.allIfRegExp;
	        }
	    }, {
	        key: 'setIfName',
	        value: function setIfName(ifName) {
	            this.ifName = ifName;
	            this.ifPrefixRegExp = new RegExp('^\\s*' + ifName + ':\\s*');
	        }
	    }, {
	        key: 'setElifName',
	        value: function setElifName(elifName) {
	            this.elifName = elifName;
	            this.elifPrefixRegExp = new RegExp('^\\s*' + elifName + ':\\s*');
	        }
	    }, {
	        key: 'setElseName',
	        value: function setElseName(elseName) {
	            this.elseName = elseName;
	            this.elsePrefixRegExp = new RegExp('^\\s*' + elseName + '\\s*');
	        }
	    }, {
	        key: 'setIfEndName',
	        value: function setIfEndName(ifEndName) {
	            this.ifEndName = ifEndName;
	            this.ifEndPrefixRegExp = new RegExp('^\\s*' + ifEndName + '\\s*');
	        }
	    }, {
	        key: 'setForName',
	        value: function setForName(forName) {
	            this.forName = forName;
	            this.forPrefixRegExp = new RegExp('^\\s*' + forName + ':\\s*');
	        }
	    }, {
	        key: 'setForEndName',
	        value: function setForEndName(forEndName) {
	            this.forEndName = forEndName;
	            this.forEndPrefixRegExp = new RegExp('^\\s*' + forEndName + '\\s*');
	        }
	    }, {
	        key: 'getForExprsRegExp',
	        value: function getForExprsRegExp() {
	            if (!this.forExprsRegExp) {
	                this.forExprsRegExp = new RegExp('\\s*' + this.forName + ':\\s*' + (0, _utils.regExpEncode)(this.exprPrefix) + '([^' + (0, _utils.regExpEncode)(this.exprSuffix) + ']+)' + (0, _utils.regExpEncode)(this.exprSuffix));
	            }
	            this.forExprsRegExp.lastIndex = 0;
	            return this.forExprsRegExp;
	        }
	    }, {
	        key: 'getForItemValueNameRegExp',
	        value: function getForItemValueNameRegExp() {
	            if (!this.forItemValueNameRegExp) {
	                this.forItemValueNameRegExp = new RegExp('as\\s*' + (0, _utils.regExpEncode)(this.exprPrefix) + '([^' + (0, _utils.regExpEncode)(this.exprSuffix) + ']+)' + (0, _utils.regExpEncode)(this.exprSuffix));
	            }
	            this.forItemValueNameRegExp.lastIndex = 0;
	            return this.forItemValueNameRegExp;
	        }
	    }, {
	        key: 'setEventPrefix',
	        value: function setEventPrefix(prefix) {
	            this.eventPrefix = prefix;
	        }
	    }, {
	        key: 'setVarName',
	        value: function setVarName(name) {
	            this.varName = name;
	        }
	    }]);

	    return Config;
	}();

	exports.default = Config;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Base2 = __webpack_require__(7);

	var _Base3 = _interopRequireDefault(_Base2);

	var _Node = __webpack_require__(9);

	var _Node2 = _interopRequireDefault(_Node);

	var _Fragment = __webpack_require__(35);

	var _Fragment2 = _interopRequireDefault(_Fragment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 管理节点的工具
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var managerIdCounter = 0;

	var NodesManager = function (_Base) {
	    _inherits(NodesManager, _Base);

	    function NodesManager() {
	        _classCallCheck(this, NodesManager);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NodesManager).call(this));

	        _this.$idCounter = 0;
	        _this.$nodesMap = {};
	        _this.$$domNodeIdKey = 'nodeId-' + ++managerIdCounter;
	        return _this;
	    }

	    /**
	     * 根据 domNode 拿到对应的经过包装的 nodes/Node 实例
	     *
	     * @public
	     * @param  {Node|Undefined}  domNode dom节点
	     * @return {nodes/Node}      nodes/Node 实例
	     */

	    _createClass(NodesManager, [{
	        key: 'getNode',
	        value: function getNode(domNode) {
	            if (!domNode) {
	                return null;
	            }

	            var nodeId = domNode[this.$$domNodeIdKey];

	            if (!nodeId) {
	                nodeId = domNode[this.$$domNodeIdKey] = ++this.$idCounter;
	            }

	            if (!this.$nodesMap[nodeId]) {
	                this.$nodesMap[nodeId] = new _Node2.default(domNode, this);
	            }

	            return this.$nodesMap[nodeId];
	        }

	        /**
	         * 销毁所有的节点
	         *
	         * @public
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            /* eslint-disable guard-for-in */
	            for (var id in this.$nodesMap) {
	                this.$nodesMap[id].destroy();
	            }
	            /* eslint-enable guard-for-in */
	        }
	    }, {
	        key: 'createElement',
	        value: function createElement() {
	            return this.getNode(document.createElement.apply(document, arguments));
	        }
	    }, {
	        key: 'createComment',
	        value: function createComment() {
	            return this.getNode(document.createComment.apply(document, arguments));
	        }
	    }, {
	        key: 'createDocumentFragment',
	        value: function createDocumentFragment() {
	            return new _Fragment2.default(this);
	        }
	    }]);

	    return NodesManager;
	}(_Base3.default);

	exports.default = NodesManager;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file dom fragment的封装
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Node = __webpack_require__(9);

	var _Node2 = _interopRequireDefault(_Node);

	var _log = __webpack_require__(31);

	var _log2 = _interopRequireDefault(_log);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Fragment = function () {
	    function Fragment(manager) {
	        _classCallCheck(this, Fragment);

	        this.$$manager = manager;
	        this.$$fragment = this.$$manager.createElement('div');
	    }

	    _createClass(Fragment, [{
	        key: 'appendChild',
	        value: function appendChild(node) {
	            this.$$fragment.appendChild(node);
	        }
	    }, {
	        key: 'getChildNodes',
	        value: function getChildNodes() {
	            return this.$$fragment.getChildNodes();
	        }
	    }, {
	        key: 'getFirstChild',
	        value: function getFirstChild() {
	            return this.$$fragment.getFirstChild();
	        }
	    }, {
	        key: 'getLastChild',
	        value: function getLastChild() {
	            return this.$$fragment.getLastChild();
	        }
	    }, {
	        key: 'setInnerHTML',
	        value: function setInnerHTML(html) {
	            var xmlDoc = undefined;
	            if (window.DOMParser) {
	                var parser = new DOMParser();
	                xmlDoc = parser.parseFromString('<div></div>', 'text/xml');
	            }
	            // Internet Explorer
	            else {
	                    xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
	                    xmlDoc.async = false;
	                    xmlDoc.loadXML('<div></div>');
	                }

	            try {
	                xmlDoc.childNodes[0].innerHTML = html;
	            } catch (error) {
	                _log2.default.error(error, '\n' + html);
	                throw error;
	            }

	            this.$$fragment.setInnerHTML('');
	            walk.call(this, xmlDoc.childNodes[0], this.$$fragment);

	            function createDOMNode(parserNode) {
	                var nodeType = parserNode.nodeType;
	                if (nodeType === _Node2.default.ELEMENT_NODE) {
	                    var node = document.createElement(parserNode.tagName);
	                    var attributes = parserNode.attributes;
	                    for (var i = 0, il = attributes.length; i < il; ++i) {
	                        var attr = attributes[i];
	                        node.setAttribute(attr.name, attr.value);
	                    }
	                    return this.$$manager.getNode(node);
	                }

	                if (nodeType === _Node2.default.TEXT_NODE) {
	                    var node = document.createTextNode(parserNode.nodeValue);
	                    return this.$$manager.getNode(node);
	                }

	                if (nodeType === _Node2.default.COMMENT_NODE) {
	                    var node = document.createComment(parserNode.nodeValue);
	                    return this.$$manager.getNode(node);
	                }

	                throw new Error('unknown node type: ' + nodeType);
	            }

	            function walk(rootParserNode, rootDOMNode) {
	                var childNodes = rootParserNode.childNodes;
	                for (var i = 0, il = childNodes.length; i < il; ++i) {
	                    var curDOMNode = createDOMNode.call(this, childNodes[i]);
	                    rootDOMNode.appendChild(curDOMNode);
	                    walk.call(this, childNodes[i], curDOMNode);
	                }
	            }
	        }
	    }, {
	        key: 'getInnerHTML',
	        value: function getInnerHTML() {
	            return this.$$fragment.getInnerHTML();
	        }
	    }]);

	    return Fragment;
	}();

	exports.default = Fragment;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 组件基类。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *       以`ui-`开头的标签都是组件标签。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *       组件的生命周期状态（$$state）在ComponentParser中维护
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _componentState = __webpack_require__(14);

	var _componentState2 = _interopRequireDefault(_componentState);

	var _log = __webpack_require__(37);

	var _log2 = _interopRequireDefault(_log);

	var _utils = __webpack_require__(10);

	var _deepEqual = __webpack_require__(38);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _clone = __webpack_require__(39);

	var _clone2 = _interopRequireDefault(_clone);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Component = function () {
	    function Component() {
	        _classCallCheck(this, Component);

	        this.refs = {};

	        // 在parser里面维护
	        this.$$state = null;
	        // 在parser里面设置
	        this.$$scopeModel = null;

	        this.state = {};
	        this.props = {};
	    }

	    _createClass(Component, [{
	        key: 'getTemplate',
	        value: function getTemplate() {
	            return '';
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {}
	    }, {
	        key: 'shouldUpdate',
	        value: function shouldUpdate(expr, exprValue, exprOldValue) {
	            // 默认深比较
	            return (0, _deepEqual2.default)(exprOldValue, exprValue);
	        }
	    }, {
	        key: 'cloneExpressionObject',
	        value: function cloneExpressionObject(expr, expressionObject) {
	            return (0, _clone2.default)(expressionObject);
	        }
	    }, {
	        key: 'propsChange',
	        value: function propsChange() {}
	    }, {
	        key: 'ready',
	        value: function ready() {}
	    }, {
	        key: 'getComponentClasses',
	        value: function getComponentClasses() {}
	    }, {
	        key: 'setState',
	        value: function setState() {
	            if (this.$$state !== _componentState2.default.READY) {
	                return _log2.default.warn('don\'t set state data when the component \'s state is not `READY`');
	            }

	            var state = this.$$scopeModel.get('state');
	            set.apply(undefined, arguments);
	            this.$$scopeModel.set({ state: state });

	            function set(name, value) {
	                if ((0, _utils.isClass)(name, 'String')) {
	                    state[name] = value;
	                } else if ((0, _utils.type)(name) === 'object') {
	                    for (var key in name) {
	                        if (!name.hasOwnProperty(key)) {
	                            continue;
	                        }

	                        state[key] = name[key];
	                    }
	                }
	            }
	        }
	    }], [{
	        key: 'getStyle',
	        value: function getStyle() {
	            return '';
	        }
	    }]);

	    return Component;
	}();

	exports.default = Component;

/***/ },
/* 37 */
31,
/* 38 */
22,
/* 39 */
20
/******/ ])))});;