var VComponent = require('../src/main');

var BaseComponent = VComponent.Component.extends(
    {
        tpl: 'base tpl'
    },
    {
        $name: 'Base'
    }
);

// testBase();
// testNest();
// testAttr();
testChildren();

function testChildren() {
    var ChildrenComponent = VComponent.Component.extends(
        {
            tpl: '<div>${props.children}</div><p>${props.title}</p>'
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
}

function testAttr() {
    var AttrComponent = VComponent.Component.extends(
        {
            tpl: '<div title="${props.attr}">${props.attr}</div>'
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
            tpl: '<div>${props.testAttr}</div>'
        },
        {
            $name: 'Inner'
        }
    );

    var OuterComponent = VComponent.Component.extends(
        {
            tpl: '<ui-inner test-attr="${props.testAttr}"></ui-inner>'
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
    vcomponent.registerComponents([BaseComponent]);
    vcomponent.render();
    console.log(vcomponent.$vtpl.$nodesManager);
}

function getNode(id) {
    var node = document.getElementById(id);
    node.style.display = 'block';
    return node;
}

