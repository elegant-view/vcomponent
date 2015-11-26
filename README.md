### 这是什么？

基于 DOM template 的组件化库。

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