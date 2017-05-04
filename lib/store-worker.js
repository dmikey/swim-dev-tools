var jsonQuery = require('json-query');

var connections = {};
var data = {table:[]};

onmessage = function(event) {
	var opts = JSON.parse(event.data);

	if (opts.action === 'downlink') {
		var host = connections[opts.host] || Swim.downlink().host(opts.host);
		connections[opts.host] = host;

		function swimEventHandler(msg) {

			var dispatchAction = opts.event;
			msg.dispatchAction = dispatchAction;

			if(msg.body) {
				for (var i = 0; i < msg.body.length; i++) {
					for (var key in msg.body[i]) {
						if (msg.body[i].hasOwnProperty(key)) {
							msg[key] = msg.body[i][key];
						}
					}	
				}
			}

			postMessage(JSON.stringify(msg));
			data.table.push(msg);
		}

		if(opts.node instanceof Array) {
			
			// if node is a list of nodes, lets connect to all of them
			// we should check lanes as well to give this more flexability
			for (var i = 0; i < opts.node.length; i++) {
				var connection = host[opts.node[i] + opts.lane] || host.node(opts.node[i])
					.lane(opts.lane)
					.onEvent(swimEventHandler)
					.sync();
				host[opts.node[i] + opts.lane] = connection;
			}
		} else {
			// otherwise just connect to one
				var connection = host[opts.node + opts.lane] || host.node(opts.node)
					.lane(opts.lane)
					.onEvent(swimEventHandler)
					.onSync(swimEventHandler)
					.sync();
				host[opts.node + opts.lane] = connection;
		}
	} 

	if(opts.action === 'query') {
		var queryReturn = jsonQuery(opts.query, {
			data: data
		});
		queryReturn.dispatchAction = opts.dispatchAction;
		postMessage(JSON.stringify(queryReturn));
	}

}