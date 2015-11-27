### 这是什么？

基于 DOM template 的组件化库。

### 有现成的解决方案，为什么要重复做这种组件化的东西？

目前在前端领域，已经有非常多的组件化库： React 、 Vue 等等。那为啥还要去重复写这么一个东西呢？

* 1、练手，提高自身逼格；
* 2、目前我用过的组件化解决方案在 API 设计上都让我感觉不是太舒服，具体就是：

	* React 的 render 方法很容易写得惨不忍睹，大量的组件拼接，不忍直视。
	* Vue 父子组件嵌套使用类似于 layout 的思维方式，感觉有点复杂化了，为啥不沿用 HTML 式的嵌套设计呢？
	* Vue 指令分优先级，用起来心累。

### 快速开始

让我们先写一个 Hello world! 程序。

* 1、新建一个目录，取名为 dom-component-start ；
* 2、在 dom-component-start 目录下新建一个 html 文件 `index.html` ，内容为：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset=utf-8 />
    <title>dom-component</title>
    <script src="./dist/main.js"></script>
</head>
<body>
    <div class="main"></div>
</body>
</html>
```

* 4、在 dom-component-start 目录下新建一个目录 `src` ，用于存放 js 源码；
* 5、在 src 目录下写一个组件 Main ，文件名为 `Main.js` ，文件内容为：

```js
var Component = require('dom-component/src/Component');

module.exports = Component.extends(
    {
        tpl: [
            '<span>${words[0]}</span>&nbsp;',
            '<span>${words[1]}!</span>'
        ].join(''),
        literalAttrReady: function () {
            this.setData({
                words: ['Hello', 'world']
            });
        }
    },
    {
        $name: 'Main',
        getStyle: function () {
            return [
                '#root# {',
                    'color: red',
                '}'
            ].join('');
        }
    }
);
```

* 6、在 src 目录下新建一个 js 文件 `main.js` 作为整个例子的 js 入口文件，内容为：

```js
var domComponent = require('dom-component');
var Main = require('./Main');

var main = document.getElementById('main');
domComponent.mount(
	{
	    startNode: main,
	    endNode: main,
	    config: new domComponent.Config()
	},
	{
		Main: Main
	}
);
```

* 7、您可能注意到了：在 js 源码中，我们采用了 CommonJS 的模块化写法，因此代码是不能直接在浏览器中运行的，需要第三方工具的编译转换。此处选择 `gulp + browserify` 来转换我们的代码，在 dom-component-start 目录下依次运行如下命令：

```
npm init
npm install gulp -g
npm install gulp gulp-browserify --save-dev
```

> 注：请确保您的机器上已安装最新的 Node.js 以及配套的 npm 。

* 8、在 dom-component-start 目录下新建一个用于编译转换 js 代码的脚本文件 `gulpfile.js` ，内容为：

```js
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var gutil = require('gulp-util');

gulp.task('build', function () {
    return gulp.src('./src/main.js', {read: false})
        .pipe(browserify({
            debug: true
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('./dist'));
});
```

* 9、执行下面的命令来编译转换您的 js 代码：

```
gulp build
```

* 10、直接用浏览器打开第2步中创建的 `index.html` ，如果看到红色的 `Hello world!` 字样，那么恭喜您，您成功跑起来了。

### 模板语法

从“快速开始”的例子中，可以看到 Main 组件有一个 tpl 属性，这个属性就是用于设置组件模板的。

一个模板可能包含：组件、 if 指令、 for 指令、表达式、 var 指令、 scope 指令 。比如可能会是这个样子：

```html
<div>
	<!-- if: ${age} <= 10 -->
		some content for children.
	<!-- elif: ${age} > 18 -->
		some content for adult.
	<!-- else -->
		no content.
	<!-- /if -->
	
	<!-- for: ${users} as ${user} -->
		${user.name}
	<!-- /for -->
	
	<button event-click="${buttonClick(event)}">按钮</button>
</div>
```

#### 表达式

表达式就是 `${...}` 包裹的一块东西，存在于 DOM 节点属性值、文本节点等等。比如：

```html
<span>${username}</span>
<span title="Hello ${username}">用户</span>
```

实际上，表达式会转换成相应的函数调用来处理，比如上面两个表达式转换成的函数大致为：

```js
// ${username}
(function (username) { return username; })('张三')；

// Hello ${username}
'Hello ' + (function (username) { return username; })('张三')；
```

**注意：位于指令中的 `${...}` 不是表达式。**

#### if 指令

if 指令用于条件判断：

```html
<!-- if: ${age} <= 10 -->
	some content for children.
<!-- elif: ${age} > 18 -->
	some content for adult.
<!-- else -->
	no content.
<!-- /if -->
```

条件不满足的分支中的 DOM 节点将会从 DOM 树中移除。

### for 指令

for 指令用于处理迭代：

```html
<!-- for: ${users} as ${user} -->
	${user.name}
<!-- /for -->
```

for 指令可以迭代数组和对象。在 for 指令循环内部，有两个额外的本地变量，名字分别为 key 、 index 。当迭代的目标是数组的时候 key 和 index 都是当前索引；如果迭代目标是一个普通的对象，那么 key 就是当前的键， index 可以指明当前迭代了多少次。

```html
<!-- for: ${users} as ${user} -->
	${user.name}, ${key}, ${index}
<!-- /for -->
```

> for 指令目前只做了非常简单的优化： DOM 节点只增不减。

for 指令会形成自己的作用域。

### var 指令

var 指令用于在当前作用域中声明定义变量，比如：

```
<!-- var: name = '张三' -->
${name}
```

目前能形成作用域的东西有： for 指令、组件、 scope 指令。

### scope 指令

scope 指令可以在指定范围插入作用域：

```html
<!-- scope -->
some content
<!-- /scope -->
```

### 组件

组件是构成界面的基石。

在模板语法中，组件节点必须以 `ui` 开头。

在 vcomponent 中，每一个组件就是一个类。其中有一个组件基类 `Component` ，所有的组件类都应该继承自这个基类。

`Component` 组件基类有如下的生命周期方法：

* **beforeMount()** ：在组件挂载到 DOM 树之前调用。
* **afterMount()** ：在组件挂载到 DOM 树之后调用。
* **beforeDestroy()** ：在组件销毁之前调用。
* **afterDestroy()** ：在组件销毁之后调用。
* **literalAttrReady()** ：在组件各个属性都设置好之后调用。

有如下辅助方法供调用：

* **findComponent(filterFn)** ：找到第一个满足 filterFn 指定条件的子组件。
* **findComponents(filterFn)** ：找到所有满足 filterFn 指定条件的子组件。
* **ref(ref)** ：查找组件范围内子组件之外的带有指定 ref 的 DOM 节点或子组件。
* **setData(name, value)** ：设置组件数据，界面会跟随变动。
* **getData(name, dft)** ：获取当前组件数据。
* **goDark()** ：隐藏当前组件。
* **restoreFromDark()** ：显示当前组件。

有一个 tpl 属性可以设置当前组件的模板，模板语法为上述所讲的语法。

可以通过 `getStyle()` 静态方法设置当前组件的样式。对于样式，子组件会继承复用父组件的样式。

例如下面是一个继承自 `Component` 的组件：

```js
var ChildComponent = Component.extends(
	// 以下是实例属性，挂在 ChildComponent.prototype 下面
	{
		tpl: [
			'<div></div>',
			'<ui-some-other-component></ui-some-other-component>',
			'<p></p>'
		].join(''),
		
		beforeMount: function () {
			console.log('before mount');
		},
		
		afterMount: function () {
			console.log('after mount');
		},
		
		beforeDestroy: function () {
			console.log('before destroy');
		},
		
		afterDestroy: function () {
			console.log('after destroy');
		},
		
		literalAttrReady: function () {
			console.log('literal attr ready');
		}
	},
	// 以下是静态属性，会直接挂在 ChildComponent 下面
	{
		$name: 'ChildComponent',

		getStyle: function () {
			return '#root# {background-color: red;}';
		}
	}
);
```