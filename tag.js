var xtag = require('xtag');

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

module.exports = function (tagName, def) {
    // creates an xtag from a definition file
    // use a singleton store, so that the state can be scraped, or restored, etc
    var store = require('store');
    var uniqueTagName;
    var methods = def.methods || {};
    methods.template = _.template(def.template);
    
    var newDef = _.merge({
        content: methods.template(def.defaults),
        lifecycle: {
            created: function () {
                this.guid = guid();
                uniqueTagName = tagName + '-' + this.guid;
                if (store) store[uniqueTagName] = store[uniqueTagName] || {};
                if (def.defaults) store[uniqueTagName] = def.defaults;
                if (def.created) def.created.apply(this, arguments);
            },
            inserted: function () {
                if (def.inserted) def.inserted.apply(this, arguments);
            },
            attributeChanged: function (attrName, oldValue, newValue) {
                store[uniqueTagName][attrName] = newValue;
                if (def.attributeChanged) def.attributeChanged.apply(this, arguments);
            }
        },
        methods: methods,
        accessors: def.accessors
    }, def);

    return xtag.register(tagName, newDef);
}