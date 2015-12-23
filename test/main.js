
var VComponent = require('../src/main');
testBase();

function testBase() {
    var BaseComponent = VComponent.Component.extends(
        {
            tpl: 'base tpl'
        },
        {
            $name: 'Base'
        }
    );
    var vcomponent = new VComponent({
        startNode: document.getElementById('base'),
        endNode: document.getElementById('base')
    });
    vcomponent.registerComponents([BaseComponent]);
    vcomponent.render();
}

