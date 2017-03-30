
var Worker = require("worker-loader!./store-worker");
var worker = new Worker;

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
    
    query: function(queryString) {

        worker.postMessage(JSON.stringify({action: 'query', query: queryString}));
    }
};