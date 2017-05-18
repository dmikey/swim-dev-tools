/* this library handles standalone packages for 
 *  Swim Apps.
 *
 *  Standalone Swim Apps
 *
 *
 */
var global = global || window;
var swimModules = {};
var swimModule = {
    require: function(name) {
        return document.createElement(swimModules[name]);
    },
    register: function(name, interface) {
        if (swimModules[name]) {
            if (console) console.warn('module already registered');
            return;
        }

        tag('x-' + name, {
            template: interface.template,
            accessors: {
                data: {
                    attribute: {},
                    get: function() {
                        return this._data;
                    },
                    set: function(value) {
                        this._data = value;
                        this.update();
                    }
                }
            },
            methods: {
                update: _.debounce(function() {
                    requestAnimationFrame(interface.updated);
                }, 1000 / 30)
            },
            created: interface.created,
            inserted: interface.inserted
        });

        swimModules[name] = 'x-' + name;
    }
};

swimModule = (global && global.swimModule) || swimModule;

global.swimModule = swimModule;
global.swimModules = swimModules;
module.exports = swimModule;