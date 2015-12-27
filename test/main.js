var VComponent = require('../src/main');

var BaseComponent = VComponent.Component.extends(
    {
        tpl: 'base tpl'
    },
    {
        $name: 'Base'
    }
);

testBase();
testNest();
testAttr();

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
        startNode: document.getElementById('attr'),
        endNode: document.getElementById('attr')
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
        startNode: document.getElementById('nest'),
        endNode: document.getElementById('nest')
    });
    vcomponent.registerComponents([OuterComponent, InnerComponent]);
    vcomponent.render();
    console.log(vcomponent, vcomponent.$vtpl.$tree.$parsers[0].constructor.$name);
}

function testBase() {
    var vcomponent = new VComponent({
        startNode: document.getElementById('base'),
        endNode: document.getElementById('base')
    });
    vcomponent.registerComponents([BaseComponent]);
    vcomponent.render();
    console.log(vcomponent.$vtpl.$nodesManager);
}

