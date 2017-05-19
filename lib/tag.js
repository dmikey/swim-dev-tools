var xtag = require('x-tag');
var guid = require('./utils.js').guid;
var _ = require('../node_modules/lodash');

module.exports = function(tagName, def) {
    // creates an xtag from a definition file
    // use a singleton store, so that the state can be scraped, or restored, etc
    var dispatcher = require('./dispatcher');
    var uniqueTagName;
    var methods = def.methods || {};
    methods.template = _.template(def.template);

    methods.draw = function() {
        if (def.draw) Draw.call(this, def.draw.bind(this));
    };

    var newDef = _.merge({
        content: methods.template(def.defaults),
        lifecycle: {
            created: function() {
                this.guid = guid();
                uniqueTagName = tagName + '-' + this.guid;
                if (dispatcher) dispatcher[uniqueTagName] = dispatcher[uniqueTagName] || {};
                if (def.defaults) dispatcher[uniqueTagName] = def.defaults;
                if (def.created) def.created.apply(this, arguments);
            },
            inserted: function() {
                if (def.inserted) def.inserted.apply(this, arguments);
                this.draw();
            },
            attributeChanged: function(attrName, oldValue, newValue) {
                dispatcher[uniqueTagName][attrName] = newValue;
                if (def.attributeChanged) def.attributeChanged.apply(this, arguments);
            }
        },
        methods: methods,
        accessors: def.accessors
    }, def);

    return xtag.register(tagName, newDef);
}