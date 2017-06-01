var Worker = require('worker-loader?inline!./store-worker');
var utils = require('./utils');
var worker = new Worker;
var _ = require('../node_modules/lodash');
var Lawnchair = require('../node_modules/lawnchair');
var timers = {};
var connections = {};
var _store = {};

var focused = true;

window.onfocus = function() {
    focused = true;
};
window.onblur = function() {
    focused = false;
};


worker.onmessage = function(event) {
    var msg = JSON.parse(event.data);
    msg.meta = connections[msg.index].meta;
    _store[connections[msg.index].node + connections[msg.index].lane] = msg;
    Dispatcher.dispatch(msg.dispatchAction, msg);
}

module.exports = {
    // Store.connect({
    //  host: 'ws://localhost:9001/?token=abcd',
    //  node: 'reader/', // or []
    //  lane: 'currentConnectionState', // or []
    //  event: ''
    // });
    connect: function(opts) {
        var guid = utils.guid();
        var node = typeof opts.node == 'function' ? opts.node() : opts.node;
        var lane = typeof opts.lane == 'function' ? opts.lane() : opts.lane;

        // keep track of the opts that come so we know who to communicate with
        // when we get messages back from the worker thread		  
        connections[guid] = opts;

        worker.postMessage(JSON.stringify({
            index: guid,
            node: node,
            lane: lane,
            event: opts.event,
            sync: opts.sync,
            host: opts.host,
            action: 'downlink'
        }));
    },

    query: function(queryString, dispatchAction) {
        worker.postMessage(JSON.stringify({
            action: 'query',
            query: queryString,
            dispatchAction: dispatchAction
        }));
    },
    dirty: function(key, value) {
        if (_store[key]) {
            _store[key].dirty = value;
        }
    },
    put: function(key, value) {
        // cheap for now, anytime data is put here, dirty
        // diff it todo
        // puts should queue by key and flush when appropriate
        if (!value) {
            return;
        }

        var _value = _store[key] || {};
        _store[key] = utils.mix.call(_value, value);

        if (_store[key]) {
            _store[key].dirty = true; // draw.js will set the dirty state after draw
        }
    },

    get: function(key) {
        return _store[key]
    },

    // todo: offload these timers into webworkers if possible, so that they can run
    // on an independent thread, and then send state back to the UI to draw
    timer: function(callback, delay) {
        var guid = utils.guid();
        var fn = function() {
            if (document.hidden === false) _.merge(_store, callback());
            timers[guid] = setTimeout(fn, delay);
        }

        timers[guid] = setTimeout(fn, delay);

        return timers[guid];
    },

    clearTimer: function(timer) {
        clearTimeout(timers[guid]);
    }
};