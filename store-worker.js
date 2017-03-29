var connections = {};
onmessage = function(event) {
	var opts = JSON.parse(event.data);
	var host = connections[opts.host] || Swim.downlink().host(opts.host);
	connections[opts.host] = host;

	function swimEventHandler(msg) {
		var dispatchAction = opts.event;
		msg.dispatchAction = dispatchAction;
		postMessage(JSON.stringify(msg));
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
				.sync();
			host[opts.node + opts.lane] = connection;
	}
}