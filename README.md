### 这是什么？

基于 DOM template 的组件化库，类似于 React 。

### 与 React 主要不同点

1、没有 virtual DOM ，仅针对浏览器的 DOM 树进行处理；
2、html 部分写起来更像是一门传统的模板语言。

### 有现成的解决方案，为什么要重复做这种组件化的东西？

**纯属装逼。**

### 快速开始

先写一个 Hello world! 程序。

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
* 5、在 src 目录下写一个组件 `Main` ，文件名为 `Main.js` ，文件内容为：

```js
import v from 'vcomponent';

export default class Main extends v.Component {
	getTemplate() {
		return [
            '<span>${words[0]}</span>&nbsp;',
            '<span>${words[1]}!</span>'
        ].join('');
	}

	ready() {
		this.setData({
       	words: ['Hello', 'world']
       });
	}
}
```

* 6、在 src 目录下新建一个 js 文件 `main.js` 作为整个例子的 js 入口文件，内容为：

```js
import v from 'vcomponent';
import Main from './Main';

let main = document.getElementById('main');
let vc = new v.VComponent({
	startNode: main,
	endNode: main
});
vc.registerComponents([Main]);
vc.render();
```

* 7、您可能注意到了：在 js 源码中，我们采用了先进的 ES6 语法，目前浏览器还没有完全支持这种语法，因此要借助于 [babel](http://babeljs.io/) 来转换一下我们的代码，同时再使用 [webpack](https://webpack.github.io/) 合并一下转换后的代码：

```
// TODO
```


### 模板语法

本库主要包含的东西有：

* **节点表达式解析器`${[expression]}`：**用于解析 DOM 节点中的表达式；
* **条件指令`if`：**用于条件判断分支；
* **循环指令`for`：**用于循环输出一些内容；
* **变量声明指令`var`：**用于在模板中添加一些变量；
* **组件解析器：**对于 DOM 元素中，tagName 以 `ui-` 开头的元素，都会被认为是组件，比如 `<ui-button>按钮组件</ui-button>`。

> 什么是`表达式`？
> 表达式就是 DOM 节点中或指令中能返回具体值的式子。比如 `<span title="${age}">${name}</span>` 中的 `${age}` 和 `${name}` 都是表达式，`<!-- if: name === "yibuyisheng" --><!-- /if -->` 中的 `name === 'yibuyisheng'` 也是表达式。

#### 表达式

表达式主要用于向页面输出信息，或者向子组件传递参数。比如：

```html
<!-- 输出内容 -->
<span>your nickname: ${nickname}</span>
<!-- 传递参数 -->
<ui-button btn-type="${btnType}">按钮</ui-button>
```

**注意：**目前尚不支持向 DOM 中输出 html 。也就是说，如果上面的 `nickname` 取值是 `<strong>yibuyisheng</strong>` ，那么 `<span>your nickname: ${nickname}</span>` 对应的输出就为 `<span>your nickname: &lt;strong&gt;yibuyisheng&lt;/strong&gt;</span>` 。

实际上，表达式会被转换成相应的函数调用来求值，比如上面 `${nickname}` 表达式转换成的函数及其调用大致为：

```js
// ${nickname}
(function (nickname) { return nickname; })('yibuyisheng')；
```

#### 条件指令`if`

if 指令用于条件判断：

```html
<!-- if: age <= 10 -->
	some content for children.
<!-- elif: age > 18 -->
	some content for adult.
<!-- else -->
	no content.
<!-- /if -->
```

条件不满足的分支中的 DOM 节点将不会展示出来。

#### 循环指令`for`

循环指令`for`用于处理迭代：

```html
<!-- for: users as user -->
	${user.name}
<!-- /for -->
```

循环指令`for`可以迭代数组和对象。在 for 指令循环内部，有两个额外的本地变量，名字分别为 key 、 index 。当迭代的目标是数组的时候 key 和 index 都是当前索引；如果迭代目标是一个普通的对象，那么 key 就是当前的键， index 可以指明当前迭代了多少次。

```html
<!-- for: users as user -->
	${user.name}, ${key}, ${index}
<!-- /for -->
```

> for 指令目前只做了非常简单的优化： DOM 节点只增不减。

for 指令会形成自己的作用域。

#### 变量声明指令`var`

var 指令用于在当前作用域中声明定义变量，比如：

```
<!-- var: name = '张三' -->
${name}
```

目前能形成作用域的东西有： for 指令、组件。

### 组件

在模板语法中，组件节点必须以 `ui` 开头。

在 vcomponent 中，每一个组件就是一个类。其中有一个组件基类 `Component` ，所有的组件类都应该继承自这个基类。

`Component` 组件基类有如下的生命周期方法：

* **ready()** ：在组件就绪的时候调用。
* **destroy()** ：销毁组件。

有如下辅助方法供调用：

* **getTemplate()** ：获取组件模板，返回字符串。
* **propsChange()** ：在组件 props 发生变化的时候调用（ props 是外部传入组件的变量）。
* **ref(ref)** ：查找组件范围内子组件之外的带有指定 ref 的 DOM 节点或子组件。
* **getComponentClasses()**：用于注册组件内部用到的子组件类。
* **setState()** ：设置组件 state 数据。