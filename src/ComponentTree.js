var Tree = require('dom-data-bind/trees/Tree');
var ComponentParser = require('../parsers/ComponentParser');
var Event = require('../Event');

module.exports = Tree.extends(
    {
        initialize: function (options) {
            if (!options.config
                || !options.domUpdater
                || !options.exprCalculater
                || !options.treeVars
                || !options.componentChildren
                || !options.componentManager
            ) {
                throw new Error('wrong arguments');
            }

            this.$super.initialize(options);

            this.componentChildren = options.componentChildren;
            this.componentEvent = new Event();
        },

        createParser: function (ParserClass, options) {
            var instance = this.$super.createParser.apply(this, arguments);

            if (instance && ParserClass === ComponentParser) {
                instance.parser.setComponentEvent(this.componentEvent);
            }

            return instance;
        }
    }
);
