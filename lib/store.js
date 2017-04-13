
var Worker = require('worker-loader!./store-worker');
var utils = require('./utils');
var worker = new Worker;

var timers = {};
var _store = {};

module.exports = {
    // Store.connect({
    //  host: 'ws://localhost:9001/?token=abcd',
    //  node: 'reader/', // or []
    //  lane: 'currentConnectionState', // or []
    //  event: ''
    // });
    connect: function (opts) {

        worker.onmessage = function(event) {
            var msg = JSON.parse(event.data);
            Dispatcher.dispatch(msg.dispatchAction, msg);
        }

        var node = typeof opts.node == 'function' ? opts.node() : opts.node;
        var lane = typeof opts.lane == 'function' ? opts.lane() : opts.lane;
        var event = opts.event;

        worker.postMessage(JSON.stringify({node: node, lane: lane, event: event, host: opts.host, action: 'downlink'}));
    },
    
    query: function(queryString, dispatchAction) {

        worker.postMessage(JSON.stringify({action: 'query', query: queryString, dispatchAction: dispatchAction}));
    },

    static: _store,

    put: function(key, value) {
        _store[key] = value;
    },

    get: function(key) {
        return _store[key]
    },
 
    // todo: offload these timers into webworkers if possible, so that they can run
    // on an independent thread, and then send state back to the UI to draw
    timer: function(callback, delay) {
        var guid = utils.guid();
        var fn = function() {
            _.merge(_store, callback());
            timers[guid] = setTimeout(fn, delay);
        }

        timers[guid] = setTimeout(fn, delay);

        return timers[guid];
    },

    clearTimer: function(timer) {
        clearTimeout(timers[guid]);
    }
};

var readyStateCheckInterval = window.setInterval(function () {
    //attach a ready state listener to fire off our first updates when the dom is available
    if (document.readyState === 'complete') {
        window.clearInterval(readyStateCheckInterval);
        // Access it later... Yes even after a page refresh!
         var store = new Lawnchair({name:'ui_state'}, function(store) {
            store.get('storage', function(me) {
                _store = me.storage;
            });
        });
    }
}, 10);


window.addEventListener("unload",function(){

    var store = new Lawnchair({name:'ui_state'}, function(store) {

        // save ui state store
        var me = {key:'storage', storage: _store};
        store.save(me);
    });
});