import {VComponent, Component} from 'vcomponent/src/main';

class Base extends Component {
    getTemplate() {
        return 'base tpl';
    }
}

class Children extends Component {
    getTemplate() {
        return '<div>${props.children}</div><p>${props.title}</p><ui-child-ref ref="child"></ui-child-ref>';
    }

    ready() {
        console.log('children refs:', this.refs);
    }
}

class ChildRef extends Component {
    getTemplate() {
        return '<p ref="haha">child ... </p><ui-base ref="base"></ui-base>';
    }

    ready() {
        console.log('childref refs:', this.refs);
    }
}

class Attr extends Component {
    getTemplate() {
        return '<div title="${props.attr}">${props.attr}</div>';
    }
}

class Inner extends Component {
    getTemplate() {
        return '<div>${props.testAttr}</div>';
    }
}

class Outer extends Component {
    getTemplate() {
        return '<ui-inner test-attr="${props.testAttr}"></ui-inner>';
    }
}

class DirtyChecker extends Component {
    getTemplate() {
        return '${state.timer}';
    }

    ready() {
        setInterval(() => {
            this.setState('timer', new Date().getTime());
        }, 1000);
    }

    shouldUpdate() {
        return true;
    }
}

class CssClass extends Component {
    getTemplate() {
        return '<!-- var: list=[1,2,3] --><!-- for: list as item --><div><span>${item}</span></div><!-- /for -->';
    }

    static getStyle() {
        return 'body {color: black;}';
    }
}

testBase();
testNest();
testAttr();
testChildren();
testDirtyChecker();
testCssClass();

function testCssClass() {
    let vcomponent = new VComponent({
        startNode: getNode('class'),
        endNode: getNode('class')
    });
    vcomponent.registerComponents([CssClass]);
    vcomponent.render();
    console.log(vcomponent);
}

function testDirtyChecker() {
    let vcomponent = new VComponent({
        startNode: getNode('dirtyChecker'),
        endNode: getNode('dirtyChecker')
    });
    vcomponent.registerComponents([DirtyChecker]);
    vcomponent.render();
    setTimeout(function () {
        vcomponent.destroy();
    }, 3000);
    console.log(vcomponent);
}

function testChildren() {
    let vcomponent = new VComponent({
        startNode: getNode('children'),
        endNode: getNode('children')
    });
    vcomponent.registerComponents([Children, Base, ChildRef]);
    vcomponent.render();
    console.log(vcomponent);
}

function testAttr() {
    let vcomponent = new VComponent({
        startNode: getNode('attr'),
        endNode: getNode('attr')
    });
    vcomponent.registerComponents([Attr]);
    vcomponent.render();
    console.log(vcomponent);
}

function testNest() {
    var vcomponent = new VComponent({
        startNode: getNode('nest'),
        endNode: getNode('nest')
    });
    vcomponent.registerComponents([Outer, Inner]);
    vcomponent.render();
    console.log(vcomponent, vcomponent.$vtpl.$tree.$parsers[0].constructor.$name);
}

function testBase() {
    var vcomponent = new VComponent({
        startNode: getNode('base'),
        endNode: getNode('base')
    });
    vcomponent.$vtpl.setData({name: 'zhangsan'});
    vcomponent.registerComponents([Base]);
    vcomponent.render();

    let uiBaseParser = vcomponent.$vtpl.$tree.$parsers[1];
    let uiBase = uiBaseParser.$component;
    if (uiBase.props.get('testProp') !== 'test the prop') {
        throw new Error('props设置有点问题');
    }

    if (uiBase.props.get('testExprProp') !== 'zhangsan') {
        throw new Error('props设置有点问题');
    }

    vcomponent.$vtpl.setData({name: 'zhangsan1'});
    if (uiBase.props.get('testExprProp') !== 'zhangsan1') {
        throw new Error('props设置有点问题');
    }

    console.log(vcomponent.$vtpl);
}

function getNode(id) {
    var node = document.getElementById(id);
    node.style.display = 'block';
    return node;
}

