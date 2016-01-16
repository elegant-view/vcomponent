import VComponent from '../src/main';

class Base extends VComponent.Component {
    getTemplate() {
        return 'base tpl';
    }
}

class Children extends VComponent.Component {
    getTemplate() {
        return '<div>${props.children}</div><p>${props.title}</p>';
    }
}

class Attr extends VComponent.Component {
    getTemplate() {
        return '<div title="${props.attr}">${props.attr}</div>';
    }
}

class Inner extends VComponent.Component {
    getTemplate() {
        return '<div>${props.testAttr}</div>';
    }
}

class Outer extends VComponent.Component {
    getTemplate() {
        return '<ui-inner test-attr="${props.testAttr}"></ui-inner>';
    }
}

testBase();
testNest();
testAttr();
testChildren();

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

