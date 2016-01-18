import vc from 'vcomponent/src/main';

const {VComponent, Component} = vc;

class Base extends Component {
    getTemplate() {
        return 'base tpl';
    }
}

class Children extends Component {
    getTemplate() {
        return '<div>${props.children}</div><p>${props.title}</p>';
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

testBase();
testNest();
testAttr();
testChildren();
testDirtyChecker();

function testDirtyChecker() {
    let vcomponent = new VComponent({
        startNode: getNode('dirtyChecker'),
        endNode: getNode('dirtyChecker')
    });
    vcomponent.registerComponents([DirtyChecker]);
    vcomponent.render();
    vcomponent.destroy();
    console.log(vcomponent);
}

function testChildren() {
    let vcomponent = new VComponent({
        startNode: getNode('children'),
        endNode: getNode('children')
    });
    vcomponent.registerComponents([Children]);
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

