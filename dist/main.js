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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file vcomponent主文件
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author  yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _ComponentParser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./ComponentParser\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _ComponentParser2 = _interopRequireDefault(_ComponentParser);

	var _ExprParserEnhance = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./ExprParserEnhance\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _ExprParserEnhance2 = _interopRequireDefault(_ExprParserEnhance);

	var _ComponentManager = __webpack_require__(3);

	var _ComponentManager2 = _interopRequireDefault(_ComponentManager);

	var _vtpl2 = __webpack_require__(7);

	var _vtpl3 = _interopRequireDefault(_vtpl2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * VComponent
	 *
	 * @class
	 */

	var VComponent = function () {

	  /**
	   * 构造函数
	   *
	   * @public
	   * @param  {Object} options 参数
	   */

	  function VComponent(options) {
	    _classCallCheck(this, VComponent);

	    /**
	     * @protected
	     */
	    this.vtpl = new _vtpl3.default(options);

	    this.vtpl.registerParser(_ExprParserEnhance2.default);
	    this.vtpl.registerParser(_ComponentParser2.default);

	    this.vtpl.tree.setTreeVar('componentManager', new _ComponentManager2.default());
	    this.vtpl.tree.setTreeVar('children', {});
	  }

	  /**
	   * 渲染
	   *
	   * @public
	   * @param  {Function} done 渲染完成之后的回调
	   */


	  _createClass(VComponent, [{
	    key: 'render',
	    value: function render(done) {
	      this.vtpl.render(done);
	    }

	    /**
	     * 设置数据
	     *
	     * @public
	     * @param {...[*]} args 数据
	     */

	  }, {
	    key: 'setData',
	    value: function setData() {
	      var _vtpl;

	      (_vtpl = this.vtpl).setData.apply(_vtpl, arguments);
	    }

	    /**
	     * 获取数据
	     *
	     * @public
	     * @param  {...*} args 参数
	     * @return {*}
	     */

	  }, {
	    key: 'getData',
	    value: function getData() {
	      var scope = this.vtpl.tree.rootScope;
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
	      var componentManager = this.vtpl.tree.getTreeVar('componentManager');
	      componentManager.register(componentClasses);
	    }

	    /**
	     * 销毁
	     *
	     * @public
	     */

	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      var componentManager = this.vtpl.tree.getTreeVar('componentManager');
	      componentManager.destroy();

	      this.vtpl.destroy();
	    }

	    /**
	     * 根据ref获取组件
	     *
	     * @public
	     * @param  {string} name ref名字
	     * @return {Component}
	     */

	  }, {
	    key: 'ref',
	    value: function ref(name) {
	      var children = this.vtpl.tree.getTreeVar('children') || {};
	      return children[name];
	    }
	  }]);

	  return VComponent;
	}();

	exports.default = VComponent;

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 组件管理。ComponentManager也是有层级关系的，
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *       Tree下面的ComponentManager注册这个Tree实例用到的Component，
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *       而在Component中也可以注册此Component的tpl中将会使用到的Component。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _utils = __webpack_require__(4);

	var _Component = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * ComponentManager
	 *
	 * @class
	 */

	var ComponentManager = function () {

	    /**
	     * constructor
	     *
	     * @public
	     */

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
	                var name = (0, _Component.getType)(ComponentClass);
	                this.components[name] = ComponentClass;
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
	         * 销毁
	         *
	         * @public
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.components = null;
	        }
	    }]);

	    return ComponentManager;
	}();

	exports.default = ComponentManager;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"vtpl/utils\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	Object.keys(_utils).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _utils[key];
	    }
	  });
	});
	exports.getSuper = getSuper;
	function getSuper(cls) {
	  return Object.getPrototypeOf(cls.prototype).constructor;
	} /**
	   * @file 扩展一下`vtpl/src/utils`
	   * @author yibuyisheng(yibuyisheng@163.com)
	   */

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 组件基类。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *       以`ui-`开头的标签都是组件标签。
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *       组件的生命周期状态（$$state）在ComponentParser中维护
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	exports.type = type;
	exports.getType = getType;

	var _componentState = __webpack_require__(6);

	var _componentState2 = _interopRequireDefault(_componentState);

	var _log = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"vtpl/log\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _log2 = _interopRequireDefault(_log);

	var _utils = __webpack_require__(4);

	var _deepEqual = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"vtpl/deepEqual\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _clone = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"vtpl/clone\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _clone2 = _interopRequireDefault(_clone);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TYPE_KEY = Symbol('type');

	function type(typeStr) {
	  return function (target) {
	    target[TYPE_KEY] = typeStr;
	  };
	}

	function getType(componentClass) {
	  return componentClass[TYPE_KEY] || componentClass.name;
	}

	/**
	 * Component
	 *
	 * @class
	 */

	var Component = function () {

	  /**
	   * 构造函数
	   *
	   * @public
	   */

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

	  /**
	   * 组件模板字符串
	   *
	   * @public
	   * @return {string} 模板字符串
	   */


	  _createClass(Component, [{
	    key: 'getTemplate',
	    value: function getTemplate() {
	      return '';
	    }

	    /**
	     * 销毁组件
	     *
	     * @public
	     */

	  }, {
	    key: 'destroy',
	    value: function destroy() {}

	    /**
	     * 是否应该更新DOM
	     *
	     * @public
	     * @param  {string} expr         表达式
	     * @param  {*} exprValue    新的表达式值
	     * @param  {*} exprOldValue 老的表达式值
	     * @return {boolean}
	     */

	  }, {
	    key: 'shouldUpdate',
	    value: function shouldUpdate(expr, exprValue, exprOldValue) {
	      // 默认深比较
	      return (0, _deepEqual2.default)(exprOldValue, exprValue);
	    }

	    /**
	     * 克隆表达式计算出来的数据。
	     * 子类可以覆盖这个方法，提供自定义的、更高效的克隆方式。
	     *
	     * @public
	     * @param  {string} expr             表达式
	     * @param  {*} expressionObject 表达式计算出来的数据
	     * @return {*}
	     */

	  }, {
	    key: 'cloneExpressionObject',
	    value: function cloneExpressionObject(expr, expressionObject) {
	      return (0, _clone2.default)(expressionObject);
	    }

	    /**
	     * 组件初始化数据都进来了，尚未挂载到DOM树上
	     *
	     * @public
	     * @deprecated
	     */

	  }, {
	    key: 'ready',
	    value: function ready() {}

	    /**
	     * 组件初始化数据都进来了，尚未挂载到DOM树上
	     *
	     * @public
	     */

	  }, {
	    key: 'init',
	    value: function init() {
	      this.ready();
	    }

	    /**
	     * 初始化完成后，挂载到了DOM树上
	     *
	     * @public
	     * @deprecated
	     */

	  }, {
	    key: 'initMounted',
	    value: function initMounted() {}

	    /**
	     * props发生了变化，注意：此处还未将props更新到DOM上去
	     *
	     * @public
	     * @param {Object} changedProps 发生改变的props
	     */

	  }, {
	    key: 'propsChange',
	    value: function propsChange(changedProps) {}

	    /**
	     * props的改变已经体现到了DOM树上
	     *
	     * @public
	     * @param {Object} changedProps 发生改变的props
	     */

	  }, {
	    key: 'propsChangeMounted',
	    value: function propsChangeMounted(changedProps) {}

	    /**
	     * 拿到本组件内部使用到的组件类，是一种配置。
	     *
	     * @public
	     * @return {Array.<Component>} 组件类数组
	     */

	  }, {
	    key: 'getComponentClasses',
	    value: function getComponentClasses() {
	      return [];
	    }

	    /**
	     * 设置state值
	     *
	     * @protected
	     * @param {string|Object} name    字符串或者对象
	     * @param {*} value   要设置的值
	     * @param {Object=} options 配置参数
	     */

	  }, {
	    key: 'setState',
	    value: function setState(name, value) {
	      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	      if (this.$$state !== _componentState2.default.READY) {
	        _log2.default.warn('don\'t set state data when the component\'s state is not `READY`');
	        return;
	      }

	      var state = this.$$scopeModel.get('state');
	      if ((0, _utils.isClass)(name, 'String')) {
	        state[name] = value;
	        this.$$scopeModel.set({ state: state }, options.isSilent, options.done);
	      } else if (name && (0, _utils.isClass)(name, 'Object')) {
	        /* eslint-disable guard-for-in,fecs-use-for-of */
	        for (var key in name) {
	          state[key] = name[key];
	        }
	        /* eslint-enable guard-for-in,fecs-use-for-of */
	        this.$$scopeModel.set({ state: state }, options.isSilent, options.done);
	      }
	    }

	    /**
	     * 组件被隐藏了,很可能DOM元素脱离了DOM树
	     *
	     * @public
	     */

	  }, {
	    key: 'beforeHide',
	    value: function beforeHide() {}

	    /**
	     * 组件显示出来了,DOM元素回到了DOM树中
	     *
	     * @public
	     */

	  }, {
	    key: 'afterShow',
	    value: function afterShow() {}

	    /**
	     * 获取用于检查传入的props数据合法性的函数
	     *
	     * @static
	     * @public
	     * @return {Object}
	     */

	  }], [{
	    key: 'getPropsCheckFns',
	    value: function getPropsCheckFns() {
	      return {};
	    }

	    /**
	     * 获取组件样式
	     *
	     * @static
	     * @public
	     * @return {string} 样式
	     */

	  }, {
	    key: 'getStyle',
	    value: function getStyle() {
	      return '';
	    }
	  }]);

	  return Component;
	}();

	exports.default = Component;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @file 组件状态枚举
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */

	exports.default = {
	    INITIALIZING: Symbol('initializing'),
	    READY: Symbol('ready'),
	    DESTROIED: Symbol('destroied'),
	    BEFORE_RENDER: Symbol('beforeRender')
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file vtpl主文件
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author yibuyisheng(yibuyisheng@163.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _ForDirectiveParser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./parsers/ForDirectiveParser\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _ForDirectiveParser2 = _interopRequireDefault(_ForDirectiveParser);

	var _IfDirectiveParser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./parsers/IfDirectiveParser\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _IfDirectiveParser2 = _interopRequireDefault(_IfDirectiveParser);

	var _DirectiveParser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./parsers/DirectiveParser\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _DirectiveParser2 = _interopRequireDefault(_DirectiveParser);

	var _ExprParser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./parsers/ExprParser\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _ExprParser2 = _interopRequireDefault(_ExprParser);

	var _VarDirectiveParser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./parsers/VarDirectiveParser\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _VarDirectiveParser2 = _interopRequireDefault(_VarDirectiveParser);

	var _HTMLExprParser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./parsers/HTMLExprParser\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _HTMLExprParser2 = _interopRequireDefault(_HTMLExprParser);

	var _Tree = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./trees/Tree\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _Tree2 = _interopRequireDefault(_Tree);

	var _ExprCalculater = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./ExprCalculater\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _ExprCalculater2 = _interopRequireDefault(_ExprCalculater);

	var _DomUpdater = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./DomUpdater\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _DomUpdater2 = _interopRequireDefault(_DomUpdater);

	var _utils = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./utils\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _NodesManager = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./nodes/NodesManager\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _NodesManager2 = _interopRequireDefault(_NodesManager);

	var _Parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./parsers/Parser\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _Parser2 = _interopRequireDefault(_Parser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TREE = Symbol('tree');

	/**
	 * VTpl
	 *
	 * @class
	 */

	var VTpl = function () {

	    /**
	     * constructor
	     *
	     * @public
	     * @param  {Object} options 参数
	     */

	    function VTpl(options) {
	        _classCallCheck(this, VTpl);

	        options = (0, _utils.extend)({}, options);

	        var nodesManager = new _NodesManager2.default();
	        if (options.startNode) {
	            options.startNode = nodesManager.getNode(options.startNode);
	        }
	        if (options.endNode) {
	            options.endNode = nodesManager.getNode(options.endNode);
	        }
	        if (options.node) {
	            options.node = nodesManager.getNode(options.node);
	        }

	        var tree = new _Tree2.default(options);
	        tree.setTreeVar('exprCalculater', new _ExprCalculater2.default());
	        tree.setTreeVar('domUpdater', new _DomUpdater2.default());
	        tree.setTreeVar('nodesManager', nodesManager);

	        tree.setTreeVar('parserClasses', []);

	        this[TREE] = tree;

	        // 注册一批解析器
	        this.registerParser(_ForDirectiveParser2.default);
	        this.registerParser(_IfDirectiveParser2.default);
	        this.registerParser(_DirectiveParser2.default);
	        this.registerParser(_ExprParser2.default);
	        this.registerParser(_VarDirectiveParser2.default);
	        this.registerParser(_HTMLExprParser2.default);
	    }

	    /**
	     * 获取节点管理器
	     *
	     * @public
	     * @return {NodesManager}
	     */


	    _createClass(VTpl, [{
	        key: 'setExprEqualFn',


	        /**
	         * 设置表达式相等判断函数
	         *
	         * @public
	         * @param {string} expr    表达式
	         * @param {Function} handler 相等比较函数
	         */
	        value: function setExprEqualFn(expr, handler) {
	            var exprWatcher = this[TREE].getExprWatcher();
	            exprWatcher.setExprEqualFn(expr, handler);
	        }

	        /**
	         * 设置表达式值克隆函数
	         *
	         * @public
	         * @param {string} expr    表达式
	         * @param {Function} handler 克隆函数
	         */

	    }, {
	        key: 'setExprCloneFn',
	        value: function setExprCloneFn(expr, handler) {
	            var exprWatcher = this[TREE].getExprWatcher();
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
	         * @public
	         * @param  {Class} parserClass 解析器类
	         */

	    }, {
	        key: 'registerParser',
	        value: function registerParser(parserClass) {
	            if (!(0, _utils.isSubClassOf)(parserClass, _Parser2.default)) {
	                throw new TypeError('wrong parser class');
	            }

	            var parserClasses = this[TREE].getTreeVar('parserClasses');

	            var i = 0;
	            var il = void 0;
	            for (i = 0, il = parserClasses.length; i < il; ++i) {
	                if (parserClasses[i].getPriority() < parserClass.getPriority()) {
	                    break;
	                }
	            }
	            parserClasses.splice(i, 0, parserClass);
	        }

	        /**
	         * 第一次渲染。
	         * 注意，此处有坑：
	         * 如果这样写代码：
	         *
	         * // template.html
	         * <!-- if: a -->
	         * yibuyisheng1
	         * <!-- else -->
	         * yibuyisheng
	         * <!-- /if -->
	         *
	         * // test.js
	         * vtpl.render(() => {
	         * 	console.log(1);
	         * });
	         * vtpl.setData('name', 'yibuyisheng', {
	         * 	done() {
	         * 		console.log(2);
	         * 	}
	         * });
	         *
	         * 此段代码会先打印2，然后再打印1，因为setData并没有触发模板中表达式的改变，所以setData的回调函数相当于是同步的，
	         * 而render的回调函数是异步的，所以会后执行。也就是说，此处还没有render完，就执行了setData回调。
	         *
	         * @public
	         * @param  {Function} done 渲染完成回调函数
	         */

	    }, {
	        key: 'render',
	        value: function render(done) {
	            this[TREE].compile();
	            this[TREE].link();
	            this[TREE].getTreeVar('domUpdater').start();
	            this[TREE].initRender(done);
	        }

	        /**
	         * 设置数据
	         *
	         * @public
	         * @param {string} name    key
	         * @param {*} value   值
	         * @param {Object} options 附加参数
	         */

	    }, {
	        key: 'setData',
	        value: function setData(name, value, options) {
	            var scope = this[TREE].rootScope;
	            if ((0, _utils.isClass)(name, 'String')) {
	                /* eslint-disable fecs-prefer-assign-pattern */
	                options = options || {};
	                /* eslint-enable fecs-prefer-assign-pattern */
	                scope.set(name, value, options.isSilent, options.done);
	            } else {
	                options = value || {};
	                scope.set(name, options.isSilent, options.done);
	            }
	        }

	        /**
	         * 销毁
	         *
	         * @public
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            var nodesManager = this[TREE].getTreeVar('nodesManager');
	            var exprCalculater = this[TREE].getTreeVar('exprCalculater');
	            var domUpdater = this[TREE].getTreeVar('domUpdater');

	            this[TREE].destroy();
	            this[TREE] = null;

	            exprCalculater.destroy();
	            domUpdater.destroy();
	            nodesManager.destroy();
	        }
	    }, {
	        key: 'nodesManager',
	        get: function get() {
	            return this[TREE].getTreeVar('nodesManager');
	        }

	        /**
	         * 获取tree
	         *
	         * @public
	         * @return {Tree}
	         */

	    }, {
	        key: 'tree',
	        get: function get() {
	            return this[TREE];
	        }
	    }]);

	    return VTpl;
	}();

	exports.default = VTpl;

/***/ }
/******/ ])});;