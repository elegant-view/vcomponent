import VComponent from '../src/main';

var BaseComponent = VComponent.Component.extends(
    {
        getTemplate() {
            return 'base tpl';
        }
    },
    {
        $name: 'Base'
    }
);

testES6ClassExtention();
// testBase();
// testNest();
// testAttr();
// testChildren();

function testES6ClassExtention() {
    class Label extends VComponent.Component {
        getTemplate() {
            return 'template';
        }
    }

    let Button = VComponent.Component.extends({}, {$name: 'Button'});

    var vcomponent = new VComponent({
        startNode: getNode('es6ClassExtention'),
        endNode: getNode('es6ClassExtention')
    });
    vcomponent.registerComponents([Label]);
    vcomponent.render();
}

function testChildren() {
    var ChildrenComponent = VComponent.Component.extends(
        {
            getTemplate() {
                return '<div>${props.children}</div><p>${props.title}</p>';
            }
        },
        {
            $name: 'Children'
        }
    );
    var vcomponent = new VComponent({
        startNode: getNode('children'),
        endNode: getNode('children')
    });
    vcomponent.registerComponents([ChildrenComponent]);
    vcomponent.render();
    console.log(vcomponent);
}

function testAttr() {
    var AttrComponent = VComponent.Component.extends(
        {
            getTemplate() {
                return '<div title="${props.attr}">${props.attr}</div>';
            }
        },
        {
            $name: 'Attr'
        }
    );

    var vcomponent = new VComponent({
        startNode: getNode('attr'),
        endNode: getNode('attr')
    });
    vcomponent.registerComponents([AttrComponent]);
    vcomponent.render();
    console.log(vcomponent);
}

function testNest() {
    var InnerComponent = VComponent.Component.extends(
        {
            getTemplate() {
                return '<div>${props.testAttr}</div>';
            }
        },
        {
            $name: 'Inner'
        }
    );

    var OuterComponent = VComponent.Component.extends(
        {
            getTemplate() {
                return '<ui-inner test-attr="${props.testAttr}"></ui-inner>';
            }
        },
        {
            $name: 'Outer'
        }
    );

    var vcomponent = new VComponent({
        startNode: getNode('nest'),
        endNode: getNode('nest')
    });
    vcomponent.registerComponents([OuterComponent, InnerComponent]);
    vcomponent.render();
    console.log(vcomponent, vcomponent.$vtpl.$tree.$parsers[0].constructor.$name);
}

function testBase() {
    var vcomponent = new VComponent({
        startNode: getNode('base'),
        endNode: getNode('base')
    });
    vcomponent.$vtpl.setData({name: 'zhangsan'});
    vcomponent.registerComponents([BaseComponent]);
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

