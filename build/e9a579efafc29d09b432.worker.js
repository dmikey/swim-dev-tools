/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Swim) {'use strict';

	var jsonQuery = __webpack_require__(10);

	var connections = {};
	var data = {
	    table: []
	};

	onmessage = function onmessage(event) {
	    var opts = JSON.parse(event.data);

	    if (opts.action === 'downlink') {
	        var host;
	        var i;
	        var connection;
	        var connection;

	        (function () {
	            var swimEventHandler = function swimEventHandler(msg, dispatchAction) {

	                msg.dispatchAction = dispatchAction;
	                msg.index = opts.index;

	                if (msg.body) {
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
	            };

	            host = connections[opts.host] || Swim.downlink().host(opts.host);

	            connections[opts.host] = host;

	            if (opts.node instanceof Array) {

	                // if node is a list of nodes, lets connect to all of them
	                // we should check lanes as well to give this more flexability
	                for (i = 0; i < opts.node.length; i++) {
	                    connection = host[opts.node[i] + opts.lane] || host.node(opts.node[i]);


	                    connection.lane(opts.lane).onEvent(function () {
	                        if (opts.event) swimEventHandler(msg, opts.event);
	                    }).onSync(function (msg) {
	                        if (opts.sync) swimEventHandler(msg, opts.sync);
	                    }).sync();
	                    host[opts.node[i] + opts.lane] = connection;
	                }
	            } else {
	                // otherwise just connect to one
	                connection = host[opts.node + opts.lane] || host.node(opts.node);


	                connection.lane(opts.lane).onEvent(function (msg) {
	                    //console.log('event', msg)
	                    if (opts.event) swimEventHandler(msg, opts.event);
	                }).onSync(function (msg) {
	                    //console.log('sync', msg)
	                    if (opts.sync) swimEventHandler(msg, opts.sync);
	                }).sync();
	                host[opts.node + opts.lane] = connection;
	            }
	        })();
	    }

	    if (opts.action == 'unlink') {}

	    if (opts.action === 'query') {
	        var queryReturn = jsonQuery(opts.query, {
	            data: data
	        });
	        queryReturn.dispatchAction = opts.dispatchAction;
	        postMessage(JSON.stringify(queryReturn));
	    }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var config = __webpack_require__(2);
	var recon = global.recon || __webpack_require__(3);
	var proto = __webpack_require__(5);
	var WebSocket = global.WebSocket || __webpack_require__(7).w3cwebsocket;


	function Client(options) {
	  options = options || {};
	  Object.defineProperty(this, 'options', {value: options, enumerable: true});
	  Object.defineProperty(this, 'channels', {value: {}, configurable: true});
	  Object.defineProperty(this, 'delegate', {value: this, enumerable: true, writable: true});
	}
	Object.defineProperty(Client.prototype, 'onChannelConnect', {
	  value: function (info) {
	    if (typeof this.delegate.onConnect === 'function') {
	      this.onConnect(info);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Client.prototype, 'onChannelDisconnect', {
	  value: function (info) {
	    if (typeof this.delegate.onDisconnect === 'function') {
	      this.onDisconnect(info);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Client.prototype, 'onChannelError', {
	  value: function (info) {
	    if (typeof this.delegate.onError === 'function') {
	      this.onError(info);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Client.prototype, 'onChannelAuthorize', {
	  value: function (info) {
	    if (typeof this.delegate.onAuthorize === 'function') {
	      this.onAuthorize(info);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Client.prototype, 'onChannelDeauthorize', {
	  value: function (info) {
	    if (typeof this.delegate.onDeauthorize === 'function') {
	      this.onDeauthorize(info);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Client.prototype, 'callChannelWithLinkArgs', {
	  value: function (name, args) {
	    var hostUri, nodeUri, laneUri, options;
	    if (args.length === 2) {
	      options = {};
	      laneUri = args[1];
	      nodeUri = args[0];
	      hostUri = Client.extractHostUri(nodeUri);
	    } else if (args.length === 3) {
	      if (typeof args[2] === 'object') {
	        options = args[2];
	        laneUri = args[1];
	        nodeUri = args[0];
	        hostUri = Client.extractHostUri(nodeUri);
	      } else {
	        hostUri = args[0];
	        nodeUri = Client.resolveNodeUri(hostUri, args[1]);
	        laneUri = args[2];
	        options = {};
	      }
	    } else {
	      hostUri = args[0];
	      nodeUri = Client.resolveNodeUri(hostUri, args[1]);
	      laneUri = args[2];
	      options = args[3];
	    }
	    var channel = this.getOrCreateChannel(hostUri);
	    return channel[name](nodeUri, laneUri, options);
	  },
	  configurable: true
	});
	Client.prototype.getOrCreateChannel = function (hostUri) {
	  var channel = this.channels[hostUri];
	  if (channel === undefined) {
	    if (this.options.noWebSocket || /^http/.test(hostUri)) {
	      channel = new HttpSocketChannel(this, hostUri, this.options);
	    } else {
	      channel = new WebSocketChannel(this, hostUri, this.options);
	    }
	    this.channels[hostUri] = channel;
	  }
	  return channel;
	};
	Client.prototype.authorize = function (hostUri, credentials) {
	  var channel = this.getOrCreateChannel(hostUri);
	  channel.authorize(credentials);
	};
	Client.prototype.downlink = function () {
	  return new DownlinkBuilder(null, this);
	};
	Client.prototype.link = function () {
	  return this.callChannelWithLinkArgs('link', arguments);
	};
	Client.prototype.sync = function () {
	  return this.callChannelWithLinkArgs('sync', arguments);
	};
	Client.prototype.syncList = function () {
	  return this.callChannelWithLinkArgs('syncList', arguments);
	};
	Client.prototype.syncMap = function () {
	  return this.callChannelWithLinkArgs('syncMap', arguments);
	};
	Client.prototype.command = function () {
	  var hostUri, nodeUri, laneUri, body;
	  if (arguments.length === 3) {
	    body = arguments[2];
	    laneUri = arguments[1];
	    nodeUri = arguments[0];
	    hostUri = Client.extractHostUri(nodeUri);
	  } else {
	    hostUri = arguments[0];
	    nodeUri = Client.resolveNodeUri(hostUri, arguments[1]);
	    laneUri = arguments[2];
	    body = arguments[3];
	  }
	  var channel = this.getOrCreateChannel(hostUri);
	  channel.command(nodeUri, laneUri, body);
	};
	Client.prototype.host = function (hostUri) {
	  var channel = this.getOrCreateChannel(hostUri);
	  return new HostScope(channel, hostUri);
	};
	Client.prototype.node = function () {
	  var hostUri, nodeUri;
	  if (arguments.length === 1) {
	    nodeUri = arguments[0];
	    hostUri = Client.extractHostUri(nodeUri);
	  } else {
	    hostUri = arguments[0];
	    nodeUri = Client.resolveNodeUri(hostUri, arguments[1]);
	  }
	  var channel = this.getOrCreateChannel(hostUri);
	  return new NodeScope(channel, hostUri, nodeUri);
	};
	Client.prototype.lane = function () {
	  var hostUri, nodeUri, laneUri;
	  if (arguments.length === 2) {
	    laneUri = arguments[1];
	    nodeUri = arguments[0];
	    hostUri = Client.extractHostUri(nodeUri);
	  } else {
	    hostUri = arguments[0];
	    nodeUri = Client.resolveNodeUri(hostUri, arguments[1]);
	    laneUri = arguments[2];
	  }
	  var channel = this.getOrCreateChannel(hostUri);
	  return new LaneScope(channel, hostUri, nodeUri, laneUri);
	};
	Client.prototype.close = function () {
	  var channels = this.channels;
	  Object.defineProperty(this, 'channels', {value: {}, configurable: true});
	  for (var hostUri in channels) {
	    var channel = channels[hostUri];
	    channel.close();
	  }
	};
	Client.extractHostUri = function (nodeUri) {
	  var uri = recon.uri.parse(nodeUri);
	  var scheme = uri.scheme;
	  if (scheme === 'swim') scheme = 'ws';
	  else if (scheme === 'swims') scheme = 'wss';
	  return recon.uri.stringify({
	    scheme: scheme,
	    authority: uri.authority
	  });
	};
	Client.resolveNodeUri = function (hostUri, nodeUri) {
	  return recon.uri.stringify(recon.uri.resolve(hostUri, nodeUri));
	};


	function Scope(channel) {
	  Object.defineProperty(this, 'channel', {value: channel});
	  Object.defineProperty(this, 'downlinks', {value: [], configurable: true});
	  Object.defineProperty(this, 'delegate', {value: this, enumerable: true, writable: true});
	  channel.registerDelegate(this);
	}
	Object.defineProperty(Scope.prototype, 'isConnected', {
	  get: function () {
	    return this.channel.isConnected;
	  },
	  enumerable: true
	});
	Object.defineProperty(Scope.prototype, 'isAuthorized', {
	  get: function () {
	    return this.channel.isAuthorized;
	  },
	  enumerable: true
	});
	Object.defineProperty(Scope.prototype, 'session', {
	  get: function () {
	    return this.channel.session;
	  },
	  enumerable: true
	});
	Object.defineProperty(Scope.prototype, 'onChannelConnect', {
	  value: function (info) {
	    if (typeof this.delegate.onConnect === 'function') {
	      this.onConnect(info);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Scope.prototype, 'onChannelDisconnect', {
	  value: function (info) {
	    if (typeof this.delegate.onDisconnect === 'function') {
	      this.onDisconnect(info);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Scope.prototype, 'onChannelError', {
	  value: function (info) {
	    if (typeof this.delegate.onError === 'function') {
	      this.onError(info);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Scope.prototype, 'onChannelAuthorize', {
	  value: function (info) {
	    if (typeof this.delegate.onAuthorize === 'function') {
	      this.onAuthorize(info);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Scope.prototype, 'onChannelDeauthorize', {
	  value: function (info) {
	    if (typeof this.delegate.onDeauthorize === 'function') {
	      this.onDeauthorize(info);
	    }
	  },
	  configurable: true
	});
	Scope.prototype.registerDownlink = function (downlink) {
	  var scope = this;
	  Object.defineProperty(downlink, 'onChannelClose', {
	    value: function () {
	      scope.unregisterDownlink(downlink);
	      downlink.__proto__.onChannelClose.call(downlink);
	    },
	    configurable: true
	  });
	  this.downlinks.push(downlink);
	};
	Scope.prototype.unregisterDownlink = function (downlink) {
	  for (var i = 0, n = this.downlinks.length; i < n; i += 1) {
	    if (downlink === this.downlinks[i]) {
	      this.downlinks.splice(i, 1);
	      return;
	    }
	  }
	};
	Scope.prototype.close = function () {
	  this.channel.unregisterDelegate(this);
	  var downlinks = this.downlinks;
	  Object.defineProperty(this, 'downlinks', {value: [], configurable: true});
	  for (var i = 0, n = downlinks.length; i < n; i += 1) {
	    var downlink = downlinks[i];
	    downlink.close();
	  }
	};


	function HostScope(channel, hostUri) {
	  Scope.call(this, channel);
	  Object.defineProperty(this, 'hostUri', {value: hostUri, enumerable: true});
	  Object.defineProperty(this, 'downlinks', {value: [], configurable: true});
	}
	HostScope.prototype = Object.create(Scope.prototype);
	HostScope.prototype.constructor = HostScope;
	HostScope.prototype.authorize = function (credentials) {
	  this.channel.authorize(credentials);
	};
	HostScope.prototype.downlink = function () {
	  return new DownlinkBuilder(this.channel, this).host(this.hostUri);
	};
	HostScope.prototype.link = function (nodeUri, laneUri, options) {
	  var downlink = this.channel.link(Client.resolveNodeUri(this.hostUri, nodeUri), laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	HostScope.prototype.sync = function (nodeUri, laneUri, options) {
	  var downlink = this.channel.sync(Client.resolveNodeUri(this.hostUri, nodeUri), laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	HostScope.prototype.syncList = function (nodeUri, laneUri, options) {
	  var downlink = this.channel.syncList(Client.resolveNodeUri(this.hostUri, nodeUri), laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	HostScope.prototype.syncMap = function (nodeUri, laneUri, options) {
	  var downlink = this.channel.syncMap(Client.resolveNodeUri(this.hostUri, nodeUri), laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	HostScope.prototype.command = function (nodeUri, laneUri, body) {
	  this.channel.command(Client.resolveNodeUri(this.hostUri, nodeUri), laneUri, body);
	};
	HostScope.prototype.node = function (nodeUri) {
	  return new NodeScope(this.channel, this.hostUri, Client.resolveNodeUri(this.hostUri, nodeUri));
	};
	HostScope.prototype.lane = function (nodeUri, laneUri) {
	  return new LaneScope(this.channel, this.hostUri, Client.resolveNodeUri(this.hostUri, nodeUri), laneUri);
	};


	function NodeScope(channel, hostUri, nodeUri) {
	  Scope.call(this, channel);
	  Object.defineProperty(this, 'hostUri', {value: hostUri, enumerable: true});
	  Object.defineProperty(this, 'nodeUri', {value: nodeUri, enumerable: true});
	  Object.defineProperty(this, 'downlinks', {value: [], configurable: true});
	}
	NodeScope.prototype = Object.create(Scope.prototype);
	NodeScope.prototype.constructor = NodeScope;
	NodeScope.prototype.downlink = function () {
	  return new DownlinkBuilder(this.channel, this).host(this.hostUri).node(this.nodeUri);
	};
	NodeScope.prototype.link = function (laneUri, options) {
	  var downlink = this.channel.link(this.nodeUri, laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	NodeScope.prototype.sync = function (laneUri, options) {
	  var downlink = this.channel.sync(this.nodeUri, laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	NodeScope.prototype.syncList = function (laneUri, options) {
	  var downlink = this.channel.syncList(this.nodeUri, laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	NodeScope.prototype.syncMap = function (laneUri, options) {
	  var downlink = this.channel.syncMap(this.nodeUri, laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	NodeScope.prototype.command = function (laneUri, body) {
	  this.channel.command(this.nodeUri, laneUri, body);
	};
	NodeScope.prototype.lane = function (laneUri) {
	  return new LaneScope(this.channel, this.hostUri, this.nodeUri, laneUri);
	};


	function LaneScope(channel, hostUri, nodeUri, laneUri) {
	  Scope.call(this, channel);
	  Object.defineProperty(this, 'hostUri', {value: hostUri, enumerable: true});
	  Object.defineProperty(this, 'nodeUri', {value: nodeUri, enumerable: true});
	  Object.defineProperty(this, 'laneUri', {value: laneUri, enumerable: true});
	  Object.defineProperty(this, 'downlinks', {value: [], configurable: true});
	}
	LaneScope.prototype = Object.create(Scope.prototype);
	LaneScope.prototype.constructor = LaneScope;
	LaneScope.prototype.downlink = function () {
	  return new DownlinkBuilder(this.channel, this).host(this.hostUri).node(this.nodeUri).lane(this.laneUri);
	};
	LaneScope.prototype.link = function (options) {
	  var downlink = this.channel.link(this.nodeUri, this.laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	LaneScope.prototype.sync = function (options) {
	  var downlink = this.channel.sync(this.nodeUri, this.laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	LaneScope.prototype.syncList = function (options) {
	  var downlink = this.channel.syncList(this.nodeUri, this.laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	LaneScope.prototype.syncMap = function (options) {
	  var downlink = this.channel.syncMap(this.nodeUri, this.laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	LaneScope.prototype.command = function (body) {
	  this.channel.command(this.nodeUri, this.laneUri, body);
	};


	function Channel(client, hostUri, options) {
	  options = options || {};
	  Object.defineProperty(this, 'client', {value: client, configurable: true});
	  Object.defineProperty(this, 'hostUri', {value: hostUri, enumerable: true});
	  Object.defineProperty(this, 'options', {value: options, enumerable: true});
	  Object.defineProperty(this, 'credentials', {value: options.credentials, writable: true});
	  Object.defineProperty(this, 'isAuthorized', {value: false, enumerable: true, writable: true});
	  Object.defineProperty(this, 'session', {value: null, enumerable: true, writable: true});
	  Object.defineProperty(this, 'uriCache', {value: new UriCache(hostUri), configurable: true});
	  Object.defineProperty(this, 'delegates', {value: [], configurable: true});
	  Object.defineProperty(this, 'downlinks', {value: {}, configurable: true});
	  Object.defineProperty(this, 'sendBuffer', {value: [], configurable: true});
	  Object.defineProperty(this, 'reconnectTimer', {value: null, writable: true});
	  Object.defineProperty(this, 'reconnectTimeout', {value: 0, writable: true});
	  Object.defineProperty(this, 'idleTimer', {value: null, writable: true});
	  Object.defineProperty(this, 'socket', {value: null, writable: true});
	}
	Object.defineProperty(Channel.prototype, 'protocols', {
	  get: function () {
	    return this.options.protocols;
	  }
	});
	Object.defineProperty(Channel.prototype, 'maxReconnectTimeout', {
	  get: function () {
	    return this.options.maxReconnectTimeout || 30000;
	  }
	});
	Object.defineProperty(Channel.prototype, 'idleTimeout', {
	  get: function () {
	    return this.options.idleTimeout || 1000;
	  }
	});
	Object.defineProperty(Channel.prototype, 'sendBufferSize', {
	  get: function () {
	    return this.options.sendBufferSize || 1024;
	  }
	});
	Channel.prototype.resolve = function (unresolvedUri) {
	  return this.uriCache.resolve(unresolvedUri);
	};
	Channel.prototype.unresolve = function (resolvedUri) {
	  return this.uriCache.unresolve(resolvedUri);
	};
	Channel.prototype.authorize = function (credentials) {
	  if (recon.equal(credentials, this.credentials)) return;
	  this.credentials = credentials;
	  if (this.isConnected) {
	    var request = new proto.AuthRequest(credentials);
	    this.push(request);
	  } else {
	    this.open();
	  }
	};
	Channel.prototype.link = function (nodeUri, laneUri, options) {
	  var downlink = new LinkedDownlink(this, this.hostUri, nodeUri, laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	Channel.prototype.sync = function (nodeUri, laneUri, options) {
	  var downlink = new SyncedDownlink(this, this.hostUri, nodeUri, laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	Channel.prototype.syncList = function (nodeUri, laneUri, options) {
	  var downlink = new ListDownlink(this, this.hostUri, nodeUri, laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	Channel.prototype.syncMap = function (nodeUri, laneUri, options) {
	  var downlink = new MapDownlink(this, this.hostUri, nodeUri, laneUri, options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	Channel.prototype.command = function (nodeUri, laneUri, body) {
	  var message = new proto.CommandMessage(this.unresolve(nodeUri), laneUri, body);
	  this.push(message);
	};
	Channel.prototype.registerDelegate = function (delegate) {
	  this.delegates.push(delegate);
	};
	Channel.prototype.unregisterDelegate = function (delegate) {
	  for (var i = 0, n = this.delegates.length; i < n; i += 1) {
	    if (this.delegates[i] === delegate) {
	      this.delegates.splice(i, 1);
	    }
	  }
	};
	Channel.prototype.registerDownlink = function (downlink) {
	  this.clearIdle();
	  var nodeUri = downlink.nodeUri;
	  var laneUri = downlink.laneUri;
	  var nodeDownlinks = this.downlinks[nodeUri] || {};
	  var laneDownlinks = nodeDownlinks[laneUri] || [];
	  laneDownlinks.push(downlink);
	  nodeDownlinks[laneUri] = laneDownlinks;
	  this.downlinks[nodeUri] = nodeDownlinks;
	  if (this.isConnected) {
	    downlink.onChannelConnect({hostUri: this.hostUri});
	  } else {
	    this.open();
	  }
	};
	Channel.prototype.unregisterDownlink = function (downlink) {
	  var nodeUri = downlink.nodeUri;
	  var laneUri = downlink.laneUri;
	  var nodeDownlinks = this.downlinks[nodeUri];
	  if (nodeDownlinks) {
	    var laneDownlinks = nodeDownlinks[laneUri];
	    if (laneDownlinks) {
	      for (var i = 0, n = laneDownlinks.length; i < n; i += 1) {
	        if (laneDownlinks[i] === downlink) {
	          laneDownlinks.splice(i, 1);
	          if (laneDownlinks.length === 0) {
	            delete nodeDownlinks[laneUri];
	            if (Object.keys(nodeDownlinks).length === 0) {
	              delete this.downlinks[nodeUri];
	              this.watchIdle();
	            }
	            if (this.isConnected) {
	              var request = new proto.UnlinkRequest(this.unresolve(nodeUri), laneUri);
	              downlink.onUnlinkRequest(request);
	              this.push(request);
	            }
	          }
	          downlink.onChannelClose();
	        }
	      }
	    }
	  }
	};
	Channel.prototype.onEnvelope = function (envelope) {
	  if (envelope.isEventMessage) {
	    this.onEventMessage(envelope);
	  } else if (envelope.isCommandMessage) {
	    this.onCommandMessage(envelope);
	  } else if (envelope.isLinkRequest) {
	    this.onLinkRequest(envelope);
	  } else if (envelope.isLinkedResponse) {
	    this.onLinkedResponse(envelope);
	  } else if (envelope.isSyncRequest) {
	    this.onSyncRequest(envelope);
	  } else if (envelope.isSyncedResponse) {
	    this.onSyncedResponse(envelope);
	  } else if (envelope.isUnlinkRequest) {
	    this.onUnlinkRequest(envelope);
	  } else if (envelope.isUnlinkedResponse) {
	    this.onUnlinkedResponse(envelope);
	  } else if (envelope.isAuthRequest) {
	    this.onAuthRequest(envelope);
	  } else if (envelope.isAuthedResponse) {
	    this.onAuthedResponse(envelope);
	  } else if (envelope.isDeauthRequest) {
	    this.onDeauthRequest(envelope);
	  } else if (envelope.isDeauthedResponse) {
	    this.onDeauthedResponse(envelope);
	  }
	};
	Channel.prototype.onEventMessage = function (message) {
	  var nodeUri = this.resolve(message.node);
	  var laneUri = message.lane;
	  var nodeDownlinks = this.downlinks[nodeUri];
	  if (nodeDownlinks) {
	    var laneDownlinks = nodeDownlinks[laneUri];
	    if (laneDownlinks) {
	      var resolvedMessage = message.withAddress(nodeUri);
	      for (var i = 0, n = laneDownlinks.length; i < n; i += 1) {
	        var downlink = laneDownlinks[i];
	        downlink.onEventMessage(resolvedMessage);
	      }
	    }
	  }
	};
	Channel.prototype.onCommandMessage = function (message) {
	  // TODO: Support client services.
	};
	Channel.prototype.onLinkRequest = function (request) {
	  // TODO: Support client services.
	};
	Channel.prototype.onLinkedResponse = function (response) {
	  var nodeUri = this.resolve(response.node);
	  var laneUri = response.lane;
	  var nodeDownlinks = this.downlinks[nodeUri];
	  if (nodeDownlinks) {
	    var laneDownlinks = nodeDownlinks[laneUri];
	    if (laneDownlinks) {
	      var resolvedResponse = response.withAddress(nodeUri);
	      for (var i = 0, n = laneDownlinks.length; i < n; i += 1) {
	        var downlink = laneDownlinks[i];
	        downlink.onLinkedResponse(resolvedResponse);
	      }
	    }
	  }
	};
	Channel.prototype.onSyncRequest = function (request) {
	  // TODO: Support client services.
	};
	Channel.prototype.onSyncedResponse = function (response) {
	  var nodeUri = this.resolve(response.node);
	  var laneUri = response.lane;
	  var nodeDownlinks = this.downlinks[nodeUri];
	  if (nodeDownlinks) {
	    var laneDownlinks = nodeDownlinks[laneUri];
	    if (laneDownlinks) {
	      var resolvedResponse = response.withAddress(nodeUri);
	      for (var i = 0, n = laneDownlinks.length; i < n; i += 1) {
	        var downlink = laneDownlinks[i];
	        downlink.onSyncedResponse(resolvedResponse);
	      }
	    }
	  }
	};
	Channel.prototype.onUnlinkRequest = function (request) {
	  // TODO: Support client services.
	};
	Channel.prototype.onUnlinkedResponse = function (response) {
	  var nodeUri = this.resolve(response.node);
	  var laneUri = response.lane;
	  var nodeDownlinks = this.downlinks[nodeUri];
	  if (nodeDownlinks) {
	    var laneDownlinks = nodeDownlinks[laneUri];
	    if (laneDownlinks) {
	      delete nodeDownlinks[laneUri];
	      if (Object.keys(nodeDownlinks).length === 0) {
	        delete this.downlinks[nodeUri];
	      }
	      var resolvedResponse = response.withAddress(nodeUri);
	      for (var i = 0, n = laneDownlinks.length; i < n; i += 1) {
	        var downlink = laneDownlinks[i];
	        downlink.onUnlinkedResponse(resolvedResponse);
	        downlink.onChannelClose();
	      }
	    }
	  }
	};
	Channel.prototype.onAuthRequest = function (request) {
	  // TODO: Support client services.
	};
	Channel.prototype.onAuthedResponse = function (response) {
	  this.isAuthorized = true;
	  this.session = response.body;
	  var info = {hostUri: this.hostUri, session: this.session};
	  this.client.onChannelAuthorize(info);
	  for (var i = 0, n = this.delegates.length; i < n; i += 1) {
	    var delegate = this.delegates[i];
	    delegate.onChannelAuthorize(info);
	  }
	};
	Channel.prototype.onDeauthRequest = function (request) {
	  // TODO: Support client services.
	};
	Channel.prototype.onDeauthedResponse = function (response) {
	  this.isAuthorized = false;
	  this.session = null;
	  var info = {hostUri: this.hostUri, session: response.body};
	  this.client.onChannelDeauthorize(info);
	  for (var i = 0, n = this.delegates.length; i < n; i += 1) {
	    var delegate = this.delegates[i];
	    delegate.onChannelDeauthorize(info);
	  }
	};
	Channel.prototype.onConnect = function () {
	  var info = {hostUri: this.hostUri};
	  this.client.onChannelConnect(info);
	  for (var i = 0, n = this.delegates.length; i < n; i += 1) {
	    var delegate = this.delegates[i];
	    delegate.onChannelConnect(info);
	  }
	  for (var nodeUri in this.downlinks) {
	    var nodeDownlinks = this.downlinks[nodeUri];
	    for (var laneUri in nodeDownlinks) {
	      var laneDownlinks = nodeDownlinks[laneUri];
	      for (i = 0, n = laneDownlinks.length; i < n; i += 1) {
	        var downlink = laneDownlinks[i];
	        downlink.onChannelConnect(info);
	      }
	    }
	  }
	};
	Channel.prototype.onDisconnect = function () {
	  var info = {hostUri: this.hostUri};
	  this.client.onChannelDisconnect(info);
	  for (var i = 0, n = this.delegates.length; i < n; i += 1) {
	    var delegate = this.delegates[i];
	    delegate.onChannelDisconnect(info);
	  }
	  for (var nodeUri in this.downlinks) {
	    var nodeDownlinks = this.downlinks[nodeUri];
	    for (var laneUri in nodeDownlinks) {
	      var laneDownlinks = nodeDownlinks[laneUri].slice();
	      for (i = 0, n = laneDownlinks.length; i < n; i += 1) {
	        var downlink = laneDownlinks[i];
	        downlink.onChannelDisconnect(info);
	      }
	    }
	  }
	};
	Channel.prototype.onError = function () {
	  var info = {hostUri: this.hostUri};
	  this.client.onChannelError(info);
	  for (var i = 0, n = this.delegates.length; i < n; i += 1) {
	    var delegate = this.delegates[i];
	    delegate.onChannelError(info);
	  }
	  for (var nodeUri in this.downlinks) {
	    var nodeDownlinks = this.downlinks[nodeUri];
	    for (var laneUri in nodeDownlinks) {
	      var laneDownlinks = nodeDownlinks[laneUri];
	      for (i = 0, n = laneDownlinks.length; i < n; i += 1) {
	        var downlink = laneDownlinks[i];
	        downlink.onChannelError(info);
	      }
	    }
	  }
	};
	Channel.prototype.reconnect = function () {
	  if (this.reconnectTimer) return;
	  if (!this.reconnectTimeout) {
	    var jitter = 1000 * Math.random();
	    this.reconnectTimeout = 500 + jitter;
	  } else {
	    var maxReconnectTimeout = this.maxReconnectTimeout || 30000;
	    this.reconnectTimeout = Math.min(1.8 * this.reconnectTimeout, maxReconnectTimeout);
	  }
	  this.reconnectTimer = setTimeout(this.open.bind(this), this.reconnectTimeout);
	};
	Channel.prototype.clearReconnect = function () {
	  if (this.reconnectTimer) {
	    clearTimeout(this.reconnectTimer);
	    this.reconnectTimer = null;
	    this.reconnectTimeout = 0;
	  }
	};
	Channel.prototype.clearIdle = function () {
	  if (this.idleTimer) {
	    clearTimeout(this.idleTimer);
	    this.idleTimer = null;
	  }
	};
	Channel.prototype.watchIdle = function () {
	  if (this.isConnected && this.sendBuffer.length === 0 && Object.keys(this.downlinks).length === 0) {
	    this.idleTimer = setTimeout(this.checkIdle.bind(this), this.idleTimeout);
	  }
	};
	Channel.prototype.checkIdle = function () {
	  if (this.sendBuffer.length === 0 && Object.keys(this.downlinks).length === 0) {
	    this.close();
	  }
	};
	Channel.prototype.close = function () {
	  var downlinks = this.downlinks;
	  Object.defineProperty(this, 'downlinks', {value: {}, configurable: true});
	  for (var nodeUri in downlinks) {
	    var nodeDownlinks = downlinks[nodeUri];
	    for (var laneUri in nodeDownlinks) {
	      var laneDownlinks = nodeDownlinks[laneUri];
	      for (var i = 0, n = laneDownlinks.length; i < n; i += 1) {
	        var downlink = laneDownlinks[i];
	        downlink.onChannelClose();
	      }
	    }
	  }
	};


	function WebSocketChannel(client, hostUri, options) {
	  Channel.call(this, client, hostUri, options);
	}
	WebSocketChannel.prototype = Object.create(Channel.prototype);
	WebSocketChannel.prototype.constructor = WebSocketChannel;
	Object.defineProperty(WebSocketChannel.prototype, 'isConnected', {
	  get: function () {
	    return this.socket && this.socket.readyState === this.socket.OPEN;
	  },
	  enumerable: true
	});
	WebSocketChannel.prototype.open = function () {
	  this.clearReconnect();
	  if (!this.socket) {
	    this.socket = this.protocols ?
	      new WebSocket(this.hostUri, this.protocols) :
	      new WebSocket(this.hostUri);
	    this.socket.onopen = this.onWebSocketOpen.bind(this);
	    this.socket.onmessage = this.onWebSocketMessage.bind(this);
	    this.socket.onerror = this.onWebSocketError.bind(this);
	    this.socket.onclose = this.onWebSocketClose.bind(this);
	  }
	};
	WebSocketChannel.prototype.close = function () {
	  this.clearReconnect();
	  this.clearIdle();
	  if (this.socket) {
	    this.socket.close();
	    this.socket = null;
	  }
	  Channel.prototype.close.call(this);
	};
	WebSocketChannel.prototype.push = function (envelope) {
	  if (this.isConnected) {
	    this.clearIdle();
	    var text = proto.stringify(envelope);
	    this.socket.send(text);
	    this.watchIdle();
	  } else if (envelope.isCommandMessage) {
	    if (this.sendBuffer.length < this.sendBufferSize) {
	      this.sendBuffer.push(envelope);
	    } else {
	      // TODO
	    }
	    this.open();
	  }
	};
	WebSocketChannel.prototype.onWebSocketOpen = function () {
	  if (this.credentials) {
	    var request = new proto.AuthRequest(this.credentials);
	    this.push(request);
	  }
	  this.onConnect();
	  var envelope;
	  while ((envelope = this.sendBuffer.shift())) {
	    this.push(envelope);
	  }
	  this.watchIdle();
	};
	WebSocketChannel.prototype.onWebSocketMessage = function (message) {
	  var data = message.data;
	  if (typeof data === 'string') {
	    var envelope = proto.parse(data);
	    if (envelope) {
	      this.onEnvelope(envelope);
	    }
	  }
	};
	WebSocketChannel.prototype.onWebSocketError = function () {
	  this.onError();
	  this.clearIdle();
	  if (this.socket) {
	    this.socket.onopen = null;
	    this.socket.onmessage = null;
	    this.socket.onerror = null;
	    this.socket.onclose = null;
	    this.socket.close();
	    this.socket = null;
	  }
	};
	WebSocketChannel.prototype.onWebSocketClose = function () {
	  this.isAuthorized = false;
	  this.session = null;
	  this.socket = null;
	  this.onDisconnect();
	  this.clearIdle();
	  if (this.sendBuffer.length > 0 || Object.keys(this.downlinks).length > 0) {
	    this.reconnect();
	  }
	};


	function HttpSocketChannel(client, hostUri, options) {
	  Channel.call(this, client, hostUri, options);
	  Object.defineProperty(this, 'channelId', {value: null, writable: true});
	  Object.defineProperty(this, 'parser', {value: null, writable: true});
	  Object.defineProperty(this, 'offset', {value: 0, writable: true});
	  Object.defineProperty(this, 'sendTimer', {value: null, writable: true});
	}
	HttpSocketChannel.prototype = Object.create(Channel.prototype);
	HttpSocketChannel.prototype.constructor = HttpSocketChannel;
	Object.defineProperty(HttpSocketChannel.prototype, 'sendDelay', {
	  get: function () {
	    return this.options.sendDelay || 100;
	  }
	});
	Object.defineProperty(HttpSocketChannel.prototype, 'isConnected', {
	  get: function () {
	    return this.socket && this.socket.readyState >= 1;
	  },
	  enumerable: true
	});
	HttpSocketChannel.prototype.throttleSend = function () {
	  if (!this.sendTimer) {
	    this.sendTimer = setTimeout(this.send.bind(this), this.sendDelay);
	  }
	};
	HttpSocketChannel.prototype.clearSend = function () {
	  if (this.sendTimer) {
	    clearTimeout(this.sendTimer);
	    this.sendTimer = null;
	  }
	};
	HttpSocketChannel.prototype.open = function () {
	  this.clearReconnect();
	  if (!this.socket) {
	    this.socket = new XMLHttpRequest();
	    this.socket.open('POST', this.hostUri);
	    this.socket.onreadystatechange = this.onHttpSocketChange.bind(this);
	    this.socket.onloadstart = this.onHttpSocketOpen.bind(this);
	    this.socket.onprogress = this.onHttpSocketData.bind(this);
	    this.socket.onload = this.onHttpSocketData.bind(this);
	    this.socket.onerror = this.onHttpSocketError.bind(this);
	    this.socket.onloadend = this.onHttpSocketClose.bind(this);
	    this.socket.setRequestHeader('X-Swim-Connection', 'Upgrade');
	    this.socket.send();
	  }
	};
	HttpSocketChannel.prototype.close = function () {
	  this.clearReconnect();
	  this.clearIdle();
	  this.clearSend();
	  if (this.socket) {
	    this.socket.abort();
	    this.socket = null;
	  }
	  Channel.prototype.close.call(this);
	};
	HttpSocketChannel.prototype.send = function () {
	  this.clearSend();
	  if (!this.channelId) {
	    this.throttleSend();
	    return;
	  }
	  var request = new XMLHttpRequest();
	  request.open('POST', this.hostUri);
	  request.setRequestHeader('X-Swim-Channel', this.channelId);
	  this.watchIdle();
	  var body = '';
	  var envelope;
	  while ((envelope = this.sendBuffer.shift())) {
	    body = body + proto.stringify(envelope) + '\n';
	  }
	  request.send(body);
	};
	HttpSocketChannel.prototype.push = function (envelope) {
	  if (this.isConnected) {
	    this.clearIdle();
	    this.sendBuffer.push(envelope);
	    this.throttleSend();
	  } else if (envelope.isCommandMessage) {
	    if (this.sendBuffer.length < this.sendBufferSize) {
	      this.sendBuffer.push(envelope);
	    } else {
	      // TODO
	    }
	    this.open();
	  }
	};
	HttpSocketChannel.prototype.onHttpSocketOpen = function () {
	  this.parser = new recon.BlockParser();
	  this.offset = 0;
	  this.onConnect();
	  this.watchIdle();
	};
	HttpSocketChannel.prototype.onHttpSocketChange = function () {
	  if (this.socket.readyState === 2) {
	    this.channelId = this.socket.getResponseHeader('X-Swim-Channel');
	    if (!this.channelId) {
	      this.socket.abort();
	    }
	  }
	}
	HttpSocketChannel.prototype.onHttpSocketData = function () {
	  var input = new LineIterator(this.socket.responseText, this.offset, true);
	  while ((!input.isInputEmpty() || input.isInputDone()) && this.parser.isCont()) {
	    var next = this.parser;
	    while ((!input.isEmpty() || input.isDone()) && next.isCont()) {
	      next = next.feed(input);
	    }
	    if (!input.isInputEmpty() && input.head() === 10/*'\n'*/) {
	      input.step();
	    }
	    this.offset = input.index;
	    if (next.isDone()) {
	      var envelope = proto.decode(next.state());
	      if (envelope) {
	        this.onEnvelope(envelope);
	      }
	      this.parser = new recon.BlockParser();
	    } else if (next.isError()) {
	      // TODO
	      this.parser = new recon.BlockParser();
	      break;
	    } else {
	      this.parser = next;
	    }
	  }
	};
	HttpSocketChannel.prototype.onHttpSocketError = function () {
	  this.onError();
	  this.clearIdle();
	};
	HttpSocketChannel.prototype.onHttpSocketClose = function () {
	  this.isAuthorized = false;
	  this.session = null;
	  this.socket = null;
	  this.onDisconnect();
	  this.clearIdle();
	  if (this.sendBuffer.length > 0 || Object.keys(this.downlinks).length > 0) {
	    this.reconnect();
	  }
	};


	function LineIterator(string, index, more) {
	  recon.StringIterator.call(this, string, index, more);
	}
	LineIterator.prototype = Object.create(recon.StringIterator.prototype);
	LineIterator.prototype.constructor = LineIterator;
	LineIterator.prototype.isDone = function () {
	  return this.index >= this.string.length && !this.more ||
	    this.index < this.string.length && this.head() === 10 /*'\n'*/;
	};
	LineIterator.prototype.isEmpty = function () {
	  return this.index >= this.string.length || this.head() === 10 /*'\n'*/;
	};
	LineIterator.prototype.isInputDone = function () {
	  return recon.StringIterator.prototype.isDone.call(this);
	};
	LineIterator.prototype.isInputEmpty = function () {
	  return recon.StringIterator.prototype.isEmpty.call(this);
	};


	function DownlinkBuilder(channel, scope) {
	  Object.defineProperty(this, 'channel', {value: channel, configurable: true});
	  Object.defineProperty(this, 'scope', {value: scope, configurable: true});
	  Object.defineProperty(this, 'proxy', {value: {}, configurable: true});
	  this.options = {};
	}
	DownlinkBuilder.prototype.host = function (hostUri) {
	  if (!arguments.length) return this.hostUri;
	  this.hostUri = hostUri;
	  return this;
	};
	DownlinkBuilder.prototype.node = function (nodeUri) {
	  if (!arguments.length) return this.nodeUri;
	  this.nodeUri = nodeUri;
	  return this;
	};
	DownlinkBuilder.prototype.lane = function (laneUri) {
	  if (!arguments.length) return this.laneUri;
	  this.laneUri = laneUri;
	  return this;
	};
	DownlinkBuilder.prototype.prio = function (prio) {
	  if (!arguments.length) return this.options.prio;
	  this.options.prio = prio;
	  return this;
	};
	DownlinkBuilder.prototype.keepAlive = function (keepAlive) {
	  if (!arguments.length) return this.options.keepAlive;
	  this.options.keepAlive = keepAlive;
	  return this;
	};
	DownlinkBuilder.prototype.delegate = function (delegate) {
	  if (!arguments.length) return this.options.delegate;
	  this.options.delegate = delegate;
	  return this;
	};
	DownlinkBuilder.prototype.onEvent = function (callback) {
	  if (!arguments.length) return this.proxy.onEvent;
	  this.proxy.onEvent = callback;
	  return this;
	};
	DownlinkBuilder.prototype.onCommand = function (callback) {
	  if (!arguments.length) return this.proxy.onCommand;
	  this.proxy.onCommand = callback;
	  return this;
	};
	DownlinkBuilder.prototype.onLink = function (callback) {
	  if (!arguments.length) return this.proxy.onLink;
	  this.proxy.onLink = callback;
	  return this;
	};
	DownlinkBuilder.prototype.onLinked = function (callback) {
	  if (!arguments.length) return this.proxy.onLinked;
	  this.proxy.onLinked = callback;
	  return this;
	};
	DownlinkBuilder.prototype.onSync = function (callback) {
	  if (!arguments.length) return this.proxy.onSync;
	  this.proxy.onSync = callback;
	  return this;
	};
	DownlinkBuilder.prototype.onSynced = function (callback) {
	  if (!arguments.length) return this.proxy.onSynced;
	  this.proxy.onSynced = callback;
	  return this;
	};
	DownlinkBuilder.prototype.onUnlink = function (callback) {
	  if (!arguments.length) return this.proxy.onUnlink;
	  this.proxy.onUnlink = callback;
	  return this;
	};
	DownlinkBuilder.prototype.onUnlinked = function (callback) {
	  if (!arguments.length) return this.proxy.onUnlinked;
	  this.proxy.onUnlinked = callback;
	  return this;
	};
	DownlinkBuilder.prototype.onConnect = function (callback) {
	  if (!arguments.length) return this.proxy.onConnect;
	  this.proxy.onConnect = callback;
	  return this;
	};
	DownlinkBuilder.prototype.onDisconnect = function (callback) {
	  if (!arguments.length) return this.proxy.onDisconnect;
	  this.proxy.onDisconnect = callback;
	  return this;
	};
	DownlinkBuilder.prototype.onError = function (callback) {
	  if (!arguments.length) return this.proxy.onError;
	  this.proxy.onError = callback;
	  return this;
	};
	DownlinkBuilder.prototype.onClose = function (callback) {
	  if (!arguments.length) return this.proxy.onClose;
	  this.proxy.onClose = callback;
	  return this;
	};
	DownlinkBuilder.prototype.primaryKey = function (primaryKey) {
	  if (!arguments.length) return this.options.primaryKey;
	  this.options.primaryKey = primaryKey;
	  return this;
	};
	DownlinkBuilder.prototype.sortBy = function (sortBy) {
	  if (!arguments.length) return this.options.sortBy;
	  this.options.sortBy = sortBy;
	  return this;
	};
	Object.defineProperty(DownlinkBuilder.prototype, 'normalize', {
	  value: function () {
	    if (this.hostUri) {
	      this.nodeUri = Client.resolveNodeUri(this.hostUri, this.nodeUri);
	    } else {
	      this.hostUri = Client.extractHostUri(this.nodeUri);
	    }
	    if (!this.channel) {
	      // If channel is null then scope references a Client.
	      Object.defineProperty(this, 'channel', {
	        value: this.scope.getOrCreateChannel(this.hostUri),
	        configurable: true
	      });
	      Object.defineProperty(this, 'scope', {value: null, configurable: true});
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(DownlinkBuilder.prototype, 'registerDownlink', {
	  value: function (downlink) {
	    for (var key in this.proxy) {
	      downlink[key] = this.proxy[key];
	    }
	    this.channel.registerDownlink(downlink);
	    if (this.scope) {
	      this.scope.registerDownlink(downlink);
	    }
	  },
	  configure: true
	});
	DownlinkBuilder.prototype.link = function () {
	  this.normalize();
	  var downlink = new LinkedDownlink(this.channel, this.hostUri, this.nodeUri, this.laneUri, this.options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	DownlinkBuilder.prototype.sync = function () {
	  this.normalize();
	  var downlink = new SyncedDownlink(this.channel, this.hostUri, this.nodeUri, this.laneUri, this.options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	DownlinkBuilder.prototype.syncList = function () {
	  this.normalize();
	  var downlink = new ListDownlink(this.channel, this.hostUri, this.nodeUri, this.laneUri, this.options);
	  this.registerDownlink(downlink);
	  return downlink;
	};
	DownlinkBuilder.prototype.syncMap = function () {
	  this.normalize();
	  var downlink = new MapDownlink(this.channel, this.hostUri, this.nodeUri, this.laneUri, this.options);
	  this.registerDownlink(downlink);
	  return downlink;
	};


	function Downlink(channel, hostUri, nodeUri, laneUri, options) {
	  options = options || {};
	  Object.defineProperty(this, 'channel', {value: channel});
	  Object.defineProperty(this, 'hostUri', {value: hostUri, enumerable: true});
	  Object.defineProperty(this, 'nodeUri', {value: nodeUri, enumerable: true});
	  Object.defineProperty(this, 'laneUri', {value: laneUri, enumerable: true});
	  Object.defineProperty(this, 'options', {value: options, enumerable: true});
	  Object.defineProperty(this, 'delegate', {value: options.delegate || this, enumerable: true, writable: true});
	}
	Object.defineProperty(Downlink.prototype, 'prio', {
	  get: function () {
	    return this.options.prio || 0.0;
	  }
	});
	Object.defineProperty(Downlink.prototype, 'keepAlive', {
	  get: function () {
	    return this.options.keepAlive || false;
	  },
	  set: function (keepAlive) {
	    this.options.keepAlive = keepAlive;
	  }
	});
	Object.defineProperty(Downlink.prototype, 'isConnected', {
	  get: function () {
	    return this.channel.isConnected;
	  },
	  enumerable: true
	});
	Object.defineProperty(Downlink.prototype, 'isAuthorized', {
	  get: function () {
	    return this.channel.isAuthorized;
	  },
	  enumerable: true
	});
	Object.defineProperty(Downlink.prototype, 'session', {
	  get: function () {
	    return this.channel.session;
	  },
	  enumerable: true
	});
	Object.defineProperty(Downlink.prototype, 'onEventMessage', {
	  value: function (message) {
	    if (typeof this.delegate.onEvent === 'function') {
	      this.delegate.onEvent(message);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Downlink.prototype, 'onCommandMessage', {
	  value: function (message) {
	    if (typeof this.delegate.onCommand === 'function') {
	      this.delegate.onCommand(message);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Downlink.prototype, 'onLinkRequest', {
	  value: function (request) {
	    if (typeof this.delegate.onLink === 'function') {
	      this.delegate.onLink(request);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Downlink.prototype, 'onLinkedResponse', {
	  value: function (response) {
	    if (typeof this.delegate.onLinked === 'function') {
	      this.delegate.onLinked(response);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Downlink.prototype, 'onSyncRequest', {
	  value: function (request) {
	    if (typeof this.delegate.onSync === 'function') {
	      this.delegate.onSync(request);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Downlink.prototype, 'onSyncedResponse', {
	  value: function (response) {
	    if (typeof this.delegate.onSynced === 'function') {
	      this.delegate.onSynced(response);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Downlink.prototype, 'onUnlinkRequest', {
	  value: function (request) {
	    if (typeof this.delegate.onUnlink === 'function') {
	      this.delegate.onUnlink(request);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Downlink.prototype, 'onUnlinkedResponse', {
	  value: function (response) {
	    if (typeof this.delegate.onUnlinked === 'function') {
	      this.delegate.onUnlinked(response);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Downlink.prototype, 'onChannelConnect', {
	  value: function (info) {
	    if (typeof this.delegate.onConnect === 'function') {
	      this.delegate.onConnect(info);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Downlink.prototype, 'onChannelDisconnect', {
	  value: function (info) {
	    if (typeof this.delegate.onDisconnect === 'function') {
	      this.delegate.onDisconnect(info);
	    }
	    if (!this.keepAlive) {
	      this.close();
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Downlink.prototype, 'onChannelError', {
	  value: function (info) {
	    if (typeof this.delegate.onError === 'function') {
	      this.delegate.onError(info);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(Downlink.prototype, 'onChannelClose', {
	  value: function () {
	    if (typeof this.delegate.onClose === 'function') {
	      this.delegate.onClose();
	    }
	  },
	  configurable: true
	});
	Downlink.prototype.command = function (body) {
	  this.channel.command(this.nodeUri, this.laneUri, body);
	};
	Downlink.prototype.close = function () {
	  this.channel.unregisterDownlink(this);
	};


	function LinkedDownlink(channel, hostUri, nodeUri, laneUri, options) {
	  Downlink.call(this, channel, hostUri, nodeUri, laneUri, options);
	}
	LinkedDownlink.prototype = Object.create(Downlink.prototype);
	LinkedDownlink.prototype.constructor = LinkedDownlink;
	Object.defineProperty(LinkedDownlink.prototype, 'onChannelConnect', {
	  value: function (info) {
	    Downlink.prototype.onChannelConnect.call(this, info);
	    var nodeUri = this.channel.unresolve(this.nodeUri);
	    var request = new proto.LinkRequest(nodeUri, this.laneUri, this.prio);
	    this.onLinkRequest(request);
	    this.channel.push(request);
	  },
	  configurable: true
	});


	function SyncedDownlink(channel, hostUri, nodeUri, laneUri, options) {
	  Downlink.call(this, channel, hostUri, nodeUri, laneUri, options);
	}
	SyncedDownlink.prototype = Object.create(Downlink.prototype);
	SyncedDownlink.prototype.constructor = SyncedDownlink;
	Object.defineProperty(SyncedDownlink.prototype, 'onChannelConnect', {
	  value: function (info) {
	    Downlink.prototype.onChannelConnect.call(this, info);
	    var nodeUri = this.channel.unresolve(this.nodeUri);
	    var request = new proto.SyncRequest(nodeUri, this.laneUri, this.prio);
	    this.onSyncRequest(request);
	    this.channel.push(request);
	  },
	  configurable: true
	});


	function ListDownlink(channel, hostUri, nodeUri, laneUri, options) {
	  SyncedDownlink.call(this, channel, hostUri, nodeUri, laneUri, options);
	  Object.defineProperty(this, 'state', {value: [], configurable: true});
	}
	ListDownlink.prototype = Object.create(SyncedDownlink.prototype);
	ListDownlink.prototype.constructor = ListDownlink;
	Object.defineProperty(ListDownlink.prototype, 'onEventMessage', {
	  value: function (message) {
	    var tag = recon.tag(message.body);
	    var head, index, value;
	    if (tag === '@update') {
	      head = recon.head(message.body);
	      index = recon.get(head, 'index');
	      value = recon.tail(message.body);
	      this.remoteUpdate(index, value);
	    } else if (tag === '@insert') {
	      head = recon.head(message.body);
	      index = recon.get(head, 'index');
	      value = recon.tail(message.body);
	      this.remoteInsert(index, value);
	    } else if (tag === '@move') {
	      head = recon.head(message.body);
	      var from = recon.get(head, 'from');
	      var to = recon.get(head, 'to');
	      value = recon.tail(message.body);
	      this.remoteMove(from, to, value);
	    } else if (tag === '@remove' || tag === '@delete') {
	      head = recon.head(message.body);
	      index = recon.get(head, 'index');
	      value = recon.tail(message.body);
	      this.remoteRemove(index, value);
	    } else if (tag === '@clear' && recon.size(message.body) === 1) {
	      this.remoteClear();
	    } else {
	      this.remoteAppend(message.body);
	    }
	    SyncedDownlink.prototype.onEventMessage.call(this, message);
	  },
	  configurable: true
	});
	Object.defineProperty(ListDownlink.prototype, 'remoteAppend', {
	  value: function (value) {
	    this.state.push(value);
	  },
	  configurable: true
	});
	Object.defineProperty(ListDownlink.prototype, 'remoteUpdate', {
	  value: function (index, value) {
	    this.state[index] = value;
	  },
	  configurable: true
	});
	Object.defineProperty(ListDownlink.prototype, 'remoteInsert', {
	  value: function (index, value) {
	    if (!recon.equal(this.state[index], value)) {
	      this.state.splice(index, 0, value);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(ListDownlink.prototype, 'remoteMove', {
	  value: function (fromIndex, toIndex, value) {
	    if (!recon.equal(this.state[toIndex], value)) {
	      this.state.splice(fromIndex, 1);
	      this.state.splice(toIndex, 0, value);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(ListDownlink.prototype, 'remoteRemove', {
	  value: function (index, value) {
	    if (recon.equal(this.state[index], value)) {
	      this.state.splice(index, 1);
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(ListDownlink.prototype, 'remoteClear', {
	  value: function (index, value) {
	    Object.defineProperty(this, 'state', {value: [], configurable: true});
	  },
	  configurable: true
	});
	Object.defineProperty(ListDownlink.prototype, 'length', {
	  get: function () {
	    return this.state.length;
	  },
	  configurable: true,
	  enumerable: true
	});
	ListDownlink.prototype.get = function (index) {
	  return this.state[index];
	};
	ListDownlink.prototype.set = function (index, value) {
	  value = recon(value !== undefined ? value : this.get(index));
	  this.state[index] = value;
	  var nodeUri = this.channel.unresolve(this.nodeUri);
	  var body = recon.concat(recon({'@update': recon({index: index})}), value);
	  var message = new proto.CommandMessage(nodeUri, this.laneUri, body);
	  this.onCommandMessage(message);
	  this.channel.push(message);
	};
	ListDownlink.prototype.push = function () {
	  var nodeUri = this.channel.unresolve(this.nodeUri);
	  for (var i = 0, n = arguments.length; i < n; i += 1) {
	    var value = recon(arguments[i]);
	    this.state.push(value);
	    var message = new proto.CommandMessage(nodeUri, this.laneUri, value);
	    this.onCommandMessage(message);
	    this.channel.push(message);
	  }
	  return this.state.length;
	};
	ListDownlink.prototype.pop = function () {
	  var value = this.state.pop();
	  var index = this.state.length;
	  if (value !== undefined) {
	    var nodeUri = this.channel.unresolve(this.nodeUri);
	    var body = recon.concat(recon({'@remove': recon({index: index})}), value);
	    var message = new proto.CommandMessage(nodeUri, this.laneUri, body);
	    this.onCommandMessage(message);
	    this.channel.push(message);
	  }
	  return value;
	};
	ListDownlink.prototype.unshift = function () {
	  var nodeUri = this.channel.unresolve(this.nodeUri);
	  for (var i = arguments.length - 1; i >= 0; i -= 1) {
	    var value = recon(arguments[i]);
	    this.state.unshift(value);
	    var body = recon.concat(recon({'@insert': recon({index: 0})}), value);
	    var message = new proto.CommandMessage(nodeUri, this.laneUri, body);
	    this.onCommandMessage(message);
	    this.channel.push(message);
	  }
	  return this.state.length;
	};
	ListDownlink.prototype.shift = function () {
	  var value = this.state.shift();
	  if (value !== undefined) {
	    var nodeUri = this.channel.unresolve(this.nodeUri);
	    var body = recon.concat(recon({'@remove': recon({index: 0})}), value);
	    var message = new proto.CommandMessage(nodeUri, this.laneUri, body);
	    this.onCommandMessage(message);
	    this.channel.push(message);
	  }
	  return value;
	};
	ListDownlink.prototype.move = function (fromIndex, toIndex) {
	  var removed = this.state.splice(fromIndex, 1);
	  if (removed.length === 1) {
	    var value = removed[0];
	    this.state.splice(toIndex, 0, value);
	    var nodeUri = this.channel.unresolve(this.nodeUri);
	    var body = recon.concat(recon({'@move': recon({from: fromIndex, to: toIndex})}), value);
	    var message = new proto.CommandMessage(nodeUri, this.laneUri, body);
	    this.onCommandMessage(message);
	    this.channel.push(message);
	  }
	};
	ListDownlink.prototype.splice = function () {
	  var start = arguments[0];
	  var deleteCount = arguments[1];
	  var nodeUri = this.channel.unresolve(this.nodeUri);
	  var removed = [];
	  var i, n, value, body, message;
	  for (i = start; i < start + deleteCount; i += 1) {
	    value = this.state[i];
	    if (value !== undefined) {
	      removed.push(value);
	      this.state.splice(start, 1);
	      body = recon.concat(recon({'@remove': recon({index: start})}), value);
	      message = new proto.CommandMessage(nodeUri, this.laneUri, body);
	      this.onCommandMessage(message);
	      this.channel.push(message);
	    }
	  }
	  for (i = 2, n = arguments.length; i < n; i += 1) {
	    var index = start + i - 2;
	    value = recon(arguments[i]);
	    this.state.splice(index, 0, value);
	    body = recon.concat(recon({'@insert': recon({index: index})}), value);
	    message = new proto.CommandMessage(nodeUri, this.laneUri, body);
	    this.onCommandMessage(message);
	    this.channel.push(message);
	  }
	  return removed;
	};
	ListDownlink.prototype.clear = function () {
	  Object.defineProperty(this, 'state', {value: [], configurable: true});
	  var nodeUri = this.channel.unresolve(this.nodeUri);
	  var message = new proto.CommandMessage(nodeUri, this.laneUri, [{'@clear': null}]);
	  this.onCommandMessage(message);
	  this.channel.push(message);
	  return this;
	};
	ListDownlink.prototype.forEach = function (callback, thisArg) {
	  for (var i = 0, n = this.state.length; i < n; i += 1) {
	    var value = this.state[i];
	    callback.call(thisArg, value, i, this);
	  }
	};


	function MapDownlink(channel, hostUri, nodeUri, laneUri, options) {
	  SyncedDownlink.call(this, channel, hostUri, nodeUri, laneUri, options);
	  Object.defineProperty(this, 'state', {value: [], configurable: true});
	  Object.defineProperty(this, 'table', {value: {}, configurable: true});
	  this.primaryKey = MapDownlink.primaryKeyOption(this.options);
	  this.sortBy = MapDownlink.sortByOption(this.options);
	}
	MapDownlink.prototype = Object.create(SyncedDownlink.prototype);
	MapDownlink.prototype.constructor = MapDownlink;
	Object.defineProperty(MapDownlink.prototype, 'onEventMessage', {
	  value: function (message) {
	    var tag = recon.tag(message.body);
	    var head, key, value;
	    if (tag === '@update') {
	      head = recon.head(message.body);
	      key = recon.get(head, 'key');
	      value = recon.tail(message.body);
	      this.remoteSet(key, value);
	    } else if (tag === '@remove' || tag === '@delete') {
	      head = recon.head(message.body);
	      key = recon.get(head, 'key');
	      if (key === undefined && this.primaryKey) {
	        key = this.primaryKey(message.body);
	      }
	      if (key !== undefined) {
	        this.remoteDelete(key);
	      }
	    } else if (tag === '@clear' && recon.size(message.body) === 1) {
	      this.remoteClear();
	    } else if (this.primaryKey) {
	      value = message.body;
	      key = this.primaryKey(value);
	      if (key !== undefined) {
	        this.remoteSet(key, value);
	      }
	    }
	    SyncedDownlink.prototype.onEventMessage.call(this, message);
	  },
	  configurable: true
	});
	Object.defineProperty(MapDownlink.prototype, 'remoteSet', {
	  value: function (key, value) {
	    Object.defineProperty(value, '$key', {value: key, configurable: true});
	    if (typeof key === 'string') {
	      this.table[key] = value;
	    }
	    for (var i = 0, n = this.state.length; i < n; i += 1) {
	      if (recon.equal(key, this.state[i].$key)) {
	        this.state[i] = value;
	        break;
	      }
	    }
	    if (i === n) {
	      this.state.push(value);
	    }
	    this.sort();
	  },
	  configurable: true
	});
	Object.defineProperty(MapDownlink.prototype, 'remoteDelete', {
	  value: function (key) {
	    if (typeof key === 'string') {
	      delete this.table[key];
	    }
	    for (var i = 0, n = this.state.length; i < n; i += 1) {
	      if (recon.equal(key, this.state[i].$key)) {
	        this.state.splice(i, 1);
	        return;
	      }
	    }
	  },
	  configurable: true
	});
	Object.defineProperty(MapDownlink.prototype, 'remoteClear', {
	  value: function (key) {
	    Object.defineProperty(this, 'state', {value: [], configurable: true});
	    Object.defineProperty(this, 'table', {value: {}, configurable: true});
	  },
	  configurable: true
	});
	Object.defineProperty(MapDownlink.prototype, 'size', {
	  get: function () {
	    return this.state.length;
	  },
	  configurable: true,
	  enumerable: true
	});
	MapDownlink.prototype.has = function (key) {
	  if (typeof key === 'string') {
	    return this.table[key] !== undefined;
	  } else {
	    for (var i = 0, n = this.state.length; i < n; i += 1) {
	      if (recon.equal(key, this.state[i].$key)) {
	        return true;
	      }
	    }
	  }
	  return false;
	};
	MapDownlink.prototype.get = function (key) {
	  if (typeof key === 'string') {
	    return this.table[key];
	  } else {
	    for (var i = 0, n = this.state.length; i < n; i += 1) {
	      var value = this.state[i];
	      if (recon.equal(key, value.$key)) {
	        return value;
	      }
	    }
	  }
	};
	MapDownlink.prototype.set = function (key, value) {
	  value = recon(value !== undefined ? value : this.get(key));
	  Object.defineProperty(value, '$key', {value: key, configurable: true});
	  if (typeof key === 'string') {
	    this.table[key] = value;
	  }
	  var oldValue;
	  for (var i = 0, n = this.state.length; i < n; i += 1) {
	    if (recon.equal(key, this.state[i].$key)) {
	      oldValue = this.state[i];
	      this.state[i] = value;
	      break;
	    }
	  }
	  if (i === n) {
	    this.state.push(value);
	  }
	  this.sort();
	  if (!recon.equal(value, oldValue)) {
	    var nodeUri = this.channel.unresolve(this.nodeUri);
	    var body;
	    if (this.primaryKey) {
	      body = recon(value);
	    } else {
	      body = recon.concat(recon({'@update': {key: key}}), recon(value));
	    }
	    var message = new proto.CommandMessage(nodeUri, this.laneUri, body);
	    this.onCommandMessage(message);
	    this.channel.push(message);
	  }
	  return this;
	};
	MapDownlink.prototype.delete = function (key) {
	  if (typeof key === 'string') {
	    delete this.table[key];
	  }
	  for (var i = 0, n = this.state.length; i < n; i += 1) {
	    var value = this.state[i];
	    if (recon.equal(key, value.$key)) {
	      this.state.splice(i, 1);
	      var nodeUri = this.channel.unresolve(this.nodeUri);
	      var body;
	      if (this.primaryKey) {
	        body = recon.concat(recon({'@remove': null}), value);
	      } else {
	        body = recon({'@remove': {key: key}});
	      }
	      var message = new proto.CommandMessage(nodeUri, this.laneUri, body);
	      this.onCommandMessage(message);
	      this.channel.push(message);
	      return true;
	    }
	  }
	  return false;
	};
	MapDownlink.prototype.clear = function () {
	  Object.defineProperty(this, 'state', {value: [], configurable: true});
	  Object.defineProperty(this, 'table', {value: {}, configurable: true});
	  var nodeUri = this.channel.unresolve(this.nodeUri);
	  var message = new proto.CommandMessage(nodeUri, this.laneUri, [{'@clear': null}]);
	  this.onCommandMessage(message);
	  this.channel.push(message);
	  return this;
	};
	MapDownlink.prototype.sort = function () {
	  if (this.sortBy) {
	    this.state.sort(this.sortBy);
	  }
	};
	MapDownlink.prototype.keys = function () {
	  var keys = [];
	  for (var i = 0, n = this.state.length; i < n; i += 1) {
	    var key = this.state[i].$key;
	    if (key !== undefined) {
	      keys.push(key);
	    }
	  }
	  return keys;
	};
	MapDownlink.prototype.values = function () {
	  return this.state;
	};
	MapDownlink.prototype.forEach = function (callback, thisArg) {
	  for (var i = 0, n = this.state.length; i < n; i += 1) {
	    var value = this.state[i];
	    var key = value.$key;
	    callback.call(thisArg, value, key, this);
	  }
	};
	MapDownlink.primaryKeyOption = function (options) {
	  if (typeof options.primaryKey === 'function') {
	    return options.primaryKey;
	  } else if (typeof options.primaryKey === 'string') {
	    var keys = options.primaryKey.split('.');
	    return function (value) {
	      for (var i = 0, n = keys.length; i < n; i += 1) {
	        var key = keys[i];
	        value = recon.get(value, key);
	      }
	      return value;
	    };
	  } else {
	    return undefined;
	  }
	};
	MapDownlink.sortByOption = function (options) {
	  if (typeof options.sortBy === 'function') {
	    return options.sortBy;
	  } else if (typeof options.sortBy === 'string') {
	    var keys = options.sortBy.split('.');
	    return function (x, y) {
	      for (var i = 0, n = keys.length; i < n; i += 1) {
	        var key = keys[i];
	        x = recon.get(x, key);
	        y = recon.get(y, key);
	        return recon.compare(x, y);
	      }
	    };
	  }
	};


	function UriCache(baseUri, size) {
	  size = size || 32;
	  Object.defineProperty(this, 'baseUri', {value: baseUri, enumerable: true});
	  Object.defineProperty(this, 'base', {value: recon.uri.parse(baseUri)});
	  Object.defineProperty(this, 'size', {value: size, enumerable: true});
	  Object.defineProperty(this, 'resolveCache', {value: new Array(size)});
	  Object.defineProperty(this, 'unresolveCache', {value: new Array(size)});
	}
	UriCache.prototype.resolve = function (unresolvedUri) {
	  var hashBucket = Math.abs(UriCache.hash(unresolvedUri) % this.size);
	  var cacheEntry = this.resolveCache[hashBucket];
	  if (cacheEntry && cacheEntry.unresolved === unresolvedUri) {
	    return cacheEntry.resolved;
	  } else {
	    var resolvedUri = recon.uri.stringify(recon.uri.resolve(this.base, unresolvedUri));
	    this.resolveCache[hashBucket] = {
	      unresolved: unresolvedUri,
	      resolved: resolvedUri
	    };
	    return resolvedUri;
	  }
	};
	UriCache.prototype.unresolve = function (resolvedUri) {
	  var hashBucket = Math.abs(UriCache.hash(resolvedUri) % this.size);
	  var cacheEntry = this.unresolveCache[hashBucket];
	  if (cacheEntry && cacheEntry.resolved === resolvedUri) {
	    return cacheEntry.unresolved;
	  } else {
	    var unresolvedUri = recon.uri.stringify(recon.uri.unresolve(this.base, resolvedUri));
	    this.unresolveCache[hashBucket] = {
	      unresolved: unresolvedUri,
	      resolved: resolvedUri
	    };
	    return unresolvedUri;
	  }
	};
	UriCache.rotl = function (value, distance) {
	  return (value << distance) | (value >>> (32 - distance));
	};
	UriCache.mix = function (code, value) {
	  // MurmurHash3 mix function
	  value *= 0xcc9e2d51;
	  value = UriCache.rotl(value, 15);
	  value *= 0x1b873593;
	  code ^= value;
	  code = UriCache.rotl(code, 13);
	  code = code * 5 + 0xe6546b64;
	  return code;
	};
	UriCache.mash = function (code) {
	  // MurmurHash3 finalize function
	  code ^= code >>> 16;
	  code *= 0x85ebca6b;
	  code ^= code >>> 13;
	  code *= 0xc2b2ae35;
	  code ^= code >>> 16;
	  return code;
	};
	UriCache.hash = function (string) {
	  var code = 0;
	  for (var i = 0, n = string.length; i < n; i += 1) {
	    code = UriCache.mix(code, string.charAt(i));
	  }
	  code = UriCache.mash(code);
	  return code;
	};


	var swim = new Client();
	swim.client = function (options) {
	  return new Client(options);
	};
	swim.config = config;
	swim.Client = Client;
	swim.Scope = Scope;
	swim.HostScope = HostScope;
	swim.NodeScope = NodeScope;
	swim.LaneScope = LaneScope;
	swim.Channel = Channel;
	swim.DownlinkBuilder = DownlinkBuilder;
	swim.Downlink = Downlink;
	swim.LinkedDownlink = LinkedDownlink;
	swim.SyncedDownlink = SyncedDownlink;
	swim.ListDownlink = ListDownlink;
	swim.MapDownlink = MapDownlink;

	module.exports = swim;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = {
		"version": "0.4.8"
	};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var config = __webpack_require__(4);

	function parse(string) {
	  var input = new StringIterator(string);
	  var result = new DocumentParser().run(input);
	  return result.state();
	}

	function stringify(value, options) {
	  var writer = new ReconWriter();
	  if (options && options.block === false) writer.writeValue(value);
	  else writer.writeBlock(value);
	  return writer.state();
	}

	function base64(string) {
	  if (string === undefined) return new Uint8Array(0);
	  var data = new DataBuilder();
	  var cs = new StringIterator(string);
	  while (!cs.isEmpty()) {
	    data.appendBase64Char(cs.head());
	    cs.step();
	  }
	  return data.state();
	}

	function isRecord(item) {
	  return Array.isArray(item) && !(item instanceof Uint8Array);
	}

	function isObject(item) {
	  return item !== null && typeof item === 'object' && !(item instanceof Uint8Array);
	}

	function isField(item) {
	  return item !== null && typeof item === 'object' && !Array.isArray(item) && !(item instanceof Uint8Array);
	}

	function isAttr(item) {
	  if (!isField(item)) return false;
	  var keys = Object.keys(item);
	  var n = keys.length;
	  if (n === 0) return false;
	  for (var i = 0; i < n; i += 1) {
	    var key = keys[i];
	    if (key.length === 0 || key.charCodeAt(0) !== 64/*'@'*/) return false;
	  }
	  return true;
	}

	function isBlockSafe(record) {
	  for (var i = 0, n = record.length; i < n; i += 1) {
	    if (isAttr(record[i])) return false;
	  }
	  return true;
	}

	function isMarkupSafe(record) {
	  var n = record.length;
	  if (n === 0 || !isAttr(record[0])) return false;
	  for (var i = 1; i < n; i += 1) {
	    if (isAttr(record[i])) return false;
	  }
	  return true;
	}

	function size(value) {
	  if (isRecord(value)) return value.length;
	  else if (isObject(value)) return Object.keys(value).length;
	  else return 0;
	}

	function head(value) {
	  if (isRecord(value)) {
	    var header = value[0];
	    if (isField(header)) {
	      if (header.$key) return header.$value;
	      else return header[Object.keys(header)[0]];
	    }
	    else return header;
	  }
	  else if (isObject(value)) return value[Object.keys(value)[0]];
	  else return value;
	}

	function tail(value) {
	  var i, n, builder;
	  if (isRecord(value)) {
	    builder = new RecordBuilder();
	    for (i = 1, n = value.length; i < n; i += 1) {
	      builder.appendItem(value[i]);
	    }
	    return builder.state();
	  }
	  else if (isObject(value)) {
	    var keys = Object.keys(value);
	    for (i = 1, n = keys.length; i < n; i += 1) {
	      var key = keys[i];
	      builder.appendField(key, value[key]);
	    }
	    return builder.state();
	  }
	}

	function tag(value) {
	  if (isRecord(value)) {
	    var header = value[0];
	    if (isField(header)) return header.$key || Object.keys(header)[0];
	  }
	  else if (isObject(value)) return Object.keys(value)[0];
	}

	function has(record, key) {
	  return get(record, key) !== undefined;
	}

	function get(record, key) {
	  var i, n, item, value;
	  if (typeof key === 'string') {
	    value = record[key];
	    if (value !== undefined) return value;
	    for (i = 0, n = record.length; i < n; i += 1) {
	      item = record[i];
	      if (isField(item)) {
	        if (item[key] !== undefined) return item[key];
	        else if (equal(item.$key, key)) return item.$value;
	      }
	    }
	  }
	  else {
	    for (i = 0, n = record.length; i < n; i += 1) {
	      item = record[i];
	      if (isField(item)) {
	        if (equal(item.$key, key)) return item.$value;
	      }
	    }
	  }
	}

	function set(record, key, value) {
	  value = coerceValue(value);
	  if (isRecord(record)) setRecord(record, key, value);
	  else if (isObject(record)) setObject(record, key, value);
	}
	function setRecord(record, key, value) {
	  var updated = false;
	  var field;
	  for (var i = 0, n = record.length; i < n; i += 1) {
	    var item = record[i];
	    if (isField(item)) {
	      if (item[key] !== undefined) {
	        item[key] = value;
	        updated = true;
	      }
	      else if (equal(item.$key, key)) {
	        item.$value = value;
	        updated = true;
	      }
	    }
	  }
	  if (typeof key === 'string') {
	    if (!updated) {
	      field = {};
	      field[key] = value;
	      record.push(field);
	    }
	    record[key] = value;
	  }
	  else if (!updated) {
	    field = {};
	    field.$key = key;
	    field.$value = value;
	    record.push(field);
	  }
	}
	function setObject(record, key, value) {
	  if (typeof key === 'string') {
	    record[key] = value;
	  }
	}

	function remove(record, key) {
	  if (isRecord(record)) removeRecord(record, key);
	  else if (isObject(record)) removeObject(record, key);
	}
	function removeRecord(record, key) {
	  for (var i = 0, n = record.length; i < n; i += 1) {
	    var item = record[i];
	    if (isField(item)) {
	      if (item[key] !== undefined) {
	        delete item[key];
	        delete record[key];
	        if (Object.keys(item).length === 0) {
	          record.splice(i, 1);
	          i -= 1;
	          n -= 1;
	        }
	      }
	      else if (equal(item.$key, key)) {
	        record.splice(i, 1);
	        i -= 1;
	        n -= 1;
	      }
	    }
	  }
	}
	function removeObject(record, key) {
	  if (typeof key === 'string') {
	    delete record[key];
	  }
	}

	function keys(record) {
	  if (isRecord(record)) {
	    var keys = [];
	    for (var i = 0, n = record.length; i < n; i += 1) {
	      var item = record[i];
	      if (isField(item)) {
	        var key = item.$key;
	        if (key !== undefined) keys.push(key);
	        else Array.prototype.push.apply(keys, Object.keys(item));
	      }
	    }
	    return keys;
	  }
	  else if (isObject(record)) {
	    return Object.keys(record);
	  }
	  else {
	    return [];
	  }
	}

	function values(record) {
	  var values = [];
	  var key;
	  if (isRecord(record)) {
	    for (var i = 0, n = record.length; i < n; i += 1) {
	      var item = record[i];
	      if (isField(item)) {
	        key = item.$key;
	        if (key !== undefined) {
	          values.push(item.$value);
	        }
	        else {
	          for (key in item) {
	            values.push(item[key]);
	          }
	        }
	      }
	      else {
	        values.push(item);
	      }
	    }
	  }
	  else if (isObject(record)) {
	    for (key in record) {
	      values.push(record[key]);
	    }
	  }
	  return values;
	}

	function forEach(record, callback, thisArg) {
	  var key, value;
	  if (isRecord(record)) {
	    for (var i = 0, n = record.length; i < n; i += 1) {
	      var item = record[i];
	      if (isField(item)) {
	        key = item.$key;
	        if (key !== undefined) {
	          value = item.$value;
	          callback.call(thisArg, value, key, record);
	        }
	        else {
	          for (key in item) {
	            value = item[key];
	            callback.call(thisArg, value, key, record);
	          }
	        }
	      }
	      else {
	        callback.call(thisArg, item, undefined, record);
	      }
	    }
	  }
	  else if (isObject(record)) {
	    for (key in record) {
	      value = record[key];
	      callback.call(thisArg, value, key, record);
	    }
	  }
	}

	function concat(x, y) {
	  var builder = new RecordBuilder();
	  if (isRecord(x)) builder.appendRecord(x);
	  else if (isObject(x)) builder.appendFields(x);
	  else if (x !== undefined) builder.appendItem(x);
	  if (isRecord(y)) builder.appendRecord(y);
	  else if (isObject(y)) builder.appendFields(y);
	  else if (y !== undefined) builder.appendItem(y);
	  return builder.state();
	}

	function equal(x, y) {
	  if (x === y) return true;
	  if (isRecord(x) && isRecord(y)) return equalRecord(x, y);
	  if (isField(x) && isField(y)) return equalFields(x, y);
	  if (x instanceof Uint8Array && y instanceof Uint8Array) return equalData(x, y);
	  return false;
	}
	function equalRecord(x, y) {
	  var n = x.length;
	  if (n !== y.length) return false;
	  for (var i = 0; i < n; i += 1) {
	    if (!equal(x[i], y[i])) return false;
	  }
	  return true;
	}
	function equalFields(x, y) {
	  var xKeys = Object.keys(x);
	  var yKeys = Object.keys(y);
	  var n = xKeys.length;
	  if (n !== yKeys.length) return false;
	  for (var i = 0; i < n; i += 1) {
	    var key = xKeys[i];
	    if (!equal(x[key], y[key])) return false;
	  }
	  return true;
	}
	function equalData(x, y) {
	  var n = x.length;
	  if (n !== y.length) return false;
	  for (var i = 0; i < n; i += 1) {
	    if (x[i] !== y[i]) return false;
	  }
	  return true;
	}

	function compare(x, y) {
	  if (x === true) x = 'true';
	  else if (x === false) x = 'false';
	  if (y === true) y = 'true';
	  else if (y === false) y = 'false';

	  if (x === undefined) {
	    if (y === undefined) return 0;
	    else return 1;
	  }
	  else if (x === null) {
	    if (y === undefined) return -1;
	    else if (y === null) return 0;
	    else return 1;
	  }
	  else if (typeof x === 'number') {
	    if (y === undefined || y === null) return -1;
	    else if (typeof y === 'number') return x < y ? -1 : x > y ? 1 : 0;
	    else return 1;
	  }
	  else if (typeof x === 'string') {
	    if (y === undefined || y === null || typeof y === 'number') return -1;
	    else if (typeof y === 'string') return x < y ? -1 : x > y ? 1 : 0;
	    else return 1;
	  }
	  else if (x instanceof Uint8Array) {
	    if (y === undefined || y === null || typeof y === 'number' || typeof y === 'string') return -1;
	    else if (y instanceof Uint8Array) return compareData(x, y);
	    else return 1;
	  }
	  else if (Array.isArray(x)) {
	    if (y === undefined || y === null || typeof y === 'number' || typeof y === 'string' ||
	        y instanceof Uint8Array) return -1;
	    else if (Array.isArray(y)) return compareRecord(x, y);
	    else return 1;
	  }
	  else {
	    if (y === undefined || y === null || typeof y === 'number' || typeof y === 'string' ||
	        y instanceof Uint8Array || Array.isArray(y)) return -1;
	    else return compareFields(x, y);
	  }
	}
	function compareRecord(x, y) {
	  var p = x.length;
	  var q = y.length;
	  for (var i = 0, n = Math.min(p, q), order = 0; i < n && order === 0; i += 1) {
	    order = compare(x[i], y[i]);
	  }
	  return order !== 0 ? order : p > q ? 1 : p < q ? -1 : 0;
	}
	function compareFields(x, y) {
	  var xKeys = Object.keys(x);
	  var yKeys = Object.keys(y);
	  var p = xKeys.length;
	  var q = yKeys.length;
	  for (var i = 0, n = Math.min(p, q), order = 0; i < n && order === 0; i += 1) {
	    var xKey = xKeys[i];
	    var yKey = yKeys[i];
	    order = compareName(xKey, yKey);
	    if (order === 0) order = compare(x[xKey], y[yKey]);
	  }
	  return order !== 0 ? order : p > q ? 1 : p < q ? -1 : 0;
	}
	function compareName(x, y) {
	  var p = x.length;
	  var q = y.length;
	  if (p > 0 && q > 0) {
	    var x0 = x.charCodeAt(0);
	    var y0 = y.charCodeAt(0);
	    if (x0 === 64/*'@'*/ && y0 !== 64/*'@'*/) return -1;
	    else if (x0 !== 64/*'@'*/ && y0 === 64/*'@'*/) return 1;
	    else return x < y ? -1 : x > y ? 1 : 0;
	  }
	  else if (p > 0) return 1;
	  else if (q > 0) return -1;
	  else return 0;
	}
	function compareData(x, y) {
	  var p = x.length;
	  var q = y.length;
	  for (var i = 0, n = Math.min(p, q), order = 0; i < n && order === 0; i += 1) {
	    order = x[i] - y[i];
	  }
	  return order > 0 ? 1 : order < 0 ? -1 : p > q ? 1 : p < q ? -1 : 0;
	}

	function coerce() {
	  if (arguments.length === 1) return coerceValue(arguments[0]);
	  else if (arguments.length > 1) return coerceRecord(arguments);
	}
	function coerceValue(value) {
	  if (isRecord(value)) return coerceRecord(value);
	  else if (isObject(value)) return coerceObject(value);
	  else return value;
	}
	function coerceRecord(items) {
	  var record = [];
	  var i, n;
	  for (i = 0, n = items.length; i < n; i += 1) {
	    record.push(items[i]);
	  }
	  var keys = Object.keys(items);
	  for (i = 0, n = keys.length; i < n; i += 1) {
	    var key = keys[i];
	    if (isNaN(parseInt(key)) && key.length > 0 && key.charCodeAt(0) !== 36/*'$'*/) {
	      var value = coerceValue(items[key]);
	      set(record, key, value);
	    }
	  }
	  return record;
	}
	function coerceObject(fields) {
	  var keys = Object.keys(fields);
	  var n = keys.length;
	  var record = new Array(n);
	  for (var i = 0; i < n; i += 1) {
	    var key = keys[i];
	    var value = coerceValue(fields[key]);
	    var field = {};
	    field[key] = value;
	    record[i] = field;
	    record[key] = value;
	  }
	  return record;
	}


	function RecordBuilder() {
	  this.items = [];
	}
	RecordBuilder.prototype.appendItem = function (item) {
	  if (isField(item)) this.appendFields(item);
	  else this.appendValue(item);
	};
	RecordBuilder.prototype.appendFields = function (fields) {
	  var keys = Object.keys(fields);
	  for (var i = 0, n = keys.length; i < n; i += 1) {
	    var key = keys[i];
	    var value = fields[key];
	    this.appendField(key, value);
	  }
	};
	RecordBuilder.prototype.appendField = function (key, value) {
	  var field = {};
	  if (typeof key === 'string') {
	    field[key] = value;
	    this.items.push(field);
	    this.items[key] = value;
	  }
	  else {
	    field.$key = key;
	    field.$value = value;
	    this.items.push(field);
	  }
	};
	RecordBuilder.prototype.appendValue = function (value) {
	  this.items.push(value);
	};
	RecordBuilder.prototype.appendRecord = function (record) {
	  for (var i = 0, n = record.length; i < n; i += 1) {
	    this.appendItem(record[i]);
	  }
	};
	RecordBuilder.prototype.state = function () {
	  return this.items;
	};


	function ValueBuilder() {
	  this.items = null;
	  this.value = null;
	}
	ValueBuilder.prototype.appendItem = function (item) {
	  if (isField(item)) this.appendField(item);
	  else this.appendValue(item);
	};
	ValueBuilder.prototype.appendFields = function (fields) {
	  var keys = Object.keys(fields);
	  for (var i = 0, n = keys.length; i < n; i += 1) {
	    var key = keys[i];
	    var value = fields[key];
	    this.appendField(key, value);
	  }
	};
	ValueBuilder.prototype.appendField = function (key, value) {
	  if (this.items === null) {
	    this.items = [];
	    if (this.value !== null) {
	      this.items.push(this.value);
	      this.value = null;
	    }
	  }
	  var field = {};
	  if (typeof key === 'string') {
	    field[key] = value;
	    this.items.push(field);
	    this.items[key] = value;
	  }
	  else {
	    field.$key = key;
	    field.$value = value;
	    this.items.push(field);
	  }
	};
	ValueBuilder.prototype.appendValue = function (value) {
	  if (this.items !== null) this.items.push(value);
	  else if (this.value === null) this.value = value;
	  else {
	    this.items = [];
	    this.items.push(this.value);
	    this.value = null;
	    this.items.push(value);
	  }
	};
	ValueBuilder.prototype.state = function () {
	  if (this.value !== null) return this.value;
	  else if (this.items !== null) return this.items;
	};


	function StringIterator(string, index, more) {
	  this.string = string || '';
	  this.index = index || 0;
	  this.more = more || false;
	}
	StringIterator.prototype.isDone = function () {
	  return this.isEmpty() && !this.more;
	};
	StringIterator.prototype.isEmpty = function () {
	  return this.index >= this.string.length;
	};
	StringIterator.prototype.head = function () {
	  var c1 = this.string.charCodeAt(this.index);
	  if (c1 <= 0xD7FF || c1 >= 0xE000) return c1; // U+0000..U+D7FF | U+E000..U+FFFF
	  else if (c1 <= 0xDBFF && this.index + 1 < this.string.length) { // c1 >= 0xD800
	    var c2 = this.string.charCodeAt(this.index + 1);
	    if (c2 >= 0xDC00 && c2 <= 0xDFFF) // U+10000..U+10FFFF
	      return (((c1 & 0x3FF) << 10) | (c2 & 0x3FF)) + 0x10000;
	    else return 0xFFFD;
	  }
	  else return 0xFFFD;
	};
	StringIterator.prototype.step = function () {
	  var c1 = this.string.charCodeAt(this.index);
	  if (c1 <= 0xD7FF || c1 >= 0xE000) // U+0000..U+D7FF | U+E000..U+FFFF
	    this.index += 1;
	  else if (c1 <= 0xDBFF && this.index + 1 < this.string.length) { // c1 >= 0xD800
	    var c2 = this.string.charCodeAt(this.index + 1);
	    if (c2 >= 0xDC00 && c2 <= 0xDFFF) // U+10000..U+10FFFF
	      this.index += 2;
	    else this.index += 1;
	  }
	  else this.index += 1;
	};
	StringIterator.prototype.dup = function () {
	  return new StringIterator(this.string, this.index, this.more);
	};

	StringIterator.Done = {
	  isDone: function () {
	    return true;
	  },
	  isEmpty: function () {
	    return true;
	  },
	  head: function () {
	    throw 'head of empty iterator';
	  },
	  step: function () {
	    throw 'empty iterator step';
	  }
	};
	StringIterator.Done.prototype = Object.create(StringIterator.prototype);


	function StringIteratee() {}
	StringIteratee.prototype.isCont = function () {
	  return true;
	};
	StringIteratee.prototype.isDone = function () {
	  return false;
	};
	StringIteratee.prototype.isError = function () {
	  return false;
	};
	StringIteratee.prototype.feed = function (input) {
	  return this;
	};
	StringIteratee.prototype.run = function (input) {
	  var next = this;
	  do next = next.feed(input);
	  while (!input.isEmpty() && next.isCont());
	  if (input.isEmpty() && !input.isDone() && next.isCont()) {
	    next = next.feed(StringIterator.Done);
	  }
	  return next;
	};
	StringIteratee.prototype.state = function () {};

	StringIteratee.Done = function (value) {
	  StringIteratee.call(this);
	  this.value = value;
	};
	StringIteratee.Done.prototype = Object.create(StringIteratee.prototype);
	StringIteratee.Done.prototype.constructor = StringIteratee.Done;
	StringIteratee.Done.prototype.isCont = function () {
	  return false;
	};
	StringIteratee.Done.prototype.isDone = function () {
	  return true;
	};
	StringIteratee.Done.prototype.feed = function (input) {
	  return this;
	};
	StringIteratee.Done.prototype.state = function () {
	  return this.value;
	};

	StringIteratee.Error = function (error) {
	  StringIteratee.call(this);
	  if (typeof error.found === 'number') error.found = String.fromCharCode(error.found);
	  this.error = error;
	};
	StringIteratee.Error.prototype = Object.create(StringIteratee.prototype);
	StringIteratee.Error.prototype.constructor = StringIteratee.Error;
	StringIteratee.Error.prototype.isCont = function () {
	  return false;
	};
	StringIteratee.Error.prototype.isError = function () {
	  return true;
	};
	StringIteratee.Error.prototype.feed = function (input) {
	  return this;
	};
	StringIteratee.Error.prototype.state = function () {
	  throw this.error;
	};

	StringIteratee.unexpectedEOF = new StringIteratee.Error('unexpected end of input');


	function StringBuilder(s) {
	  this.string = s || '';
	}
	StringBuilder.prototype.append = function (c) {
	  if ((c >= 0x0000 && c <= 0xD7FF) ||
	      (c >= 0xE000 && c <= 0xFFFF)) { // U+0000..U+D7FF | U+E000..U+FFFF
	    this.string += String.fromCharCode(c);
	  }
	  else if (c >= 0x10000 && c <= 0x10FFFF) { // U+10000..U+10FFFF
	    var u = c - 0x10000;
	    this.string += String.fromCharCode(0xD800 | (u >>> 10), 0xDC00 | (u & 0x3FF));
	  }
	  else { // invalid code point
	    this.string += String.fromCharCode(0xFFFD);
	  }
	};
	StringBuilder.prototype.appendString = function (s) {
	  var cs = new StringIterator(s);
	  while (!cs.isEmpty()) {
	    this.append(cs.head());
	    cs.step();
	  }
	};
	StringBuilder.prototype.state = function () {
	  return this.string;
	};


	function DataBuilder() {
	  this.buffer = null;
	  this.offset = 0;
	  this.aliased = true;
	  this.p = 0;
	  this.q = 0;
	  this.r = 0;
	  this.s = 0;
	}
	DataBuilder.prototype.prepare = function (size) {
	  function expand(base, size) {
	    var n = Math.max(base, size) - 1;
	    n |= n >> 1; n |= n >> 2; n |= n >> 4; n |= n >> 8;
	    return n + 1;
	  }
	  if (this.aliased || size > this.buffer.length) {
	    var array = new Uint8Array(expand(256, size));
	    if (this.buffer) array.set(this.buffer);
	    this.buffer = array;
	    this.aliased = false;
	  }
	};
	DataBuilder.prototype.appendByte = function (value) {
	  this.prepare(this.offset + 1);
	  this.buffer[this.offset] = value;
	  this.offset += 1;
	};
	DataBuilder.prototype.decodeBase64Digit = function (c) {
	  if (c >= 65/*'A'*/ && c <= 90/*'Z'*/) return c - 65/*'A'*/;
	  else if (c >= 97/*'a'*/ && c <= 122/*'z'*/) return c - 71/*'a' - 26*/;
	  else if (c >= 48/*'0'*/ && c <= 57/*'9'*/) return c + 4/*52 - '0'*/;
	  else if (c === 43/*'+'*/ || c === 45/*'-'*/) return 62;
	  else if (c === 47/*'/'*/ || c === 95/*'_'*/) return 63;
	};
	DataBuilder.prototype.decodeBase64Quantum = function () {
	  var x = this.decodeBase64Digit(this.p);
	  var y = this.decodeBase64Digit(this.q);
	  if (this.r !== 61/*'='*/) {
	    var z = this.decodeBase64Digit(this.r);
	    if (this.s !== 61/*'='*/) {
	      var w = this.decodeBase64Digit(this.s);
	      this.appendByte((x << 2) | (y >>> 4));
	      this.appendByte((y << 4) | (z >>> 2));
	      this.appendByte((z << 6) | w);
	    }
	    else {
	      this.appendByte((x << 2) | (y >>> 4));
	      this.appendByte((y << 4) | (z >>> 2));
	    }
	  }
	  else {
	    if (this.s !== 61/*'='*/) throw 'incomplete base64 quantum';
	    this.appendByte((x << 2) | (y >>> 4));
	  }
	};
	DataBuilder.prototype.appendBase64Char = function (c) {
	  if (this.p === 0) this.p = c;
	  else if (this.q === 0) this.q = c;
	  else if (this.r === 0) this.r = c;
	  else {
	    this.s = c;
	    this.decodeBase64Quantum();
	    this.s = 0;
	    this.r = 0;
	    this.q = 0;
	    this.p = 0;
	  }
	};
	DataBuilder.prototype.state = function (value) {
	  if (!this.buffer) this.buffer = new Uint8Array(0);
	  else if (this.buffer.length !== this.offset) {
	    var array = new Uint8Array(this.offset);
	    array.set(this.buffer.subarray(0, this.offset));
	    this.buffer = array;
	  }
	  this.aliased = true;
	  return this.buffer;
	};


	function isSpace(c) {
	  return c === 0x20 || c === 0x9;
	}
	function isNewline(c) {
	  return c === 0xA || c === 0xD;
	}
	function isWhitespace(c) {
	  return isSpace(c) || isNewline(c);
	}
	function isNameStartChar(c) {
	  return (
	    c >= 65/*'A'*/ && c <= 90/*'Z'*/ ||
	    c === 95/*'_'*/ ||
	    c >= 97/*'a'*/ && c <= 122/*'z'*/ ||
	    c >= 0xC0 && c <= 0xD6 ||
	    c >= 0xD8 && c <= 0xF6 ||
	    c >= 0xF8 && c <= 0x2FF ||
	    c >= 0x370 && c <= 0x37D ||
	    c >= 0x37F && c <= 0x1FFF ||
	    c >= 0x200C && c <= 0x200D ||
	    c >= 0x2070 && c <= 0x218F ||
	    c >= 0x2C00 && c <= 0x2FEF ||
	    c >= 0x3001 && c <= 0xD7FF ||
	    c >= 0xF900 && c <= 0xFDCF ||
	    c >= 0xFDF0 && c <= 0xFFFD ||
	    c >= 0x10000 && c <= 0xEFFFF);
	}
	function isNameChar(c) {
	  return (
	    c === 45/*'-'*/ ||
	    c >= 48/*'0'*/ && c <= 57/*'9'*/ ||
	    c >= 65/*'A'*/ && c <= 90/*'Z'*/ ||
	    c === 95/*'_'*/ ||
	    c >= 97/*'a'*/ && c <= 122/*'z'*/ ||
	    c === 0xB7 ||
	    c >= 0xC0 && c <= 0xD6 ||
	    c >= 0xD8 && c <= 0xF6 ||
	    c >= 0xF8 && c <= 0x37D ||
	    c >= 0x37F && c <= 0x1FFF ||
	    c >= 0x200C && c <= 0x200D ||
	    c >= 0x203F && c <= 0x2040 ||
	    c >= 0x2070 && c <= 0x218F ||
	    c >= 0x2C00 && c <= 0x2FEF ||
	    c >= 0x3001 && c <= 0xD7FF ||
	    c >= 0xF900 && c <= 0xFDCF ||
	    c >= 0xFDF0 && c <= 0xFFFD ||
	    c >= 0x10000 && c <= 0xEFFFF);
	}
	function isBase64Char(c) {
	  return (
	    c >= 48/*'0'*/ && c <= 57/*'9'*/ ||
	    c >= 65/*'A'*/ && c <= 90/*'Z'*/ ||
	    c >= 97/*'a'*/ && c <= 122/*'z'*/ ||
	    c === 43/*'+'*/ || c === 45/*'-'*/ ||
	    c === 47/*'/'*/ || c === 95/*'_'*/);
	}


	function DocumentParser(value) {
	  StringIteratee.call(this);
	  this.value = value || new BlockParser();
	}
	DocumentParser.prototype = Object.create(StringIteratee.prototype);
	DocumentParser.prototype.constructor = DocumentParser;
	DocumentParser.prototype.feed = function (input) {
	  var value = this.value;
	  while ((!input.isEmpty() || input.isDone()) && value.isCont()) value = value.feed(input);
	  if (value.isError()) return value;
	  if (value.isDone()) {
	    if (!input.isEmpty()) return new StringIteratee.Error({found: input.head()});
	    else if (input.isDone()) return value;
	  }
	  return new DocumentParser(value);
	};


	function BlockParser(builder, key, value, s) {
	  StringIteratee.call(this);
	  this.builder = builder || null;
	  this.key = key || null;
	  this.value = value || null;
	  this.s = s || 1;
	}
	BlockParser.prototype = Object.create(StringIteratee.prototype);
	BlockParser.prototype.constructor = BlockParser;
	BlockParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var value = this.value;
	  var key = this.key;
	  var builder = this.builder || new ValueBuilder();
	  while (!input.isEmpty() || input.isDone()) {
	    if (s === 1) {
	      while (!input.isEmpty() && (c = input.head(), isWhitespace(c))) input.step();
	      if (!input.isEmpty()) {
	        if (c === 64/*'@'*/ || c === 123/*'{'*/ || c === 91/*'['*/ || isNameStartChar(c) ||
	            c === 34/*'"'*/ || c === 45/*'-'*/ || c >= 48/*'0'*/ && c <= 57/*'9'*/ || c === 37/*'%'*/)
	          s = 2;
	        else return new StringIteratee.Error({expected: 'block value', found: c});
	      }
	      else if (input.isDone()) return new StringIteratee.Done(builder.state());
	    }
	    if (s === 2) {
	      key = key || new BlockValueParser();
	      while ((!input.isEmpty() || input.isDone()) && key.isCont()) key = key.feed(input);
	      if (key.isDone()) s = 3;
	      else if (key.isError()) return key;
	    }
	    if (s === 3) {
	      while (!input.isEmpty() && (c = input.head(), isSpace(c))) input.step();
	      if (!input.isEmpty()) {
	        if (c === 58/*':'*/) {
	          input.step();
	          s = 4;
	        }
	        else {
	          builder.appendValue(key.state());
	          key = null;
	          s = 6;
	        }
	      }
	      else if (input.isDone()) {
	        builder.appendValue(key.state());
	        return new StringIteratee.Done(builder.state());
	      }
	    }
	    if (s === 4) {
	      while (!input.isEmpty() && isSpace(input.head())) input.step();
	      if (!input.isEmpty()) s = 5;
	      else if (input.isDone()) {
	        builder.appendField(key.state(), null);
	        return new StringIteratee.Done(builder.state());
	      }
	    }
	    if (s === 5) {
	      value = value || new BlockValueParser();
	      while ((!input.isEmpty() || input.isDone()) && value.isCont()) value = value.feed(input);
	      if (value.isDone()) {
	        builder.appendField(key.state(), value.state());
	        key = null;
	        value = null;
	        s = 6;
	      }
	      else if (value.isError()) return value;
	    }
	    if (s === 6) {
	      while (!input.isEmpty() && (c = input.head(), isSpace(c))) input.step();
	      if (!input.isEmpty()) {
	        if (c === 44/*','*/ || c === 59/*';'*/ || isNewline(c)) {
	          input.step();
	          s = 1;
	        }
	        else return new StringIteratee.Done(builder.state());
	      }
	      else if (input.isDone()) return new StringIteratee.Done(builder.state());
	    }
	  }
	  return new BlockParser(builder, key, value, s);
	};


	function AttrParser(ident, value, s) {
	  StringIteratee.call(this);
	  this.ident = ident || null;
	  this.value = value || new BlockParser();
	  this.s = s || 1;
	}
	AttrParser.prototype = Object.create(StringIteratee.prototype);
	AttrParser.prototype.constructor = AttrParser;
	AttrParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var value = this.value;
	  var ident = this.ident;
	  var field;
	  if (s === 1) {
	    if (!input.isEmpty() && (c = input.head(), c === 64/*'@'*/)) {
	      input.step();
	      s = 2;
	    }
	    else if (!input.isEmpty()) return new StringIteratee.Error({expected: '\'@\'', found: c});
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  if (s === 2) {
	    if (!ident) ident = new IdentParser(new StringBuilder('@'));
	    ident = ident.feed(input);
	    if (ident.isDone()) s = 3;
	    else if (ident.isError()) return ident;
	  }
	  if (s === 3) {
	    if (!input.isEmpty() && input.head() === 40/*'('*/) {
	      input.step();
	      s = 4;
	    }
	    else if (!input.isEmpty() || input.isDone()) {
	      field = {};
	      field[ident.state()] = null;
	      return new StringIteratee.Done(field);
	    }
	  }
	  if (s === 4) {
	    while (!input.isEmpty() && (c = input.head(), isWhitespace(c))) input.step();
	    if (!input.isEmpty()) {
	      if (c === 41/*')'*/) {
	        input.step();
	        field = {};
	        field[ident.state()] = null;
	        return new StringIteratee.Done(field);
	      }
	      else s = 5;
	    }
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  if (s === 5) {
	    while ((!input.isEmpty() || input.isDone()) && value.isCont()) value = value.feed(input);
	    if (value.isDone()) s = 6;
	    else if (value.isError()) return value;
	  }
	  if (s === 6) {
	    while (!input.isEmpty() && (c = input.head(), isWhitespace(c))) input.step();
	    if (!input.isEmpty()) {
	      if (c === 41/*')'*/) {
	        input.step();
	        field = {};
	        field[ident.state()] = value.state();
	        return new StringIteratee.Done(field);
	      }
	      else return new StringIteratee.Error({expected: '\')\'', found: c});
	    }
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  return new AttrParser(ident, value, s);
	};


	function BlockValueParser(builder, field, value, s) {
	  StringIteratee.call(this);
	  this.builder = builder || null;
	  this.field = field || null;
	  this.value = value || null;
	  this.s = s || 1;
	}
	BlockValueParser.prototype = Object.create(StringIteratee.prototype);
	BlockValueParser.prototype.constructor = BlockValueParser;
	BlockValueParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var value = this.value;
	  var field = this.field;
	  var builder = this.builder;
	  while (!input.isEmpty() || input.isDone()) {
	    if (s === 1) {
	      if (!input.isEmpty()) {
	        c = input.head();
	        if (c === 64/*'@'*/) {
	          field = new AttrParser();
	          s = 2;
	        }
	        else if (c === 123/*'{'*/) {
	          builder = builder || new RecordBuilder();
	          value = new RecordParser(builder);
	          s = 5;
	        }
	        else if (c === 91/*'['*/) {
	          builder = builder || new RecordBuilder();
	          value = new MarkupParser(builder);
	          s = 5;
	        }
	        else if (isNameStartChar(c)) {
	          value = new IdentParser();
	          s = 4;
	        }
	        else if (c === 34/*'"'*/) {
	          value = new StringParser();
	          s = 4;
	        }
	        else if (c === 45/*'-'*/ || c >= 48/*'0'*/ && c <= 57/*'9'*/) {
	          value = new NumberParser();
	          s = 4;
	        }
	        else if (c === 37/*'%'*/) {
	          value = new DataParser();
	          s = 4;
	        }
	        else if (!builder) return new StringIteratee.Done(undefined);
	        else return new StringIteratee.Done(builder.state());
	      }
	      else if (input.isDone()) {
	        if (!builder) return new StringIteratee.Done(undefined);
	        else return new StringIteratee.Done(builder.state());
	      }
	    }
	    if (s === 2) {
	      while ((!input.isEmpty() || input.isDone()) && field.isCont()) field = field.feed(input);
	      if (field.isDone()) {
	        builder = builder || new ValueBuilder();
	        builder.appendFields(field.state());
	        field = null;
	        s = 3;
	      }
	      else if (field.isError()) return field;
	    }
	    if (s === 3) {
	      while (!input.isEmpty() && isSpace(input.head())) input.step();
	      if (!input.isEmpty()) s = 1;
	      else if (input.isDone()) return new StringIteratee.Done(builder.state());
	    }
	    if (s === 4) {
	      while ((!input.isEmpty() || input.isDone()) && value.isCont()) value = value.feed(input);
	      if (value.isDone()) {
	        builder = builder || new ValueBuilder();
	        builder.appendValue(value.state());
	        value = null;
	        s = 6;
	      }
	      else if (value.isError()) return value;
	    }
	    if (s === 5) {
	      while ((!input.isEmpty() || input.isDone()) && value.isCont()) value = value.feed(input);
	      if (value.isDone()) {
	        value = null;
	        s = 6;
	      }
	      else if (value.isError()) return value;
	    }
	    if (s === 6) {
	      while (!input.isEmpty() && isSpace(input.head())) input.step();
	      if (!input.isEmpty() && input.head() === 64/*'@'*/) s = 1;
	      else return new StringIteratee.Done(builder.state());
	    }
	  }
	  return new BlockValueParser(builder, field, value, s);
	};


	function InlineValueParser(builder, field, value, s) {
	  StringIteratee.call(this);
	  this.builder = builder || null;
	  this.field = field || null;
	  this.value = value || null;
	  this.s = s || 1;
	}
	InlineValueParser.prototype = Object.create(StringIteratee.prototype);
	InlineValueParser.prototype.constructor = InlineValueParser;
	InlineValueParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var value = this.value;
	  var field = this.field;
	  var builder = this.builder;
	  if (s === 1) {
	    if (!input.isEmpty()) {
	      c = input.head();
	      if (c === 64/*'@'*/) {
	        field = new AttrParser();
	        s = 2;
	      }
	      else if (c === 123/*'{'*/) {
	        if (builder) {
	          value = new RecordParser(builder);
	          s = 5;
	        }
	        else {
	          value = new RecordParser();
	          s = 4;
	        }
	      }
	      else if (c === 91/*'['*/) {
	        if (builder) {
	          value = new MarkupParser(builder);
	          s = 5;
	        }
	        else {
	          value = new MarkupParser();
	          s = 4;
	        }
	      }
	      else if (!builder) return new StringIteratee.Done(null);
	      else return new StringIteratee.Done(builder.state());
	    }
	    else if (input.isDone()) {
	      if (!builder) return new StringIteratee.Done(null);
	      else return new StringIteratee.Done(builder.state());
	    }
	  }
	  if (s === 2) {
	    while ((!input.isEmpty() || input.isDone()) && field.isCont()) field = field.feed(input);
	    if (field.isDone()) {
	      builder = builder || new ValueBuilder();
	      builder.appendFields(field.state());
	      field = null;
	      s = 3;
	    }
	    else if (field.isError()) return field;
	  }
	  if (s === 3) {
	    if (!input.isEmpty()) {
	      c = input.head();
	      if (c === 123/*'{'*/) {
	        value = new RecordParser(builder);
	        s = 5;
	      }
	      else if (c === 91/*'['*/) {
	        value = new MarkupParser(builder);
	        s = 5;
	      }
	      else return new StringIteratee.Done(builder.state());
	    }
	    else if (input.isDone()) return new StringIteratee.Done(builder.state());
	  }
	  if (s === 4) {
	    while ((!input.isEmpty() || input.isDone()) && value.isCont()) value = value.feed(input);
	    if (value.isDone()) {
	      builder = builder || new ValueBuilder();
	      builder.appendValue(value.state());
	      return new StringIteratee.Done(builder.state());
	    }
	    else if (value.isError()) return value;
	  }
	  if (s === 5) {
	    while ((!input.isEmpty() || input.isDone()) && value.isCont()) value = value.feed(input);
	    if (value.isDone()) return new StringIteratee.Done(builder.state());
	    else if (value.isError()) return value;
	  }
	  return new InlineValueParser(builder, field, value, s);
	};


	function RecordParser(builder, key, value, s) {
	  StringIteratee.call(this);
	  this.builder = builder || null;
	  this.key = key || null;
	  this.value = value || null;
	  this.s = s || 1;
	}
	RecordParser.prototype = Object.create(StringIteratee.prototype);
	RecordParser.prototype.constructor = RecordParser;
	RecordParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var value = this.value;
	  var key = this.key;
	  var builder = this.builder || new RecordBuilder();
	  if (s === 1) {
	    if (!input.isEmpty()) {
	      c = input.head();
	      if (c === 123/*'{'*/) {
	        input.step();
	        s = 2;
	      }
	      else return new StringIteratee.Error({expected: '\'{\'', found: c});
	    }
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  while (!input.isEmpty() || input.isDone()) {
	    if (s === 2) {
	      while (!input.isEmpty() && (c = input.head(), isWhitespace(c))) input.step();
	      if (!input.isEmpty()) {
	        if (c === 125/*'}'*/) {
	          input.step();
	          return new StringIteratee.Done(builder.state());
	        }
	        else s = 3;
	      }
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 3) {
	      key = key || new BlockValueParser();
	      while ((!input.isEmpty() || input.isDone()) && key.isCont()) key = key.feed(input);
	      if (key.isDone()) s = 4;
	      else if (key.isError()) return key;
	    }
	    if (s === 4) {
	      while (!input.isEmpty() && (c = input.head(), isSpace(c))) input.step();
	      if (!input.isEmpty()) {
	        if (c === 58/*':'*/) {
	          input.step();
	          s = 5;
	        }
	        else {
	          builder.appendValue(key.state());
	          key = null;
	          s = 7;
	        }
	      }
	      else if (input.isDone()) {
	        builder.appendValue(key.state());
	        return new StringIteratee.Done(builder.state());
	      }
	    }
	    if (s === 5) {
	      while (!input.isEmpty() && isSpace(input.head())) input.step();
	      if (!input.isEmpty()) s = 6;
	      else if (input.isDone()) {
	        builder.appendField(key, null);
	        return new StringIteratee.Done(builder.state());
	      }
	    }
	    if (s === 6) {
	      value = value || new BlockValueParser();
	      while ((!input.isEmpty() || input.isDone()) && value.isCont()) value = value.feed(input);
	      if (value.isDone()) {
	        builder.appendField(key.state(), value.state());
	        key = null;
	        value = null;
	        s = 7;
	      }
	      else if (value.isError()) return value;
	    }
	    if (s === 7) {
	      while (!input.isEmpty() && (c = input.head(), isSpace(c))) input.step();
	      if (!input.isEmpty()) {
	        if (c === 44/*','*/ || c === 59/*';'*/ || isNewline(c)) {
	          input.step();
	          s = 2;
	        }
	        else if (c === 125/*'}'*/) {
	          input.step();
	          return new StringIteratee.Done(builder.state());
	        }
	       else return new StringIteratee.Error({expected: '\'}\', \';\', \',\', or newline', found: c});
	      }
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	  }
	  return new RecordParser(builder, key, value, s);
	};


	function MarkupParser(builder, text, value, s) {
	  StringIteratee.call(this);
	  this.builder = builder || null;
	  this.text = text || null;
	  this.value = value || null;
	  this.s = s || 1;
	}
	MarkupParser.prototype = Object.create(StringIteratee.prototype);
	MarkupParser.prototype.constructor = MarkupParser;
	MarkupParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var value = this.value;
	  var text = this.text;
	  var builder = this.builder;
	  if (s === 1) {
	    if (!input.isEmpty()) {
	      c = input.head();
	      if (c === 91/*'['*/) {
	        input.step();
	        s = 2;
	      }
	      else return new StringIteratee.Error({expected: '\'[\'', found: c});
	    }
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  while (!input.isEmpty() || input.isDone()) {
	    if (s === 2) {
	      while (!input.isEmpty() && (c = input.head(),
	          c !== 64/*'@'*/ &&
	          c !== 91/*'['*/ &&
	          c !== 92/*'\\'*/ &&
	          c !== 93/*']'*/ &&
	          c !== 123/*'{'*/ &&
	          c !== 125/*'}'*/)) {
	        input.step();
	        text = text || new StringBuilder();
	        text.append(c);
	      }
	      if (!input.isEmpty()) {
	        if (c === 93/*']'*/) {
	          input.step();
	          builder = builder || new RecordBuilder();
	          if (text) builder.appendValue(text.state());
	          return new StringIteratee.Done(builder.state());
	        }
	        else if (c === 64/*'@'*/) {
	          builder = builder || new RecordBuilder();
	          if (text) {
	            builder.appendValue(text.state());
	            text = null;
	          }
	          value = new InlineValueParser();
	          s = 3;
	        }
	        else if (c === 123/*'{'*/) {
	          builder = builder || new RecordBuilder();
	          if (text) {
	            builder.appendValue(text.state());
	            text = null;
	          }
	          value = new RecordParser(builder);
	          s = 4;
	        }
	        else if (c === 91/*'['*/) {
	          builder = builder || new RecordBuilder();
	          if (text) {
	            builder.appendValue(text.state());
	            text = null;
	          }
	          value = new MarkupParser(builder);
	          s = 4;
	        }
	        else if (c === 92/*'\\'*/) {
	          input.step();
	          s = 5;
	        }
	        else new StringIteratee.Error({found: c});
	      }
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 3) {
	      while ((!input.isEmpty() || input.isDone()) && value.isCont()) value = value.feed(input);
	      if (value.isDone()) {
	        builder.appendValue(value.state());
	        value = null;
	        s = 2;
	      }
	      else if (value.isError()) return value;
	    }
	    if (s === 4) {
	      while ((!input.isEmpty() || input.isDone()) && value.isCont()) value = value.feed(input);
	      if (value.isDone()) {
	        value = null;
	        s = 2;
	      }
	      else if (value.isError()) return value;
	    }
	    if (s === 5) {
	      if (!input.isEmpty()) {
	        c = input.head();
	        text = text || new StringBuilder();
	        if (c === 34/*'"'*/ ||
	            c === 47/*'/'*/ ||
	            c === 64/*'@'*/ ||
	            c === 91/*'['*/ ||
	            c === 92/*'\\'*/ ||
	            c === 93/*']'*/ ||
	            c === 123/*'{'*/ ||
	            c === 125/*'}'*/) {
	          input.step();
	          text.append(c);
	          s = 2;
	        }
	        else if (c === 98/*'b'*/) {
	          input.step();
	          text.append(8/*'\b'*/);
	          s = 2;
	        }
	        else if (c === 102/*'f'*/) {
	          input.step();
	          text.append(12/*'\f'*/);
	          s = 2;
	        }
	        else if (c === 110/*'n'*/) {
	          input.step();
	          text.append(10/*'\n'*/);
	          s = 2;
	        }
	        else if (c === 114/*'r'*/) {
	          input.step();
	          text.append(13/*'\r'*/);
	          s = 2;
	        }
	        else if (c === 116/*'t'*/) {
	          input.step();
	          text.append(9/*'\t'*/);
	          s = 2;
	        }
	        else return new StringIteratee.Error({expected: 'escape character', found: c});
	      }
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	  }
	  return new MarkupParser(builder, text, value, s);
	};


	function IdentParser(builder, s) {
	  StringIteratee.call(this);
	  this.builder = builder || null;
	  this.s = s || 1;
	}
	IdentParser.prototype = Object.create(StringIteratee.prototype);
	IdentParser.prototype.constructor = IdentParser;
	IdentParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var builder = this.builder;
	  if (s === 1) {
	    if (!input.isEmpty() && (c = input.head(), isNameStartChar(c))) {
	      builder = builder || new StringBuilder();
	      input.step();
	      builder.append(c);
	      s = 2;
	    }
	    else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'identitifer', found: c});
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  if (s === 2) {
	    while (!input.isEmpty() && (c = input.head(), isNameChar(c))) {
	      input.step();
	      builder.append(c);
	    }
	    if (!input.isEmpty() || input.isDone()) {
	      var value = builder.state();
	      if (value === 'true') value = true;
	      else if (value === 'false') value = false;
	      return new StringIteratee.Done(value);
	    }
	  }
	  return new IdentParser(builder, s);
	};


	function StringParser(text, s) {
	  StringIteratee.call(this);
	  this.text = text || null;
	  this.s = s || 1;
	}
	StringParser.prototype = Object.create(StringIteratee.prototype);
	StringParser.prototype.constructor = StringParser;
	StringParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var text = this.text;
	  if (s === 1) {
	    if (!input.isEmpty() && (c = input.head(), c === 34/*'"'*/)) {
	      input.step();
	      s = 2;
	    }
	    else if (!input.isEmpty()) return new StringIteratee.Error({expected: '\'"\'', found: c});
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  while (!input.isEmpty() || input.isDone()) {
	    if (s === 2) {
	      text = text || new StringBuilder();
	      while (!input.isEmpty() && (c = input.head(), c !== 34/*'"'*/ && c !== 92/*'\\'*/)) {
	        input.step();
	        text.append(c);
	      }
	      if (!input.isEmpty()) {
	        if (c === 34/*'"'*/) {
	          input.step();
	          return new StringIteratee.Done(text.state());
	        }
	        else if (c === 92/*'\\'*/) {
	          input.step();
	          s = 3;
	        }
	      }
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 3) {
	      if (!input.isEmpty()) {
	        c = input.head();
	        if (c === 34/*'"'*/ ||
	            c === 47/*'/'*/ ||
	            c === 64/*'@'*/ ||
	            c === 91/*'['*/ ||
	            c === 92/*'\\'*/ ||
	            c === 93/*']'*/ ||
	            c === 123/*'{'*/ ||
	            c === 125/*'}'*/) {
	          input.step();
	          text.append(c);
	          s = 2;
	        }
	        else if (c === 98/*'b'*/) {
	          input.step();
	          text.append(8/*'\b'*/);
	          s = 2;
	        }
	        else if (c === 102/*'f'*/) {
	          input.step();
	          text.append(12/*'\f'*/);
	          s = 2;
	        }
	        else if (c === 110/*'n'*/) {
	          input.step();
	          text.append(10/*'\n'*/);
	          s = 2;
	        }
	        else if (c === 114/*'r'*/) {
	          input.step();
	          text.append(13/*'\r'*/);
	          s = 2;
	        }
	        else if (c === 116/*'t'*/) {
	          input.step();
	          text.append(9/*'\t'*/);
	          s = 2;
	        }
	        else return new StringIteratee.Error({expected: 'escape character', found: c});
	      }
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	  }
	  return new StringParser(text, s);
	};


	function NumberParser(builder, s) {
	  StringIteratee.call(this);
	  this.builder = builder || null;
	  this.s = s || 1;
	}
	NumberParser.prototype = Object.create(StringIteratee.prototype);
	NumberParser.prototype.constructor = NumberParser;
	NumberParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var builder = this.builder || new StringBuilder();
	  if (s === 1) {
	    if (!input.isEmpty()) {
	      c = input.head();
	      if (c === 45/*'-'*/) {
	        input.step();
	        builder.append(c);
	      }
	      s = 2;
	    }
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  if (s === 2) {
	    if (!input.isEmpty()) {
	      c = input.head();
	      if (c === 48/*'0'*/) {
	        input.step();
	        builder.append(c);
	        s = 4;
	      }
	      else if (c >= 49/*'1'*/ && c <= 57/*'9'*/) {
	        input.step();
	        builder.append(c);
	        s = 3;
	      }
	      else return new StringIteratee.Error({expected: 'digit', found: c});
	    }
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  if (s === 3) {
	    while (!input.isEmpty() && (c = input.head(), c >= 48/*'0'*/ && c <= 57/*'9'*/)) {
	      input.step();
	      builder.append(c);
	    }
	    if (!input.isEmpty()) s = 4;
	    else if (input.isDone()) return new StringIteratee.Done(Number(builder.state()));
	  }
	  if (s === 4) {
	    if (!input.isEmpty()) {
	      c = input.head();
	      if (c === 46/*'.'*/) {
	        input.step();
	        builder.append(c);
	        s = 5;
	      }
	      else if (c === 69/*'E'*/ || c === 101/*'e'*/) {
	        input.step();
	        builder.append(c);
	        s = 8;
	      }
	      else return new StringIteratee.Done(Number(builder.state()));
	    }
	    else if (input.isDone()) return new StringIteratee.Done(Number(builder.state()));
	  }
	  if (s === 5) {
	    if (!input.isEmpty()) {
	      c = input.head();
	      if (c >= 48/*'0'*/ && c <= 57/*'9'*/) {
	        input.step();
	        builder.append(c);
	        s = 6;
	      }
	      else return new StringIteratee.Error({expected: 'digit', found: c});
	    }
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  if (s === 6) {
	    while (!input.isEmpty() && (c = input.head(), c >= 48/*'0'*/ && c <= 57/*'9'*/)) {
	      input.step();
	      builder.append(c);
	    }
	    if (!input.isEmpty()) s = 7;
	    else if (input.isDone()) return new StringIteratee.Done(Number(builder.state()));
	  }
	  if (s === 7) {
	    c = input.head();
	    if (c === 69/*'E'*/ || c === 101/*'e'*/) {
	      input.step();
	      builder.append(c);
	      s = 8;
	    }
	    else return new StringIteratee.Done(Number(builder.state()));
	  }
	  if (s === 8) {
	    if (!input.isEmpty()) {
	      c = input.head();
	      if (c === 43/*'+'*/ || c === 45/*'-'*/) {
	        input.step();
	        builder.append(c);
	      }
	      s = 9;
	    }
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  if (s === 9) {
	    if (!input.isEmpty()) {
	      c = input.head();
	      if (c >= 48/*'0'*/ && c <= 57/*'9'*/) {
	        input.step();
	        builder.append(c);
	        s = 10;
	      }
	      else return new StringIteratee.Error({expected: 'digit', found: c});
	    }
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  if (s === 10) {
	    while (!input.isEmpty() && (c = input.head(), c >= 48/*'0'*/ && c <= 57/*'9'*/)) {
	      input.step();
	      builder.append(c);
	    }
	    if (!input.isEmpty() || input.isDone()) return new StringIteratee.Done(Number(builder.state()));
	  }
	  return new NumberParser(builder, s);
	};


	function DataParser(data, s) {
	  StringIteratee.call(this);
	  this.data = data || null;
	  this.s = s || 1;
	}
	DataParser.prototype = Object.create(StringIteratee.prototype);
	DataParser.prototype.constructor = DataParser;
	DataParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var data = this.data || new DataBuilder();
	  if (s === 1) {
	    if (!input.isEmpty() && (c = input.head(), c === 37/*'%'*/)) {
	      input.step();
	      s = 2;
	    }
	    else if (!input.isEmpty()) return new StringIteratee.Error({expected: '\'%\'', found: c});
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  while (!input.isEmpty() || input.isDone()) {
	    if (s === 2) {
	      if (!input.isEmpty() && (c = input.head(), isBase64Char(c))) {
	        input.step();
	        data.appendBase64Char(c);
	        s = 3;
	      }
	      else if (!input.isEmpty() || input.isDone()) return new StringIteratee.Done(data.state());
	    }
	    if (s === 3) {
	      if (!input.isEmpty() && (c = input.head(), isBase64Char(c))) {
	        input.step();
	        data.appendBase64Char(c);
	        s = 4;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'base64 digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 4) {
	      if (!input.isEmpty() && (c = input.head(), isBase64Char(c) || c === 61/*'='*/)) {
	        input.step();
	        data.appendBase64Char(c);
	        if (c !== 61/*'='*/) s = 5;
	        else s = 6;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'base64 digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 5) {
	      if (!input.isEmpty() && (c = input.head(), isBase64Char(c) || c === 61/*'='*/)) {
	        input.step();
	        data.appendBase64Char(c);
	        if (c !== 61/*'='*/) s = 2;
	        else return new StringIteratee.Done(data.state());
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'base64 digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    else if (s === 6) {
	      if (!input.isEmpty() && (c = input.head(), c === 61/*'='*/)) {
	        input.step();
	        data.appendBase64Char(c);
	        return new StringIteratee.Done(data.state());
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: '\'=\'', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	  }
	  return new DataParser(data, s);
	};


	function ReconWriter(builder) {
	  this.builder = builder || new StringBuilder();
	}
	ReconWriter.prototype.writeValue = function (value) {
	  if (typeof value === 'string') this.writeText(value);
	  else if (typeof value === 'number') this.writeNumber(value);
	  else if (typeof value === 'boolean') this.writeBool(value);
	  else if (value instanceof Uint8Array) this.writeData(value);
	  else if (isRecord(value)) this.writeRecord(value);
	  else if (isObject(value)) this.writeRecord(coerceObject(value));
	};
	ReconWriter.prototype.writeItem = function (item) {
	  if (isField(item)) this.writeSlots(item);
	  else this.writeValue(item);
	};
	ReconWriter.prototype.writeAttrs = function (attrs) {
	  var keys = Object.keys(attrs);
	  for (var i = 0, n = keys.length; i < n; i += 1) {
	    var key = keys[i];
	    if (key.length > 0 && key.charCodeAt(0) === 64/*'@'*/) {
	      var value = attrs[key];
	      this.writeAttr(key.substring(1), value);
	    }
	  }
	};
	ReconWriter.prototype.writeAttr = function (key, value) {
	  this.builder.append(64/*'@'*/);
	  this.writeIdent(key);
	  if (value !== null) {
	    this.builder.append(40/*'('*/);
	    this.writeBlock(value);
	    this.builder.append(41/*')'*/);
	  }
	};
	ReconWriter.prototype.writeSlots = function (slots) {
	  var keys = Object.keys(slots);
	  var key;
	  var value;
	  var n = keys.length;
	  if (n === 2 && slots.$key !== undefined && slots.$value !== undefined) {
	    key = slots.$key;
	    value = slots.$value;
	    this.writeSlot(key, value);
	  }
	  else for (var i = 0; i < n; i += 1) {
	    key = keys[i];
	    value = slots[key];
	    if (i > 0) this.builder.append(44/*','*/);
	    this.writeSlot(key, value);
	  }
	};
	ReconWriter.prototype.writeSlot = function (key, value) {
	  this.writeValue(key);
	  this.builder.append(58/*':'*/);
	  if (value !== null) this.writeValue(value);
	};
	ReconWriter.prototype.writeBlock = function (value) {
	  if (!isObject(value)) this.writeValue(value);
	  else {
	    if (!isRecord(value)) value = coerceObject(value);
	    if (value.length > 0) this.writeItems(value, isBlockSafe(value), false);
	    else {
	      this.builder.append(123/*'{'*/);
	      this.builder.append(125/*'}'*/);
	    }
	  }
	};
	ReconWriter.prototype.writeRecord = function (record) {
	  if (record.length > 0) this.writeItems(record, false, false);
	  else {
	    this.builder.append(123/*'{'*/);
	    this.builder.append(125/*'}'*/);
	  }
	};
	ReconWriter.prototype.writeItems = function (items, inBlock, inMarkup) {
	  var i = 0;
	  var n = items.length;
	  var inBraces = false;
	  var inBrackets = false;
	  var first = true;
	  while (i < n) {
	    var item = items[i];
	    i += 1;
	    if (inBrackets && isAttr(item)) {
	      if (inBraces) {
	        this.builder.append(125/*'}'*/);
	        inBraces = false;
	      }
	      this.builder.append(93/*']'*/);
	      inBrackets = false;
	    }
	    if (isAttr(item)) {
	      if (inBraces) {
	        this.builder.append(125/*'}'*/);
	        inBraces = false;
	      }
	      else if (inBrackets) {
	        this.builder.append(93/*']'*/);
	        inBrackets = false;
	      }
	      this.writeAttrs(item);
	      first = false;
	    }
	    else if (inBrackets && typeof item === 'string') {
	      if (inBraces) {
	        this.builder.append(125/*'}'*/);
	        inBraces = false;
	      }
	      this.writeMarkupText(item);
	    }
	    else if (inBraces) {
	      if (!first) this.builder.append(44/*','*/);
	      else first = false;
	      this.writeItem(item);
	    }
	    else if (inBrackets) {
	      if (isRecord(item) && isMarkupSafe(item)) {
	        this.writeItems(item, false, true);
	        if (i < n && typeof items[i] === 'string') {
	          this.writeMarkupText(items[i]);
	          i += 1;
	        }
	        else if (i < n && !isAttr(items[i])) {
	          this.builder.append(123/*'{'*/);
	          inBraces = true;
	          first = true;
	        }
	        else {
	          this.builder.append(93/*']'*/);
	          inBrackets = false;
	        }
	      }
	      else {
	        this.builder.append(123/*'{'*/);
	        this.writeItem(item);
	        inBraces = true;
	        first = false;
	      }
	    }
	    else if (typeof item === 'string' &&
	        i < n && !isField(items[i]) &&
	        typeof items[i] !== 'string' && typeof items[i] !== 'boolean') {
	      this.builder.append(91/*'['*/);
	      this.writeMarkupText(item);
	      inBrackets = true;
	    }
	    else if (inBlock && !inBraces) {
	      if (!first) this.builder.append(44/*','*/);
	      else first = false;
	      this.writeItem(item);
	    }
	    else if (inMarkup && typeof item === 'string' && i >= n) {
	      this.builder.append(91/*'['*/);
	      this.writeMarkupText(item);
	      this.builder.append(93/*']'*/);
	    }
	    else if (!inMarkup && !isField(item) && !isRecord(item) &&
	            (!first && i >= n || i < n && isAttr(items[i]))) {
	      if (!first && (typeof item === 'string' && this.isIdent(item) ||
	                     typeof item === 'number' ||
	                     typeof item === 'boolean'))
	        this.builder.append(32/*' '*/);
	      this.writeValue(item);
	    }
	    else {
	      this.builder.append(123/*'{'*/);
	      this.writeItem(item);
	      inBraces = true;
	      first = false;
	    }
	  }
	  if (inBraces) this.builder.append(125/*'}'*/);
	  if (inBrackets) this.builder.append(93/*']'*/);
	};
	ReconWriter.prototype.isIdent = function (text) {
	  var cs = new StringIterator(text);
	  if (cs.isEmpty() || !isNameStartChar(cs.head())) return false;
	  cs.step();
	  while (!cs.isEmpty() && isNameChar(cs.head())) cs.step();
	  return cs.isEmpty();
	};
	ReconWriter.prototype.writeText = function (text) {
	  if (this.isIdent(text)) this.writeIdent(text);
	  else this.writeString(text);
	};
	ReconWriter.prototype.writeIdent = function (ident) {
	  this.builder.appendString(ident);
	};
	ReconWriter.prototype.writeString = function (string) {
	  var cs = new StringIterator(string);
	  this.builder.append(34/*'"'*/);
	  while (!cs.isEmpty()) {
	    var c = cs.head();
	    switch (c) {
	      case 34/*'"'*/:
	      case 92/*'\\'*/: this.builder.append(92/*'\\'*/); this.builder.append(c); break;
	      case 8/*'\b'*/: this.builder.append(92/*'\\'*/); this.builder.append(98/*'b'*/); break;
	      case 12/*'\f'*/: this.builder.append(92/*'\\'*/); this.builder.append(102/*'f'*/); break;
	      case 10/*'\n'*/: this.builder.append(92/*'\\'*/); this.builder.append(110/*'n'*/); break;
	      case 13/*'\r'*/: this.builder.append(92/*'\\'*/); this.builder.append(114/*'r'*/); break;
	      case 9/*'\t'*/: this.builder.append(92/*'\\'*/); this.builder.append(116/*'t'*/); break;
	      default: this.builder.append(c);
	    }
	    cs.step();
	  }
	  this.builder.append(34/*'"'*/);
	};
	ReconWriter.prototype.writeMarkupText = function (text) {
	  var cs = new StringIterator(text);
	  while (!cs.isEmpty()) {
	    var c = cs.head();
	    switch (c) {
	      case 64/*'@'*/:
	      case 91/*'['*/:
	      case 92/*'\\'*/:
	      case 93/*']'*/:
	      case 123/*'{'*/:
	      case 125/*'}'*/: this.builder.append(92/*'\\'*/); this.builder.append(c); break;
	      case 8/*'\b'*/: this.builder.append(92/*'\\'*/); this.builder.append(98/*'b'*/); break;
	      case 12/*'\f'*/: this.builder.append(92/*'\\'*/); this.builder.append(102/*'f'*/); break;
	      case 10/*'\n'*/: this.builder.append(92/*'\\'*/); this.builder.append(110/*'n'*/); break;
	      case 13/*'\r'*/: this.builder.append(92/*'\\'*/); this.builder.append(114/*'r'*/); break;
	      case 9/*'\t'*/: this.builder.append(92/*'\\'*/); this.builder.append(116/*'t'*/); break;
	      default: this.builder.append(c);
	    }
	    cs.step();
	  }
	};
	ReconWriter.prototype.writeNumber = function (number) {
	  this.builder.appendString(number.toString());
	};
	ReconWriter.prototype.writeBool = function (bool) {
	  this.builder.appendString(bool.toString());
	};
	ReconWriter.prototype.writeData = function (data) {
	  function encodeBase64Digit(x) {
	    if (x >= 0 && x < 26) return x + 65/*'A'*/;
	    else if (x >= 26 && x < 52) return x + 71/*('a' - 26)*/;
	    else if (x >= 52 && x < 62) return x - 4/*-('0' - 52)*/;
	    else if (x === 62) return 43/*'+'*/;
	    else if (x === 63) return 47/*'/'*/;
	  }
	  this.builder.append(37/*'%'*/);
	  var i = 0;
	  var n = data.length;
	  var x, y, z;
	  while (i + 2 < n) {
	    x = data[i];
	    y = data[i + 1];
	    z = data[i + 2];
	    this.builder.append(encodeBase64Digit(x >>> 2));
	    this.builder.append(encodeBase64Digit(((x << 4) | (y >>> 4)) & 0x3F));
	    this.builder.append(encodeBase64Digit(((y << 2) | (z >>> 6)) & 0x3F));
	    this.builder.append(encodeBase64Digit(z & 0x3F));
	    i += 3;
	  }
	  if (i + 1 < n) {
	    x = data[i];
	    y = data[i + 1];
	    this.builder.append(encodeBase64Digit(x >>> 2));
	    this.builder.append(encodeBase64Digit(((x << 4) | (y >>> 4)) & 0x3F));
	    this.builder.append(encodeBase64Digit((y << 2) & 0x3F));
	    this.builder.append(61/*'='*/);
	    i += 2;
	  }
	  else if (i < n) {
	    x = data[i];
	    this.builder.append(encodeBase64Digit(x >>> 2));
	    this.builder.append(encodeBase64Digit((x << 4) & 0x3F));
	    this.builder.append(61/*'='*/);
	    this.builder.append(61/*'='*/);
	    i += 1;
	  }
	};
	ReconWriter.prototype.state = function () {
	  return this.builder.state();
	};


	function isUnreservedChar(c) {
	  return (
	    c >= 65/*'A'*/ && c <= 90/*'Z'*/ ||
	    c >= 97/*'a'*/ && c <= 122/*'z'*/ ||
	    c >= 48/*'0'*/ && c <= 57/*'9'*/ ||
	    c === 45/*'-'*/ || c === 46/*'.'*/ ||
	    c === 95/*'_'*/ || c === 126/*'~'*/);
	}

	function isSubDelimChar(c) {
	  return (
	    c === 33/*'!'*/ || c === 36/*'$'*/ ||
	    c === 38/*'&'*/ || c === 40/*'('*/ ||
	    c === 41/*')'*/ || c === 42/*'*'*/ ||
	    c === 43/*'+'*/ || c === 44/*','*/ ||
	    c === 59/*';'*/ || c === 61/*'='*/ ||
	    c === 39/*'\''*/);
	}

	function isSchemeChar(c) {
	  return (
	    c >= 65/*'A'*/ && c <= 90/*'Z'*/ ||
	    c >= 97/*'a'*/ && c <= 122/*'z'*/ ||
	    c >= 48/*'0'*/ && c <= 57/*'9'*/ ||
	    c === 43/*'+'*/ || c === 45/*'-'*/ ||
	    c === 46/*'.'*/);
	}

	function isUserInfoChar(c) {
	  return (
	    isUnreservedChar(c) ||
	    isSubDelimChar(c) ||
	    c === 58/*':'*/);
	}

	function isUserChar(c) {
	  return (
	    isUnreservedChar(c) ||
	    isSubDelimChar(c));
	}

	function isHostChar(c) {
	  return (
	    isUnreservedChar(c) ||
	    isSubDelimChar(c));
	}

	function isPathChar(c) {
	  return (
	    isUnreservedChar(c) ||
	    isSubDelimChar(c) ||
	    c === 58/*':'*/ || c === 64/*'@'*/);
	}

	function isQueryChar(c) {
	  return (
	    isUnreservedChar(c) ||
	    isSubDelimChar(c) ||
	    c === 47/*'/'*/ || c === 58/*':'*/ ||
	    c === 63/*'?'*/ || c === 64/*'@'*/);
	}

	function isParamChar(c) {
	  return (
	    isUnreservedChar(c) ||
	    c === 33/*'!'*/ || c === 36/*'$'*/ ||
	    c === 40/*'('*/ || c === 41/*')'*/ ||
	    c === 42/*'*'*/ || c === 43/*'+'*/ ||
	    c === 44/*','*/ || c === 47/*'/'*/ ||
	    c === 58/*':'*/ || c === 59/*';'*/ ||
	    c === 63/*'?'*/ || c === 64/*'@'*/ ||
	    c === 39/*'\''*/);
	}

	function isFragmentChar(c) {
	  return (
	    isUnreservedChar(c) ||
	    isSubDelimChar(c) ||
	    c === 47/*'/'*/ || c === 58/*':'*/ ||
	    c === 63/*'?'*/ || c === 64/*'@'*/);
	}

	function isAlpha(c) {
	  return (
	    c >= 65/*'A'*/ && c <= 90/*'Z'*/ ||
	    c >= 97/*'a'*/ && c <= 122/*'z'*/);
	}

	function isDigit(c) {
	  return c >= 48/*'0'*/ && c <= 57/*'9'*/;
	}

	function isHexChar(c) {
	  return (
	    c >= 65/*'A'*/ && c <= 70/*'F'*/ ||
	    c >= 97/*'a'*/ && c <= 102/*'f'*/ ||
	    c >= 48/*'0'*/ && c <= 57/*'9'*/);
	}

	function decodeDigit(c) {
	  if (c >= 48/*'0'*/ && c <= 57/*'9'*/) return c - 48/*'0'*/;
	}

	function decodeHex(c) {
	  if (c >= 48/*'0'*/ && c <= 57/*'9'*/) return c - 48/*'0'*/;
	  else if (c >= 65/*'A'*/ && c <= 70/*'F'*/) return 10 + (c - 65/*'A'*/);
	  else if (c >= 97/*'a'*/ && c <= 102/*'f'*/) return 10 + (c - 97/*'a'*/);
	}

	function encodeHex(x) {
	  if (x < 10) return 48/*'0'*/ + x;
	  else return 65/*'A'*/ + (x - 10);
	}

	function toLowerCase(c) {
	  if (c >= 65/*'A'*/ && c <= 90/*'Z'*/) return c + (97/*'a'*/ - 65/*'A'*/);
	  else return c;
	}


	function UriParser(scheme, authority, path, query, fragment, s) {
	  StringIteratee.call(this);
	  this.scheme = scheme || null;
	  this.authority = authority || null;
	  this.path = path || null;
	  this.query = query || null;
	  this.fragment = fragment || null;
	  this.s = s || 1;
	}
	UriParser.prototype = Object.create(StringIteratee.prototype);
	UriParser.prototype.constructor = UriParser;
	UriParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var fragment = this.fragment;
	  var query = this.query;
	  var path = this.path;
	  var authority = this.authority;
	  var scheme = this.scheme;
	  var uri;
	  if (s === 1) {
	    if (!input.isEmpty()) {
	      var look = input.dup();
	      while (!look.isEmpty() && (c = look.head(), isSchemeChar(c))) look.step();
	      if (!look.isEmpty() && c === 58/*':'*/) s = 2;
	      else s = 3;
	    }
	    else if (input.isDone()) s = 3;
	  }
	  if (s === 2) {
	    scheme = scheme || new SchemeParser();
	    scheme = scheme.feed(input);
	    if (scheme.isError()) return scheme;
	    else if (!input.isEmpty() && (c = input.head(), c === 58/*':'*/)) {
	      input.step();
	      s = 3;
	    }
	    else if (!input.isEmpty()) return new StringIteratee.Error({expected: '\':\'', found: c});
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  if (s === 3) {
	    if (!input.isEmpty()) {
	      c = input.head();
	      if (c === 47/*'/'*/) {
	        input.step();
	        s = 4;
	      }
	      else if (c === 63/*'?'*/) {
	        input.step();
	        s = 7;
	      }
	      else if (c === 35/*'#'*/) {
	        input.step();
	        s = 8;
	      }
	      else s = 6;
	    }
	    else if (input.isDone()) {
	      uri = {};
	      if (scheme) uri.scheme = scheme.state();
	      return new StringIteratee.Done(uri);
	    }
	  }
	  if (s === 4) {
	    if (!input.isEmpty() && (c = input.head(), c === 47/*'/'*/)) {
	      input.step();
	      s = 5;
	    }
	    else if (!input.isEmpty()) {
	      path = new PathParser(['/']);
	      s = 6;
	    }
	    else if (input.isDone()) {
	      uri = {};
	      if (scheme) uri.scheme = scheme.state();
	      uri.path = ['/'];
	      return new StringIteratee.Done(uri);
	    }
	  }
	  if (s === 5) {
	    authority = authority || new AuthorityParser();
	    authority = authority.feed(input);
	    if (authority.isError()) return authority;
	    else if (!input.isEmpty()) {
	      c = input.head();
	      if (c === 63/*'?'*/) {
	        input.step();
	        s = 7;
	      }
	      else if (c === 35/*'#'*/) {
	        input.step();
	        s = 8;
	      }
	      else s = 6;
	    }
	    else if (input.isDone()) {
	      uri = {};
	      if (scheme) uri.scheme = scheme.state();
	      if (authority.state()) uri.authority = authority.state();
	      return new StringIteratee.Done(uri);
	    }
	  }
	  if (s === 6) {
	    path = path || new PathParser();
	    path = path.feed(input);
	    if (path.isError()) return path;
	    else if (!input.isEmpty()) {
	      c = input.head();
	      if (c === 63/*'?'*/) {
	        input.step();
	        s = 7;
	      }
	      else if (c === 35/*'#'*/) {
	        input.step();
	        s = 8;
	      }
	      else {
	        uri = {};
	        if (scheme) uri.scheme = scheme.state();
	        if (authority) uri.authority = authority.state();
	        uri.path = path.state();
	        return new StringIteratee.Done(uri);
	      }
	    }
	    else if (input.isDone()) {
	      uri = {};
	      if (scheme) uri.scheme = scheme.state();
	      if (authority) uri.authority = authority.state();
	      uri.path = path.state();
	      return new StringIteratee.Done(uri);
	    }
	  }
	  if (s === 7) {
	    query = query || new QueryParser();
	    query = query.feed(input);
	    if (query.isError()) return query;
	    else if (!input.isEmpty()) {
	      c = input.head();
	      if (c === 35/*'#'*/) {
	        input.step();
	        s = 8;
	      }
	      else {
	        uri = {};
	        if (scheme) uri.scheme = scheme.state();
	        if (authority) uri.authority = authority.state();
	        uri.path = path.state();
	        uri.query = query.state();
	        return new StringIteratee.Done(uri);
	      }
	    }
	    else if (input.isDone()) {
	      uri = {};
	      if (scheme) uri.scheme = scheme.state();
	      if (authority) uri.authority = authority.state();
	      if (path) uri.path = path.state();
	      uri.query = query.state();
	      return new StringIteratee.Done(uri);
	    }
	  }
	  if (s === 8) {
	    fragment = fragment || new FragmentParser();
	    fragment = fragment.feed(input);
	    if (fragment.isError()) return fragment;
	    else if (input.isDone()) {
	      uri = {};
	      if (scheme) uri.scheme = scheme.state();
	      if (authority) uri.authority = authority.state();
	      if (path) uri.path = path.state();
	      if (query) uri.query = query.state();
	      uri.fragment = fragment.state();
	      return new StringIteratee.Done(uri);
	    }
	  }
	  return new UriParser(scheme, authority, path, query, fragment, s);
	};
	UriParser.prototype.state = function () {
	  var scheme = this.scheme.state();
	  var authority = this.authority.state();
	  var path = this.path.state();
	  var query = this.query.state();
	  var fragment = this.fragment.state();
	  var uri = {};
	  if (scheme !== undefined) uri.scheme = scheme;
	  if (authority) uri.authority = authority;
	  if (path) uri.path = path;
	  if (query) uri.query = query;
	  if (fragment !== undefined) uri.fragment = fragment;
	  return uri;
	};


	function SchemeParser(builder, s) {
	  StringIteratee.call(this);
	  this.builder = builder || null;
	  this.s = s || 1;
	}
	SchemeParser.prototype = Object.create(StringIteratee.prototype);
	SchemeParser.prototype.constructor = SchemeParser;
	SchemeParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var builder = this.builder || new StringBuilder();
	  if (s === 1) {
	    if (!input.isEmpty() && (c = input.head(), isAlpha(c))) {
	      input.step();
	      builder.append(toLowerCase(c));
	      s = 2;
	    }
	    else if (!input.isEmpty() || input.isDone()) {
	      return new StringIteratee.Error({expected: 'scheme', found: c});
	    }
	  }
	  if (s === 2) {
	    while (!input.isEmpty() && (c = input.head(), isSchemeChar(c))) {
	      input.step();
	      builder.append(toLowerCase(c));
	    }
	    if (!input.isEmpty() || input.isDone()) return new StringIteratee.Done(builder.state());
	  }
	  return new SchemeParser(builder, s);
	};
	SchemeParser.prototype.state = function () {
	  if (this.builder) return this.builder.state();
	};


	function AuthorityParser(userInfo, host, port, s) {
	  StringIteratee.call(this);
	  this.userInfo = userInfo || null;
	  this.host = host || null;
	  this.port = port || null;
	  this.s = s || 1;
	}
	AuthorityParser.prototype = Object.create(StringIteratee.prototype);
	AuthorityParser.prototype.constructor = AuthorityParser;
	AuthorityParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var port = this.port;
	  var host = this.host;
	  var userInfo = this.userInfo;
	  var authority, hostinfo, userinfo;
	  if (s === 1) {
	    if (!input.isEmpty()) {
	      var look = input.dup();
	      while (!look.isEmpty() && (c = look.head(), c !== 64/*'@'*/ && c !== 47/*'/'*/)) look.step();
	      if (!look.isEmpty() && c === 64/*'@'*/) s = 2;
	      else s = 3;
	    }
	    else if (input.isDone()) s = 3;
	  }
	  if (s === 2) {
	    userInfo = userInfo || new UserInfoParser();
	    userInfo = userInfo.feed(input);
	    if (userInfo.isError()) return userInfo;
	    else if (!input.isEmpty() && (c = input.head(), c === 64/*'@'*/)) {
	      input.step();
	      s = 3;
	    }
	    else if (!input.isEmpty()) return new StringIteratee.Error({expected: 64/*'@'*/, found: c});
	    else if (input.isDone()) return StringIteratee.unexpectedEOF();
	  }
	  if (s === 3) {
	    host = host || new HostParser();
	    host = host.feed(input);
	    if (host.isError()) return host;
	    else if (!input.isEmpty() && input.head() === 58/*':'*/) {
	      input.step();
	      s = 4;
	    }
	    else if (!input.isEmpty() || input.isDone()) {
	      if (host.state()) {
	        authority = {};
	        hostinfo = host.state();
	        if (hostinfo.name !== undefined) authority.host = hostinfo.name;
	        if (hostinfo.ipv4 !== undefined) authority.ipv4 = hostinfo.ipv4;
	        if (hostinfo.ipv6 !== undefined) authority.ipv6 = hostinfo.ipv6;
	        if (userInfo) {
	          userinfo = userInfo.state();
	          if (typeof userinfo === 'string') authority.userInfo = userinfo;
	          else if (userinfo) {
	            authority.username = userinfo.username;
	            authority.password = userinfo.password;
	          }
	        }
	        return new StringIteratee.Done(authority);
	      }
	      else if (userInfo) {
	        authority = {};
	        userinfo = userInfo.state();
	        if (typeof userinfo === 'string') authority.userInfo = userinfo;
	        else if (userinfo) {
	          authority.username = userinfo.username;
	          authority.password = userinfo.password;
	        }
	        return new StringIteratee.Done(authority);
	      }
	      return new StringIteratee.Done(undefined);
	    }
	  }
	  if (s === 4) {
	    port = port || new PortParser();
	    port = port.feed(input);
	    if (port.isError()) return port;
	    else if (!input.isEmpty() || input.isDone()) {
	      authority = {};
	      hostinfo = host.state();
	      if (hostinfo.name !== undefined) authority.host = hostinfo.name;
	      if (hostinfo.ipv4 !== undefined) authority.ipv4 = hostinfo.ipv4;
	      if (hostinfo.ipv6 !== undefined) authority.ipv6 = hostinfo.ipv6;
	      authority.port = port.state();
	      if (userInfo) {
	        userinfo = userInfo.state();
	        if (typeof userinfo === 'string') authority.userInfo = userinfo;
	        else if (userinfo) {
	          authority.username = userinfo.username;
	          authority.password = userinfo.password;
	        }
	      }
	      return new StringIteratee.Done(authority);
	    }
	  }
	  return new AuthorityParser(userInfo, host, port, s);
	};
	AuthorityParser.prototype.state = function () {
	  if (this.host && this.host.state()) {
	    var authority = {};
	    var hostinfo = this.host.state();
	    if (hostinfo.name !== undefined) authority.host = hostinfo.name;
	    if (hostinfo.ipv4 !== undefined) authority.ipv4 = hostinfo.ipv4;
	    if (hostinfo.ipv6 !== undefined) authority.ipv6 = hostinfo.ipv6;
	    if (this.port) authority.port = this.port.state();
	    if (this.userInfo) {
	      var userinfo = this.userInfo.state();
	      if (typeof userinfo === 'string') authority.userInfo = userinfo;
	      else if (userinfo) {
	        authority.username = userinfo.username;
	        authority.password = userinfo.password;
	      }
	    }
	    return authority;
	  }
	};


	function UserInfoParser(username, password, c1, s) {
	  StringIteratee.call(this);
	  this.username = username || null;
	  this.password = password || null;
	  this.c1 = c1 || 0;
	  this.s = s || 1;
	}
	UserInfoParser.prototype = Object.create(StringIteratee.prototype);
	UserInfoParser.prototype.constructor = UserInfoParser;
	UserInfoParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var c1 = this.c1;
	  var password = this.password;
	  var username = this.username;
	  while (!input.isEmpty() || input.isDone()) {
	    if (s === 1) {
	      if (!username && !input.isEmpty()) username = new StringBuilder();
	      while (!input.isEmpty() && (c = input.head(), isUserChar(c))) {
	        input.step();
	        username.append(c);
	      }
	      if (!input.isEmpty() && c === 58/*':'*/) {
	        input.step();
	        s = 4;
	      }
	      else if (!input.isEmpty() && c === 37/*'%'*/) {
	        input.step();
	        s = 2;
	      }
	      else if (!input.isEmpty() || input.isDone()) {
	        return new StringIteratee.Done(username.state());
	      }
	    }
	    if (s === 2) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        c1 = c;
	        s = 3;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 3) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        username.append((decodeHex(c1) << 4) + decodeHex(c));
	        c1 = 0;
	        s = 1;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 4) {
	      password = password || new StringBuilder();
	      while (!input.isEmpty() && (c = input.head(), isUserInfoChar(c))) {
	        input.step();
	        password.append(c);
	      }
	      if (!input.isEmpty() && c === 37/*'%'*/) {
	        input.step();
	        s = 5;
	      }
	      else if (!input.isEmpty() || input.isDone()) {
	        var userInfo = {username: username.state(), password: password.state()};
	        return new StringIteratee.Done(userInfo);
	      }
	    }
	    if (s === 5) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        c1 = c;
	        s = 6;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 6) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        password.append((decodeHex(c1) << 4) + decodeHex(c));
	        c1 = 0;
	        s = 4;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	  }
	  return new UserInfoParser(username, password, c1, s);
	};
	UserInfoParser.prototype.state = function () {
	  if (this.password) return {username: this.username.state(), password: this.password.state()};
	  else if (this.username) return this.username.state();
	};


	function HostParser() {
	  StringIteratee.call(this);
	}
	HostParser.prototype = Object.create(StringIteratee.prototype);
	HostParser.prototype.constructor = HostParser;
	HostParser.prototype.feed = function (input) {
	  if (!input.isEmpty()) {
	    var c = input.head();
	    if (c === 91/*'['*/) return new HostLiteralParser().feed(input);
	    else return new HostAddressParser().feed(input);
	  }
	  return this;
	};


	function HostAddressParser(builder, c1, x, s) {
	  StringIteratee.call(this);
	  this.builder = builder || null;
	  this.c1 = c1 || 0;
	  this.x = x || 0;
	  this.s = s || 1;
	}
	HostAddressParser.prototype = Object.create(StringIteratee.prototype);
	HostAddressParser.prototype.constructor = HostAddressParser;
	HostAddressParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var x = this.x;
	  var c1 = this.c1;
	  var builder = this.builder;
	  var host;
	  while (s <= 4 && (!input.isEmpty() || input.isDone())) {
	    builder = builder || new StringBuilder();
	    while (!input.isEmpty() && (c = input.head(), isDigit(c))) {
	      input.step();
	      builder.append(c);
	      x = 10 * x + decodeDigit(c);
	    }
	    if (!input.isEmpty()) {
	      if (c === 46/*'.'*/ && s < 4 && x <= 255) {
	        input.step();
	        builder.append(c);
	        x = 0;
	        s += 1;
	      }
	      else if (!isHostChar(c) && c !== 37/*'%'*/ && s === 4 && x <= 255) {
	        host = {ipv4: builder.state()};
	        return new StringIteratee.Done(host);
	      }
	      else {
	        x = 0;
	        s = 5;
	      }
	    }
	    else if (input.isDone()) {
	      if (s === 4 && x <= 255) {
	        host = {ipv4: builder.state()};
	        return new StringIteratee.Done(host);
	      }
	      else {
	        host = {name: builder.state()};
	        return new StringIteratee.Done(host);
	      }
	    }
	  }
	  while (!input.isEmpty() || input.isDone()) {
	    if (s === 5) {
	      while (!input.isEmpty() && (c = input.head(), isHostChar(c))) {
	        input.step();
	        builder.append(toLowerCase(c));
	      }
	      if (!input.isEmpty() && c === 37/*'%'*/) {
	        input.step();
	        s = 6;
	      }
	      else if (!input.isEmpty() || input.isDone()) {
	        host = {name: builder.state()};
	        return new StringIteratee.Done(host);
	      }
	    }
	    if (s === 6) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        c1 = c;
	        s = 7;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 7) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        builder.append((decodeHex(c1) << 4) + decodeHex(c));
	        c1 = 0;
	        s = 5;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	  }
	  return new HostAddressParser(builder, c1, x, s);
	};
	HostAddressParser.prototype.state = function () {
	  if (this.builder) {
	    if (this.s === 4 && this.x <= 255) return {ipv4: this.builder.state()};
	    else return {name: this.builder.state()};
	  }
	};


	function HostLiteralParser(builder, s) {
	  StringIteratee.call(this);
	  this.builder = builder || null;
	  this.s = s || 1;
	}
	HostLiteralParser.prototype = Object.create(StringIteratee.prototype);
	HostLiteralParser.prototype.constructor = HostLiteralParser;
	HostLiteralParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var builder = this.builder;
	  if (s === 1) {
	    if (!input.isEmpty() && (c = input.head(), c === 91/*'['*/)) {
	      input.step();
	      s = 2;
	    }
	    else if (!input.isEmpty()) return new StringIteratee.Error({expected: '\'[\'', found: c});
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  if (s === 2) {
	    builder = builder || new StringBuilder();
	    while (!input.isEmpty() && (c = input.head(), isHostChar(c) || c === 58/*':'*/)) {
	      input.step();
	      builder.append(toLowerCase(c));
	    }
	    if (!input.isEmpty() && c === 93/*']'*/) {
	      input.step();
	      var host = {ipv6: builder.state()};
	      return new StringIteratee.Done(host);
	    }
	    else if (!input.isEmpty()) return new StringIteratee.Error({found: c});
	    else if (input.isDone()) return StringIteratee.unexpectedEOF;
	  }
	  return new HostLiteralParser(builder, s);
	};
	HostLiteralParser.prototype.state = function () {
	  if (this.builder) return {ipv6: this.builder.state()};
	};


	function PortParser(port) {
	  StringIteratee.call(this);
	  this.port = port || 0;
	}
	PortParser.prototype = Object.create(StringIteratee.prototype);
	PortParser.prototype.constructor = PortParser;
	PortParser.prototype.feed = function (input) {
	  var c = 0;
	  var port = this.port;
	  while (!input.isEmpty() && (c = input.head(), isDigit(c))) {
	    input.step();
	    port = 10 * port + decodeDigit(c);
	  }
	  if (!input.isEmpty() || input.isDone()) return new StringIteratee.Done(port);
	  return new PortParser(port);
	};
	PortParser.prototype.state = function () {
	  if (this.port !== 0) return this.port;
	};


	function PathParser(path, builder, c1, s) {
	  StringIteratee.call(this);
	  this.path = path || null;
	  this.builder = builder || null;
	  this.c1 = c1 || 0;
	  this.s = s || 1;
	}
	PathParser.prototype = Object.create(StringIteratee.prototype);
	PathParser.prototype.constructor = PathParser;
	PathParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var c1 = this.c1;
	  var builder = this.builder;
	  var path = this.path;
	  while (!input.isEmpty() || input.isDone()) {
	    if (s === 1) {
	      while (!input.isEmpty() && (c = input.head(), isPathChar(c))) {
	        builder = builder || new StringBuilder();
	        input.step();
	        builder.append(c);
	      }
	      if (!input.isEmpty() && c === 47/*'/'*/) {
	        input.step();
	        path = path || [];
	        if (builder) {
	          path.push(builder.state());
	          builder = null;
	        }
	        path.push('/');
	      }
	      else if (!input.isEmpty() && c === 37/*'%'*/) {
	        input.step();
	        s = 2;
	      }
	      else if (!input.isEmpty() || input.isDone()) {
	        path = path || [];
	        if (builder) path.push(builder.state());
	        return new StringIteratee.Done(path);
	      }
	    }
	    if (s === 2) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        c1 = c;
	        s = 3;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 3) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        builder = builder || new StringBuilder();
	        input.step();
	        builder.append((decodeHex(c1) << 4) + decodeHex(c));
	        c1 = 0;
	        s = 1;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	  }
	  return new PathParser(path, builder, c1, s);
	};
	PathParser.prototype.state = function () {
	  if (this.path) return this.path;
	  else return [];
	};


	function QueryParser(key, value, query, c1, s) {
	  StringIteratee.call(this);
	  this.key = key || null;
	  this.value = value || null;
	  this.query = query || null;
	  this.c1 = c1 || 0;
	  this.s = s || 1;
	}
	QueryParser.prototype = Object.create(StringIteratee.prototype);
	QueryParser.prototype.constructor = QueryParser;
	QueryParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var c1 = this.c1;
	  var query = this.query;
	  var value = this.value;
	  var key = this.key;
	  var k, v, param;
	  while (!input.isEmpty() || input.isDone()) {
	    if (s === 1) {
	      key = key || new StringBuilder();
	      while (!input.isEmpty() && (c = input.head(), isParamChar(c))) {
	        input.step();
	        key.append(c);
	      }
	      if (!input.isEmpty() && c === 61/*'='*/) {
	        input.step();
	        s = 4;
	      }
	      else if (!input.isEmpty() && c === 38/*'&'*/) {
	        input.step();
	        query = query || [];
	        query.push(key.state());
	        key = null;
	        s = 1;
	      }
	      else if (!input.isEmpty() && c === 37/*'%'*/) {
	        input.step();
	        s = 2;
	      }
	      else if (!input.isEmpty() || input.isDone()) {
	        if (!query) return new StringIteratee.Done(key.state());
	        else {
	          query.push(key.state());
	          return new StringIteratee.Done(query);
	        }
	      }
	    }
	    if (s === 2) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        c1 = c;
	        s = 3;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 3) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        key.append((decodeHex(c1) << 4) + decodeHex(c));
	        c1 = 0;
	        s = 1;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 4) {
	      value = value || new StringBuilder();
	      while (!input.isEmpty() && (c = input.head(), isParamChar(c) || c === 61/*'='*/)) {
	        input.step();
	        value.append(c);
	      }
	      if (!input.isEmpty() && c === 38/*'&'*/) {
	        input.step();
	        k = key.state();
	        v = value.state();
	        param = {};
	        param[k] = v;
	        query = query || [];
	        query.push(param);
	        query[k] = v;
	        key = null;
	        value = null;
	        s = 1;
	      }
	      else if (!input.isEmpty() && c === 38/*'%'*/) {
	        input.step();
	        s = 5;
	      }
	      else if (!input.isEmpty() || input.isDone()) {
	        k = key.state();
	        v = value.state();
	        param = {};
	        param[k] = v;
	        query = query || [];
	        query.push(param);
	        query[k] = v;
	        return new StringIteratee.Done(query);
	      }
	    }
	    if (s === 5) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        c1 = c;
	        s = 6;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 6) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        value.append((decodeHex(c1) << 4) + decodeHex(c));
	        c1 = 0;
	        s = 4;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	  }
	  return new QueryParser(key, value, query, c1, s);
	};
	QueryParser.prototype.state = function () {
	  if (this.query) return this.query;
	};


	function FragmentParser(builder, c1, s) {
	  StringIteratee.call(this);
	  this.builder = builder || null;
	  this.c1 = c1 || 0;
	  this.s = s || 1;
	}
	FragmentParser.prototype = Object.create(StringIteratee.prototype);
	FragmentParser.prototype.constructor = FragmentParser;
	FragmentParser.prototype.feed = function (input) {
	  var c = 0;
	  var s = this.s;
	  var c1 = this.c1;
	  var builder = this.builder || new StringBuilder();
	  while (!input.isEmpty() || input.isDone()) {
	    if (s === 1) {
	      while (!input.isEmpty() && (c = input.head(), isFragmentChar(c))) {
	        input.step();
	        builder.append(c);
	      }
	      if (!input.isEmpty() && c === 37/*'%'*/) {
	        input.step();
	        s = 2;
	      }
	      else if (!input.isEmpty() || input.isDone()) {
	        return new StringIteratee.Done(builder.state());
	      }
	    }
	    if (s === 2) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        c1 = c;
	        s = 3;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	    if (s === 3) {
	      if (!input.isEmpty() && (c = input.head(), isHexChar(c))) {
	        input.step();
	        builder.append((decodeHex(c1) << 4) + decodeHex(c));
	        c1 = 0;
	        s = 1;
	      }
	      else if (!input.isEmpty()) return new StringIteratee.Error({expected: 'hex digit', found: c});
	      else if (input.isDone()) return StringIteratee.unexpectedEOF;
	    }
	  }
	  return new FragmentParser(builder, c1, s);
	};
	FragmentParser.prototype.state = function () {
	  if (this.builder) return this.builder.state();
	};


	function parseUri(string) {
	  var input = new StringIterator(string);
	  var result = new UriParser().run(input);
	  return result.state();
	}
	function parseAuthority(string) {
	  var input = new StringIterator(string);
	  var result = new AuthorityParser().run(input);
	  return result.state();
	}
	function parsePath(string) {
	  var input = new StringIterator(string);
	  var result = new PathParser().run(input);
	  return result.state();
	}
	function stringifyUri(uri) {
	  var writer = new UriWriter();
	  writer.writeUri(uri);
	  return writer.state();
	}
	function resolveUri(base, relative) {
	  if (typeof base === 'string') base = parseUri(base);
	  if (typeof relative === 'string') relative = parseUri(relative);
	  var absolute = {};
	  if (relative.scheme) {
	    absolute.scheme = relative.scheme;
	    if (relative.authority) absolute.authority = relative.authority;
	    if (relative.path) absolute.path = removeDotSegments(relative.path);
	    if (relative.query !== undefined) absolute.query = relative.query;
	    if (relative.fragment !== undefined) absolute.fragment = relative.fragment;
	  }
	  else if (relative.authority) {
	    if (base.scheme) absolute.scheme = base.scheme;
	    absolute.authority = relative.authority;
	    if (relative.path) absolute.path = removeDotSegments(relative.path);
	    if (relative.query !== undefined) absolute.query = relative.query;
	    if (relative.fragment !== undefined) absolute.fragment = relative.fragment;
	  }
	  else if (!relative.path || !relative.path.length) {
	    if (base.scheme) absolute.scheme = base.scheme;
	    if (base.authority) absolute.authority = base.authority;
	    if (base.path) absolute.path = base.path;
	    if (relative.query !== undefined) absolute.query = relative.query;
	    else if (base.query !== undefined) absolute.query = base.query;
	    if (relative.fragment !== undefined) absolute.fragment = relative.fragment;
	  }
	  else if (relative.path[0] === '/') {
	    if (base.scheme) absolute.scheme = base.scheme;
	    if (base.authority) absolute.authority = base.authority;
	    if (relative.path) absolute.path = removeDotSegments(relative.path);
	    if (relative.query !== undefined) absolute.query = relative.query;
	    if (relative.fragment !== undefined) absolute.fragment = relative.fragment;
	  }
	  else {
	    if (base.scheme) absolute.scheme = base.scheme;
	    if (base.authority) absolute.authority = base.authority;
	    absolute.path = removeDotSegments(mergeUriPath(base, relative.path));
	    if (relative.query !== undefined) absolute.query = relative.query;
	    if (relative.fragment !== undefined) absolute.fragment = relative.fragment;
	  }
	  return absolute;
	}
	function mergeUriPath(base, relativePath) {
	  if (base.authority && (!base.path || !base.path.length)) {
	    var segments = relativePath.slice();
	    segments.unshift('/');
	    return segments;
	  }
	  else if (!base.path || !base.path.length) return relativePath;
	  else return mergePath(base.path.slice(), relativePath);
	}
	function mergePath(basePath, relativePath) {
	  var segments = [];
	  var head = basePath.shift();
	  while (basePath.length > 0) {
	    segments.push(head);
	    head = basePath.shift();
	  }
	  if (head === '/') segments.push(head);
	  for (var i = 0, n = relativePath.length; i < n; i += 1) {
	    segments.push(relativePath[i]);
	  }
	  return segments;
	}
	function removeDotSegments(path) {
	  var segments = [];
	  while (path.length > 0) {
	    var head = path[0];
	    if (head === '.' || head === '..') {
	      path = path.slice(path.length > 1 ? 2 : 1);
	    }
	    else if (head === '/') {
	      if (path.length > 1) {
	        var next = path[1];
	        if (next === '.') {
	          path = path.length > 2 ? path.slice(2) : ['/'];
	        }
	        else if (next === '..') {
	          path = path.length > 2 ? path.slice(2) : ['/'];
	          if (segments.length > 1 && segments[segments.length - 1] !== '/') {
	            segments = segments.slice(0, segments.length - 2);
	          }
	          else if (segments.length > 0) {
	            segments = segments.slice(0, segments.length - 1);
	          }
	        }
	        else {
	          segments.push(head);
	          segments.push(next);
	          path = path.slice(2);
	        }
	      }
	      else {
	        segments.push('/');
	        path.shift();
	      }
	    }
	    else {
	      segments.push(head);
	      path.shift();
	    }
	  }
	  return segments;
	}
	function unresolveUri(base, absolute) {
	  if (typeof base === 'string') base = parseUri(base);
	  if (typeof absolute === 'string') absolute = parseUri(absolute);
	  if (base.scheme !== absolute.scheme || !equal(base.authority, absolute.authority)) return absolute;
	  var relative = {};
	  var basePath = base.path;
	  if (typeof basePath === 'string') basePath = parsePath(basePath);
	  else if (!basePath) basePath = [];
	  else basePath = basePath.slice();
	  var absolutePath = absolute.path;
	  if (typeof absolutePath === 'string') absolutePath = parsePath(absolutePath);
	  else if (!absolutePath) absolutePath = [];
	  var relativePath = unmergePath(basePath, absolutePath.slice(), absolutePath);
	  if (relativePath.length > 0) relative.path = relativePath;
	  if (absolute.query !== undefined) relative.query = absolute.query;
	  if (absolute.fragment !== undefined) relative.fragment = absolute.fragment;
	  return relative;
	}
	function unmergePath(basePath, relativePath, absolutePath) {
	  if (basePath.length === 0) {
	    if (relativePath.length > 1) relativePath.shift();
	    return relativePath;
	  }
	  else if (basePath[0] !== '/') {
	    return relativePath;
	  }
	  else if (relativePath.length === 0 || relativePath[0] !== '/') {
	    relativePath.unshift('/');
	    return relativePath;
	  }
	  else {
	    basePath.shift();
	    relativePath.shift();
	    if (basePath.length > 0 && relativePath.length === 0) return ['/'];
	    else if (basePath.length === 0 || relativePath.length === 0 || basePath[0] !== relativePath[0]) {
	      return relativePath;
	    }
	    else {
	      basePath.shift();
	      relativePath.shift();
	      if (basePath.length > 0 && relativePath.length === 0) return absolutePath;
	      else return unmergePath(basePath, relativePath, absolutePath);
	    }
	  }
	}

	function UriWriter(builder) {
	  this.builder = builder || new StringBuilder();
	}
	UriWriter.prototype.writeUri = function (uri) {
	  if (uri.scheme) {
	    this.writeScheme(uri.scheme);
	    this.builder.append(58/*':'*/);
	  }
	  if (uri.authority) {
	    this.builder.append(47/*'/'*/);
	    this.builder.append(47/*'/'*/);
	    this.writeAuthority(uri.authority);
	  }
	  if (uri.path) {
	    this.writePath(uri.path);
	  }
	  if (uri.query !== undefined) {
	    this.builder.append(63/*'?'*/);
	    this.writeQuery(uri.query);
	  }
	  if (uri.fragment !== undefined) {
	    this.builder.append(35/*'#'*/);
	    this.writeFragment(uri.fragment);
	  }
	};
	UriWriter.prototype.writeScheme = function (scheme) {
	  var cs = new StringIterator(scheme);
	  while (!cs.isEmpty()) {
	    var c = cs.head();
	    if (isSchemeChar(c)) this.builder.append(c);
	    else throw 'Invalid URI scheme: ' + scheme;
	    cs.step();
	  }
	};
	UriWriter.prototype.writeAuthority = function (authority) {
	  if (typeof authority === 'string') authority = parseAuthority(authority);
	  if (authority.userInfo !== undefined) {
	    this.writeUserInfo(authority.userInfo);
	    this.builder.append(64/*'@'*/);
	  }
	  else if (authority.username !== undefined && authority.password !== undefined) {
	    this.writeUser(authority.username);
	    this.builder.append(58/*':'*/);
	    this.writeUserInfo(authority.password);
	    this.builder.append(64/*'@'*/);
	  }
	  if (authority.host !== undefined) {
	    this.writeHost(authority.host);
	  }
	  else if (authority.ipv4 !== undefined) {
	    this.writeHost(authority.ipv4);
	  }
	  else if (authority.ipv6 !== undefined) {
	    this.builder.append(91/*'['*/);
	    this.writeHostLiteral(authority.ipv6);
	    this.builder.append(93/*']'*/);
	  }
	  if (authority.port) {
	    this.builder.append(58/*':'*/);
	    this.writePort(authority.port);
	  }
	};
	UriWriter.prototype.writeUserInfo = function (userInfo) {
	  var cs = new StringIterator(userInfo);
	  while (!cs.isEmpty()) {
	    var c = cs.head();
	    if (isUserInfoChar(c)) this.builder.append(c);
	    else this.writeEncoded(c);
	    cs.step();
	  }
	};
	UriWriter.prototype.writeUser = function (user) {
	  var cs = new StringIterator(user);
	  while (!cs.isEmpty()) {
	    var c = cs.head();
	    if (isUserChar(c)) this.builder.append(c);
	    else this.writeEncoded(c);
	    cs.step();
	  }
	};
	UriWriter.prototype.writeHost = function (host) {
	  var cs = new StringIterator(host);
	  while (!cs.isEmpty()) {
	    var c = cs.head();
	    if (isHostChar(c)) this.builder.append(c);
	    else this.writeEncoded(c);
	    cs.step();
	  }
	};
	UriWriter.prototype.writeHostLiteral = function (host) {
	  var cs = new StringIterator(host);
	  while (!cs.isEmpty()) {
	    var c = cs.head();
	    if (isHostChar(c) || c === 58/*':'*/) this.builder.append(c);
	    else this.writeEncoded(c);
	    cs.step();
	  }
	};
	UriWriter.prototype.writePort = function (port) {
	  var i = 9;
	  var digits = new Array(10);
	  while (port > 0) {
	    digits[i] = port % 10;
	    port = Math.floor(port / 10);
	    i -= 1;
	  }
	  i += 1;
	  while (i < 10) {
	    this.builder.append(48/*'0'*/ + digits[i]);
	    i += 1;
	  }
	};
	UriWriter.prototype.writePath = function (path) {
	  if (typeof path === 'string') path = parsePath(path);
	  for (var i = 0, n = path.length; i < n; i += 1) {
	    var segment = path[i];
	    if (segment === '/') this.builder.append(47/*'/'*/);
	    else this.writePathSegment(segment);
	  }
	};
	UriWriter.prototype.writePathSegment = function (segment) {
	  var cs = new StringIterator(segment);
	  while (!cs.isEmpty()) {
	    var c = cs.head();
	    if (isPathChar(c)) this.builder.append(c);
	    else this.writeEncoded(c);
	    cs.step();
	  }
	};
	UriWriter.prototype.writeQuery = function (query) {
	  if (typeof query === 'string') this.writeQueryPart(query);
	  else if (Array.isArray(query)) this.writeQueryArray(query);
	  else if (query) this.writeQueryParams(query);
	};
	UriWriter.prototype.writeQueryArray = function (query) {
	  for (var i = 0, n = query.length; i < n; i += 1) {
	    var param = query[i];
	    if (typeof param === 'string') {
	      if (i > 0) this.builder.append(38/*'&'*/);
	      this.writeQueryParam(param);
	    }
	    else this.writeQueryParams(param, i);
	  }
	};
	UriWriter.prototype.writeQueryParams = function (params, i) {
	  var keys = Object.keys(params);
	  for (var j = 0, n = keys.length; j < n; i += 1, j += 1) {
	    var key = keys[j];
	    var value = params[key];
	    if (i > 0) this.builder.append(38/*'&'*/);
	    this.writeQueryParam(key);
	    this.builder.append(61/*'='*/);
	    this.writeQueryParam(value);
	  }
	};
	UriWriter.prototype.writeQueryParam = function (param) {
	  var cs = new StringIterator(param);
	  while (!cs.isEmpty()) {
	    var c = cs.head();
	    if (isParamChar(c)) this.builder.append(c);
	    else this.writeEncoded(c);
	    cs.step();
	  }
	};
	UriWriter.prototype.writeQueryPart = function (query) {
	  var cs = new StringIterator(query);
	  while (!cs.isEmpty()) {
	    var c = cs.head();
	    if (isQueryChar(c)) this.builder.append(c);
	    else this.writeEncoded(c);
	    cs.step();
	  }
	};
	UriWriter.prototype.writeFragment = function (fragment) {
	  var cs = new StringIterator(fragment);
	  while (!cs.isEmpty()) {
	    var c = cs.head();
	    if (isFragmentChar(c)) this.builder.append(c);
	    else this.writeEncoded(c);
	    cs.step();
	  }
	};
	UriWriter.prototype.writeEncoded = function (c) {
	  if (c === 0x00) { // modified UTF-8
	    this.writePctEncoded(0xC0);
	    this.writePctEncoded(0x80);
	  }
	  else if (c >= 0x00 && c <= 0x7F) { // U+0000..U+007F
	    this.writePctEncoded(c);
	  }
	  else if (c >= 0x80 && c <= 0x07FF) { // U+0080..U+07FF
	    this.writePctEncoded(0xC0 | (c >>> 6));
	    this.writePctEncoded(0x80 | (c & 0x3F));
	  }
	  else if (c >= 0x0800 && c <= 0xFFFF || // U+0800..U+D7FF
	           c >= 0xE000 && c <= 0xFFFF) { // U+E000..U+FFFF
	    this.writePctEncoded(0xE0 | (c >>> 12));
	    this.writePctEncoded(0x80 | (c >>> 6 & 0x3F));
	    this.writePctEncoded(0x80 | (c & 0x3F));
	  }
	  else if (c >= 0x10000 && c <= 0x10FFFF) { // U+10000..U+10FFFF
	    this.writePctEncoded(0xF0 | (c >>> 18));
	    this.writePctEncoded(0x80 | (c >>> 12 & 0x3F));
	    this.writePctEncoded(0x80 | (c >>> 6 & 0x3F));
	    this.writePctEncoded(0x80 | (c & 0x3F));
	  }
	  else { // surrogate or invalid code point
	    this.writePctEncoded(0xEF);
	    this.writePctEncoded(0xBF);
	    this.writePctEncoded(0xBD);
	  }
	};
	UriWriter.prototype.writePctEncoded = function (c) {
	  this.builder.append(37/*'%'*/);
	  this.builder.append(encodeHex(c >>> 4 & 0xF));
	  this.builder.append(encodeHex(c & 0xF));
	};
	UriWriter.prototype.state = function () {
	  return this.builder.state();
	};

	var uri = {};
	uri.parse = parseUri;
	uri.stringify = stringifyUri;
	uri.resolve = resolveUri;
	uri.unresolve = unresolveUri;


	module.exports = function (value) {
	  return coerce.apply(null, arguments);
	};
	exports = module.exports;
	exports.parse = parse;
	exports.stringify = stringify;
	exports.base64 = base64;
	exports.isRecord = isRecord;
	exports.size = size;
	exports.head = head;
	exports.tail = tail;
	exports.tag = tag;
	exports.has = has;
	exports.get = get;
	exports.set = set;
	exports.remove = remove;
	exports.keys = keys;
	exports.values = values;
	exports.forEach = forEach;
	exports.concat = concat;
	exports.equal = equal;
	exports.compare = compare;
	exports.uri = uri;
	exports.config = config;
	exports.StringIterator = StringIterator;
	exports.DocumentParser = DocumentParser;
	exports.BlockParser = BlockParser;
	exports.RecordParser = RecordParser;
	exports.UriParser = UriParser;
	exports.SchemeParser = SchemeParser;
	exports.AuthorityParser = AuthorityParser;
	exports.PathParser = PathParser;
	exports.QueryParser = QueryParser;
	exports.FragmentParser = FragmentParser;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = {
		"version": "0.3.11"
	};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var config = __webpack_require__(6);
	var recon = global.recon || __webpack_require__(3);

	function decode(record) {
	  switch (recon.tag(record)) {
	    case '@event': return EventMessage.decode(record);
	    case '@command': return CommandMessage.decode(record);
	    case '@link': return LinkRequest.decode(record);
	    case '@linked': return LinkedResponse.decode(record);
	    case '@sync': return SyncRequest.decode(record);
	    case '@synced': return SyncedResponse.decode(record);
	    case '@unlink': return UnlinkRequest.decode(record);
	    case '@unlinked': return UnlinkedResponse.decode(record);
	    case '@auth': return AuthRequest.decode(record);
	    case '@authed': return AuthedResponse.decode(record);
	    case '@deauth': return DeauthRequest.decode(record);
	    case '@deauthed': return DeauthedResponse.decode(record);
	  }
	}

	function encode(envelope) {
	  return envelope.encode();
	}

	function parse(string) {
	  return decode(recon.parse(string));
	}

	function stringify(envelope) {
	  return recon.stringify(encode(envelope));
	}


	function Envelope() {}
	Object.defineProperty(Envelope.prototype, 'isRequest', {value: false});
	Object.defineProperty(Envelope.prototype, 'isResponse', {value: false});
	Object.defineProperty(Envelope.prototype, 'isMessage', {value: false});
	Object.defineProperty(Envelope.prototype, 'isEventMessage', {value: false});
	Object.defineProperty(Envelope.prototype, 'isCommandMessage', {value: false});
	Object.defineProperty(Envelope.prototype, 'isLinkRequest', {value: false});
	Object.defineProperty(Envelope.prototype, 'isLinkedResponse', {value: false});
	Object.defineProperty(Envelope.prototype, 'isSyncRequest', {value: false});
	Object.defineProperty(Envelope.prototype, 'isSyncedResponse', {value: false});
	Object.defineProperty(Envelope.prototype, 'isUnlinkRequest', {value: false});
	Object.defineProperty(Envelope.prototype, 'isUnlinkedResponse', {value: false});
	Object.defineProperty(Envelope.prototype, 'isAuthRequest', {value: false});
	Object.defineProperty(Envelope.prototype, 'isAuthedResponse', {value: false});
	Object.defineProperty(Envelope.prototype, 'isDeauthRequest', {value: false});
	Object.defineProperty(Envelope.prototype, 'isDeauthedResponse', {value: false});


	function RequestEnvelope() {
	  Envelope.call(this);
	}
	RequestEnvelope.prototype = Object.create(Envelope.prototype);
	RequestEnvelope.prototype.constructor = RequestEnvelope;
	Object.defineProperty(RequestEnvelope.prototype, 'isRequest', {value: true});


	function ResponseEnvelope() {
	  Envelope.call(this);
	}
	ResponseEnvelope.prototype = Object.create(Envelope.prototype);
	ResponseEnvelope.prototype.constructor = ResponseEnvelope;
	Object.defineProperty(ResponseEnvelope.prototype, 'isResponse', {value: true});


	function MessageEnvelope() {
	  Envelope.call(this);
	}
	MessageEnvelope.prototype = Object.create(Envelope.prototype);
	MessageEnvelope.prototype.constructor = MessageEnvelope;
	Object.defineProperty(MessageEnvelope.prototype, 'isMessage', {value: true});


	function EventMessage(node, lane, body) {
	  MessageEnvelope.call(this);
	  this.node = node;
	  this.lane = lane;
	  this.body = body;
	}
	EventMessage.prototype = Object.create(MessageEnvelope.prototype);
	EventMessage.prototype.constructor = EventMessage;
	Object.defineProperty(EventMessage.prototype, 'isEventMessage', {value: true});
	EventMessage.prototype.withAddress = function (node, lane) {
	  if (node === undefined) node = this.node;
	  if (lane === undefined) lane = this.lane;
	  return new EventMessage(node, lane, this.body);
	};
	EventMessage.prototype.encode = function () {
	  var headers = [{node: this.node}, {lane: this.lane}];
	  return recon.concat({'@event': headers}, this.body);
	};
	EventMessage.decode = function (record) {
	  var node, lane;
	  var body = recon.tail(record);
	  var headers = recon.head(record);
	  var n = headers && headers.length || 0;
	  for (var i = 0; i < n; i += 1) {
	    var header = headers[i];
	    if (header.node !== undefined) node = header.node;
	    else if (header.lane !== undefined) lane = header.lane;
	    else if (i === 0) node = header;
	    else if (i === 1) lane = header;
	  }
	  if (node !== undefined && lane !== undefined) {
	    return new EventMessage(node, lane, body);
	  }
	};


	function CommandMessage(node, lane, body) {
	  MessageEnvelope.call(this);
	  this.node = node;
	  this.lane = lane;
	  this.body = body;
	}
	CommandMessage.prototype = Object.create(MessageEnvelope.prototype);
	CommandMessage.prototype.constructor = CommandMessage;
	Object.defineProperty(CommandMessage.prototype, 'isCommandMessage', {value: true});
	CommandMessage.prototype.withAddress = function (node, lane) {
	  if (node === undefined) node = this.node;
	  if (lane === undefined) lane = this.lane;
	  return new CommandMessage(node, lane, this.body);
	};
	CommandMessage.prototype.encode = function () {
	  var headers = [{node: this.node}, {lane: this.lane}];
	  return recon.concat({'@command': headers}, this.body);
	};
	CommandMessage.decode = function (record) {
	  var node, lane;
	  var body = recon.tail(record);
	  var headers = recon.head(record);
	  var n = headers && headers.length || 0;
	  for (var i = 0; i < n; i += 1) {
	    var header = headers[i];
	    if (header.node !== undefined) node = header.node;
	    else if (header.lane !== undefined) lane = header.lane;
	    else if (i === 0) node = header;
	    else if (i === 1) lane = header;
	  }
	  if (node !== undefined && lane !== undefined) {
	    return new CommandMessage(node, lane, body);
	  }
	};


	function LinkRequest(node, lane, prio, body) {
	  RequestEnvelope.call(this);
	  this.node = node;
	  this.lane = lane;
	  this.prio = prio || 0.0;
	  this.body = body;
	}
	LinkRequest.prototype = Object.create(RequestEnvelope.prototype);
	LinkRequest.prototype.constructor = LinkRequest;
	Object.defineProperty(LinkRequest.prototype, 'isLinkRequest', {value: true});
	LinkRequest.prototype.withAddress = function (node, lane) {
	  if (node === undefined) node = this.node;
	  if (lane === undefined) lane = this.lane;
	  return new LinkRequest(node, lane, this.prio, this.body);
	};
	LinkRequest.prototype.encode = function () {
	  var headers = [{node: this.node}, {lane: this.lane}];
	  if (this.prio) headers.push({prio: this.prio});
	  return recon.concat({'@link': headers}, this.body);
	};
	LinkRequest.decode = function (record) {
	  var node, lane, prio;
	  var body = recon.tail(record);
	  var headers = recon.head(record);
	  var n = headers && headers.length || 0;
	  for (var i = 0; i < n; i += 1) {
	    var header = headers[i];
	    if (header.node !== undefined) node = header.node;
	    else if (header.lane !== undefined) lane = header.lane;
	    else if (header.prio !== undefined) prio = header.prio;
	    else if (i === 0) node = header;
	    else if (i === 1) lane = header;
	  }
	  if (node !== undefined && lane !== undefined) {
	    return new LinkRequest(node, lane, prio, body);
	  }
	};


	function LinkedResponse(node, lane, prio, body) {
	  ResponseEnvelope.call(this);
	  this.node = node;
	  this.lane = lane;
	  this.prio = prio || 0.0;
	  this.body = body;
	}
	LinkedResponse.prototype = Object.create(ResponseEnvelope.prototype);
	LinkedResponse.prototype.constructor = LinkedResponse;
	Object.defineProperty(LinkedResponse.prototype, 'isLinkedResponse', {value: true});
	LinkedResponse.prototype.withAddress = function (node, lane) {
	  if (node === undefined) node = this.node;
	  if (lane === undefined) lane = this.lane;
	  return new LinkedResponse(node, lane, this.prio, this.body);
	};
	LinkedResponse.prototype.encode = function () {
	  var headers = [{node: this.node}, {lane: this.lane}];
	  if (this.prio) headers.push({prio: this.prio});
	  return recon.concat({'@linked': headers}, this.body);
	};
	LinkedResponse.decode = function (record) {
	  var node, lane, prio;
	  var body = recon.tail(record);
	  var headers = recon.head(record);
	  var n = headers && headers.length || 0;
	  for (var i = 0; i < n; i += 1) {
	    var header = headers[i];
	    if (header.node !== undefined) node = header.node;
	    else if (header.lane !== undefined) lane = header.lane;
	    else if (header.prio !== undefined) prio = header.prio;
	    else if (i === 0) node = header;
	    else if (i === 1) lane = header;
	  }
	  if (node !== undefined && lane !== undefined) {
	    return new LinkedResponse(node, lane, prio, body);
	  }
	};


	function SyncRequest(node, lane, prio, body) {
	  RequestEnvelope.call(this);
	  this.node = node;
	  this.lane = lane;
	  this.prio = prio || 0.0;
	  this.body = body;
	}
	SyncRequest.prototype = Object.create(RequestEnvelope.prototype);
	SyncRequest.prototype.constructor = SyncRequest;
	Object.defineProperty(SyncRequest.prototype, 'isSyncRequest', {value: true});
	SyncRequest.prototype.withAddress = function (node, lane) {
	  if (node === undefined) node = this.node;
	  if (lane === undefined) lane = this.lane;
	  return new SyncRequest(node, lane, this.prio, this.body);
	};
	SyncRequest.prototype.encode = function () {
	  var headers = [{node: this.node}, {lane: this.lane}];
	  if (this.prio) headers.push({prio: this.prio});
	  return recon.concat({'@sync': headers}, this.body);
	};
	SyncRequest.decode = function (record) {
	  var node, lane, prio;
	  var body = recon.tail(record);
	  var headers = recon.head(record);
	  var n = headers && headers.length || 0;
	  for (var i = 0; i < n; i += 1) {
	    var header = headers[i];
	    if (header.node !== undefined) node = header.node;
	    else if (header.lane !== undefined) lane = header.lane;
	    else if (header.prio !== undefined) prio = header.prio;
	    else if (i === 0) node = header;
	    else if (i === 1) lane = header;
	  }
	  if (node !== undefined && lane !== undefined) {
	    return new SyncRequest(node, lane, prio, body);
	  }
	};


	function SyncedResponse(node, lane, body) {
	  ResponseEnvelope.call(this);
	  this.node = node;
	  this.lane = lane;
	  this.body = body;
	}
	SyncedResponse.prototype = Object.create(ResponseEnvelope.prototype);
	SyncedResponse.prototype.constructor = SyncedResponse;
	Object.defineProperty(SyncedResponse.prototype, 'isSyncedResponse', {value: true});
	SyncedResponse.prototype.withAddress = function (node, lane) {
	  if (node === undefined) node = this.node;
	  if (lane === undefined) lane = this.lane;
	  return new SyncedResponse(node, lane, this.body);
	};
	SyncedResponse.prototype.encode = function () {
	  var headers = [{node: this.node}, {lane: this.lane}];
	  return recon.concat({'@synced': headers}, this.body);
	};
	SyncedResponse.decode = function (record) {
	  var node, lane;
	  var body = recon.tail(record);
	  var headers = recon.head(record);
	  var n = headers && headers.length || 0;
	  for (var i = 0; i < n; i += 1) {
	    var header = headers[i];
	    if (header.node !== undefined) node = header.node;
	    else if (header.lane !== undefined) lane = header.lane;
	    else if (i === 0) node = header;
	    else if (i === 1) lane = header;
	  }
	  if (node !== undefined && lane !== undefined) {
	    return new SyncedResponse(node, lane, body);
	  }
	};


	function UnlinkRequest(node, lane, body) {
	  RequestEnvelope.call(this);
	  this.node = node;
	  this.lane = lane;
	  this.body = body;
	}
	UnlinkRequest.prototype = Object.create(RequestEnvelope.prototype);
	UnlinkRequest.prototype.constructor = UnlinkRequest;
	Object.defineProperty(UnlinkRequest.prototype, 'isUnlinkRequest', {value: true});
	UnlinkRequest.prototype.withAddress = function (node, lane) {
	  if (node === undefined) node = this.node;
	  if (lane === undefined) lane = this.lane;
	  return new UnlinkRequest(node, lane, this.body);
	};
	UnlinkRequest.prototype.encode = function () {
	  var headers = [{node: this.node}, {lane: this.lane}];
	  return recon.concat({'@unlink': headers}, this.body);
	};
	UnlinkRequest.decode = function (record) {
	  var node, lane;
	  var body = recon.tail(record);
	  var headers = recon.head(record);
	  var n = headers && headers.length || 0;
	  for (var i = 0; i < n; i += 1) {
	    var header = headers[i];
	    if (header.node !== undefined) node = header.node;
	    else if (header.lane !== undefined) lane = header.lane;
	    else if (i === 0) node = header;
	    else if (i === 1) lane = header;
	  }
	  if (node !== undefined && lane !== undefined) {
	    return new UnlinkRequest(node, lane, body);
	  }
	};


	function UnlinkedResponse(node, lane, body) {
	  ResponseEnvelope.call(this);
	  this.node = node;
	  this.lane = lane;
	  this.body = body;
	}
	UnlinkedResponse.prototype = Object.create(ResponseEnvelope.prototype);
	UnlinkedResponse.prototype.constructor = UnlinkedResponse;
	Object.defineProperty(UnlinkedResponse.prototype, 'isUnlinkedResponse', {value: true});
	UnlinkedResponse.prototype.withAddress = function (node, lane) {
	  if (node === undefined) node = this.node;
	  if (lane === undefined) lane = this.lane;
	  return new UnlinkedResponse(node, lane, this.body);
	};
	UnlinkedResponse.prototype.encode = function () {
	  var headers = [{node: this.node}, {lane: this.lane}];
	  return recon.concat({'@unlinked': headers}, this.body);
	};
	UnlinkedResponse.decode = function (record) {
	  var node, lane;
	  var body = recon.tail(record);
	  var headers = recon.head(record);
	  var n = headers && headers.length || 0;
	  for (var i = 0; i < n; i += 1) {
	    var header = headers[i];
	    if (header.node !== undefined) node = header.node;
	    else if (header.lane !== undefined) lane = header.lane;
	    else if (i === 0) node = header;
	    else if (i === 1) lane = header;
	  }
	  if (node !== undefined && lane !== undefined) {
	    return new UnlinkedResponse(node, lane, body);
	  }
	};


	function AuthRequest(body) {
	  RequestEnvelope.call(this);
	  this.body = body;
	}
	AuthRequest.prototype = Object.create(RequestEnvelope.prototype);
	AuthRequest.prototype.constructor = AuthRequest;
	Object.defineProperty(AuthRequest.prototype, 'isAuthRequest', {value: true});
	AuthRequest.prototype.encode = function () {
	  return recon.concat({'@auth': null}, this.body);
	};
	AuthRequest.decode = function (record) {
	  var body = recon.tail(record);
	  return new AuthRequest(body);
	};


	function AuthedResponse(body) {
	  ResponseEnvelope.call(this);
	  this.body = body;
	}
	AuthedResponse.prototype = Object.create(ResponseEnvelope.prototype);
	AuthedResponse.prototype.constructor = AuthedResponse;
	Object.defineProperty(AuthedResponse.prototype, 'isAuthedResponse', {value: true});
	AuthedResponse.prototype.encode = function () {
	  return recon.concat({'@authed': null}, this.body);
	};
	AuthedResponse.decode = function (record) {
	  var body = recon.tail(record);
	  return new AuthedResponse(body);
	};


	function DeauthRequest(body) {
	  RequestEnvelope.call(this);
	  this.body = body;
	}
	DeauthRequest.prototype = Object.create(RequestEnvelope.prototype);
	DeauthRequest.prototype.constructor = DeauthRequest;
	Object.defineProperty(DeauthRequest.prototype, 'isDeauthRequest', {value: true});
	DeauthRequest.prototype.encode = function () {
	  return recon.concat({'@deauth': null}, this.body);
	};
	DeauthRequest.decode = function (record) {
	  var body = recon.tail(record);
	  return new DeauthRequest(body);
	};


	function DeauthedResponse(body) {
	  ResponseEnvelope.call(this);
	  this.body = body;
	}
	DeauthedResponse.prototype = Object.create(ResponseEnvelope.prototype);
	DeauthedResponse.prototype.constructor = DeauthedResponse;
	Object.defineProperty(DeauthedResponse.prototype, 'isDeauthedResponse', {value: true});
	DeauthedResponse.prototype.encode = function () {
	  return recon.concat({'@deauthed': null}, this.body);
	};
	DeauthedResponse.decode = function (record) {
	  var body = recon.tail(record);
	  return new DeauthedResponse(body);
	};


	exports.decode = decode;
	exports.encode = encode;
	exports.parse = parse;
	exports.stringify = stringify;
	exports.Envelope = Envelope;
	exports.RequestEnvelope = RequestEnvelope;
	exports.ResponseEnvelope = ResponseEnvelope;
	exports.MessageEnvelope = MessageEnvelope;
	exports.EventMessage = EventMessage;
	exports.CommandMessage = CommandMessage;
	exports.SyncRequest = SyncRequest;
	exports.SyncedResponse = SyncedResponse;
	exports.LinkRequest = LinkRequest;
	exports.LinkedResponse = LinkedResponse;
	exports.UnlinkRequest = UnlinkRequest;
	exports.UnlinkedResponse = UnlinkedResponse;
	exports.AuthRequest = AuthRequest;
	exports.AuthedResponse = AuthedResponse;
	exports.DeauthRequest = DeauthRequest;
	exports.DeauthedResponse = DeauthedResponse;
	exports.config = config;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = {
		"version": "0.4.2"
	};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var _global = (function() { return this; })();
	var NativeWebSocket = _global.WebSocket || _global.MozWebSocket;
	var websocket_version = __webpack_require__(8);


	/**
	 * Expose a W3C WebSocket class with just one or two arguments.
	 */
	function W3CWebSocket(uri, protocols) {
		var native_instance;

		if (protocols) {
			native_instance = new NativeWebSocket(uri, protocols);
		}
		else {
			native_instance = new NativeWebSocket(uri);
		}

		/**
		 * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
		 * class). Since it is an Object it will be returned as it is when creating an
		 * instance of W3CWebSocket via 'new W3CWebSocket()'.
		 *
		 * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
		 */
		return native_instance;
	}


	/**
	 * Module exports.
	 */
	module.exports = {
	    'w3cwebsocket' : NativeWebSocket ? W3CWebSocket : null,
	    'version'      : websocket_version
	};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9).version;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	module.exports = {
		"_args": [
			[
				{
					"raw": "websocket@^1.0.23",
					"scope": null,
					"escapedName": "websocket",
					"name": "websocket",
					"rawSpec": "^1.0.23",
					"spec": ">=1.0.23 <2.0.0",
					"type": "range"
				},
				"/home/derek/Projects/swim-dev-tools/node_modules/swim-client-js"
			]
		],
		"_from": "websocket@>=1.0.23 <2.0.0",
		"_id": "websocket@1.0.24",
		"_inCache": true,
		"_location": "/websocket",
		"_nodeVersion": "7.3.0",
		"_npmOperationalInternal": {
			"host": "packages-12-west.internal.npmjs.com",
			"tmp": "tmp/websocket-1.0.24.tgz_1482977757939_0.1858439394272864"
		},
		"_npmUser": {
			"name": "theturtle32",
			"email": "brian@worlize.com"
		},
		"_npmVersion": "3.10.10",
		"_phantomChildren": {},
		"_requested": {
			"raw": "websocket@^1.0.23",
			"scope": null,
			"escapedName": "websocket",
			"name": "websocket",
			"rawSpec": "^1.0.23",
			"spec": ">=1.0.23 <2.0.0",
			"type": "range"
		},
		"_requiredBy": [
			"/swim-client-js"
		],
		"_resolved": "https://registry.npmjs.org/websocket/-/websocket-1.0.24.tgz",
		"_shasum": "74903e75f2545b6b2e1de1425bc1c905917a1890",
		"_shrinkwrap": null,
		"_spec": "websocket@^1.0.23",
		"_where": "/home/derek/Projects/swim-dev-tools/node_modules/swim-client-js",
		"author": {
			"name": "Brian McKelvey",
			"email": "brian@worlize.com",
			"url": "https://www.worlize.com/"
		},
		"browser": "lib/browser.js",
		"bugs": {
			"url": "https://github.com/theturtle32/WebSocket-Node/issues"
		},
		"config": {
			"verbose": false
		},
		"contributors": [
			{
				"name": "Iñaki Baz Castillo",
				"email": "ibc@aliax.net",
				"url": "http://dev.sipdoc.net"
			}
		],
		"dependencies": {
			"debug": "^2.2.0",
			"nan": "^2.3.3",
			"typedarray-to-buffer": "^3.1.2",
			"yaeti": "^0.0.6"
		},
		"description": "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",
		"devDependencies": {
			"buffer-equal": "^1.0.0",
			"faucet": "^0.0.1",
			"gulp": "git+https://github.com/gulpjs/gulp.git#4.0",
			"gulp-jshint": "^2.0.4",
			"jshint": "^2.0.0",
			"jshint-stylish": "^2.2.1",
			"tape": "^4.0.1"
		},
		"directories": {
			"lib": "./lib"
		},
		"dist": {
			"shasum": "74903e75f2545b6b2e1de1425bc1c905917a1890",
			"tarball": "https://registry.npmjs.org/websocket/-/websocket-1.0.24.tgz"
		},
		"engines": {
			"node": ">=0.8.0"
		},
		"gitHead": "0e15f9445953927c39ce84a232cb7dd6e3adf12e",
		"homepage": "https://github.com/theturtle32/WebSocket-Node",
		"keywords": [
			"websocket",
			"websockets",
			"socket",
			"networking",
			"comet",
			"push",
			"RFC-6455",
			"realtime",
			"server",
			"client"
		],
		"license": "Apache-2.0",
		"main": "index",
		"maintainers": [
			{
				"name": "theturtle32",
				"email": "brian@worlize.com"
			}
		],
		"name": "websocket",
		"optionalDependencies": {},
		"readme": "ERROR: No README data found!",
		"repository": {
			"type": "git",
			"url": "git+https://github.com/theturtle32/WebSocket-Node.git"
		},
		"scripts": {
			"gulp": "gulp",
			"install": "(node-gyp rebuild 2> builderror.log) || (exit 0)",
			"test": "faucet test/unit"
		},
		"version": "1.0.24"
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var State = __webpack_require__(11)
	var tokenize = __webpack_require__(12)

	var tokenizedCache = {}

	module.exports = function jsonQuery (query, options) {

	  // extract params for ['test[param=?]', 'value'] type queries
	  var params = options && options.params || null
	  if (Array.isArray(query)) {
	    params = query.slice(1)
	    query = query[0]
	  }

	  if (!tokenizedCache[query]) {
	    tokenizedCache[query] = tokenize(query, true)
	  }

	  return handleQuery(tokenizedCache[query], options, params)
	}


	module.exports.lastParent = function (query) {
	  var last = query.parents[query.parents.length - 1]
	  if (last) {
	    return last.value
	  } else {
	    return null
	  }
	}


	function handleQuery (tokens, options, params) {
	  var state = new State(options, params, handleQuery)

	  for (var i = 0; i < tokens.length; i++) {
	    if (handleToken(tokens[i], state)) {
	      break
	    }
	  }

	  // flush
	  handleToken(null, state)

	  // set databind hooks
	  if (state.currentItem instanceof Object) {
	    state.addReference(state.currentItem)
	  } else {
	    var parentObject = getLastParentObject(state.currentParents)
	    if (parentObject) {
	      state.addReference(parentObject)
	    }
	  }

	  return {
	    value: state.currentItem,
	    key: state.currentKey,
	    references: state.currentReferences,
	    parents: state.currentParents
	  }
	}

	function handleToken (token, state) {
	  // state: setCurrent, getValue, getValues, resetCurrent, deepQuery, rootContext, currentItem, currentKey, options, filters

	  if (token == null) {
	    // process end of query
	    if (!state.currentItem && state.options.force) {
	      state.force(state.options.force)
	    }
	  } else if (token.values) {
	    if (state.currentItem) {
	      var keys = Object.keys(state.currentItem)
	      var values = []
	      keys.forEach(function (key) {
	        if (token.deep && Array.isArray(state.currentItem[key])) {
	          state.currentItem[key].forEach(function (item) {
	            values.push(item)
	          })
	        } else {
	          values.push(state.currentItem[key])
	        }
	      })
	      state.setCurrent(keys, values)
	    } else {
	      state.setCurrent(keys, [])
	    }
	  } else if (token.get) {
	    var key = state.getValue(token.get)
	    if (shouldOverride(state, key)) {
	      state.setCurrent(key, state.override[key])
	    } else {
	      if (state.currentItem || (state.options.force && state.force({}))) {
	        if (isDeepAccessor(state.currentItem, key) || token.multiple) {
	          var values = state.currentItem.map(function (item) {
	            return item[key]
	          }).filter(isDefined)

	          values = Array.prototype.concat.apply([], values) // flatten

	          state.setCurrent(key, values)
	        } else {
	          state.setCurrent(key, state.currentItem[key])
	        }
	      } else {
	        state.setCurrent(key, null)
	      }
	    }
	  } else if (token.select) {
	    if (Array.isArray(state.currentItem) || (state.options.force && state.force([]))) {
	      var match = (token.boolean ? token.select : [token]).map(function (part) {
	        if (part.op === ':') {
	          var key = state.getValue(part.select[0])
	          return {
	            func: function (item) {
	              if (key) {
	                item = item[key]
	              }
	              return state.getValueFrom(part.select[1], item)
	            },
	            negate: part.negate,
	            booleanOp: part.booleanOp
	          }
	        } else {
	          var selector = state.getValues(part.select)
	          if (!state.options.allowRegexp && part.op === '~' && selector[1] instanceof RegExp) throw new Error('options.allowRegexp is not enabled.')
	          return {
	            key: selector[0],
	            value: selector[1],
	            negate: part.negate,
	            booleanOp: part.booleanOp,
	            op: part.op
	          }
	        }
	      })

	      if (token.multiple) {
	        var keys = []
	        var value = []
	        state.currentItem.forEach(function (item, i) {
	          if (matches(item, match)) {
	            keys.push(i)
	            value.push(item)
	          }
	        })
	        state.setCurrent(keys, value)
	      } else {
	        if (!state.currentItem.some(function (item, i) {
	          if (matches(item, match)) {
	            state.setCurrent(i, item)
	            return true
	          }
	        })) {
	          state.setCurrent(null, null)
	        }
	      }
	    } else {
	      state.setCurrent(null, null)
	    }
	  } else if (token.root) {
	    state.resetCurrent()
	    if (token.args && token.args.length) {
	      state.setCurrent(null, state.getValue(token.args[0]))
	    } else {
	      state.setCurrent(null, state.rootContext)
	    }
	  } else if (token.parent) {
	    state.resetCurrent()
	    state.setCurrent(null, state.options.parent)
	  } else if (token.or) {
	    if (state.currentItem) {
	      return true
	    } else {
	      state.resetCurrent()
	      state.setCurrent(null, state.context)
	    }
	  } else if (token.filter) {
	    var helper = state.getLocal(token.filter) || state.getGlobal(token.filter)
	    if (typeof helper === 'function') {
	      // function(input, args...)
	      var values = state.getValues(token.args || [])
	      var result = helper.apply(state.options, [state.currentItem].concat(values))
	      state.setCurrent(null, result)
	    } else {
	      // fallback to old filters
	      var filter = state.getFilter(token.filter)
	      if (typeof filter === 'function') {
	        var values = state.getValues(token.args || [])
	        var result = filter.call(state.options, state.currentItem, {args: values, state: state, data: state.rootContext})
	        state.setCurrent(null, result)
	      }
	    }
	  } else if (token.deep) {
	    if (state.currentItem) {
	      if (token.deep.length === 0) {
	        return
	      }

	      var result = state.deepQuery(state.currentItem, token.deep, state.options)
	      if (result) {
	        state.setCurrent(result.key, result.value)
	        for (var i = 0; i < result.parents.length; i++) {
	          state.currentParents.push(result.parents[i])
	        }
	      } else {
	        state.setCurrent(null, null)
	      }
	    } else {
	      state.currentItem = null
	    }
	  }
	}

	function matches (item, parts) {
	  var result = false
	  for (var i = 0; i < parts.length; i++) {
	    var opts = parts[i]
	    var r = false
	    if (opts.func) {
	      r = opts.func(item)
	    } else if (opts.op === '~') {
	      if (opts.value instanceof RegExp) {
	        r = item[opts.key] && !!item[opts.key].match(opts.value)
	      } else {
	        r = item[opts.key] && !!~item[opts.key].indexOf(opts.value)
	      }
	    } else if (opts.op === '=') {
	      if ((item[opts.key] === true && opts.value === 'true') || (item[opts.key] === false && opts.value === 'false')) {
	        r = true
	      } else {
	        r = item[opts.key] == opts.value
	      }
	    } else if (opts.op === '>') {
	      r = item[opts.key] > opts.value
	    } else if (opts.op === '<') {
	      r = item[opts.key] < opts.value
	    } else if (opts.op === '>=') {
	      r = item[opts.key] >= opts.value
	    } else if (opts.op === '<=') {
	      r = item[opts.key] <= opts.value
	    }

	    if (opts.negate) {
	      r = !r
	    }
	    if (opts.booleanOp === '&') {
	      result = result && r
	    } else if (opts.booleanOp === '|') {
	      result = result || r
	    } else {
	      result = r
	    }
	  }

	  return result
	}

	function isDefined(value) {
	  return typeof value !== 'undefined'
	}

	function shouldOverride (state, key) {
	  return state.override && state.currentItem === state.rootContext && state.override[key] !== undefined
	}

	function isDeepAccessor (currentItem, key) {
	  return currentItem instanceof Array && parseInt(key) != key
	}

	function getLastParentObject (parents) {
	  for (var i = 0; i < parents.length; i++) {
	    if (!(parents[i + 1]) || !(parents[i + 1].value instanceof Object)) {
	      return parents[i].value
	    }
	  }
	}


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = State

	function State(options, params, handleQuery){

	  options = options || {}

	  //this.options = options
	  this.handleQuery = handleQuery
	  this.options = options
	  this.locals = this.options.locals || {}
	  this.globals = this.options.globals || {}
	  this.rootContext = firstNonNull(options.data, options.rootContext, options.context, options.source)
	  this.parent = options.parent
	  this.override = options.override
	  this.filters = options.filters || {}
	  this.params = params || options.params || []
	  this.context = firstNonNull(options.currentItem, options.context, options.source)
	  this.currentItem = firstNonNull(this.context, options.rootContext, options.data)
	  this.currentKey = null
	  this.currentReferences = []
	  this.currentParents = []
	}

	State.prototype = {

	  // current manipulation
	  setCurrent: function(key, value){
	    if (this.currentItem || this.currentKey || this.currentParents.length>0){
	      this.currentParents.push({key: this.currentKey, value: this.currentItem})
	    }
	    this.currentItem = value
	    this.currentKey = key
	  },

	  resetCurrent: function(){
	    this.currentItem = null
	    this.currentKey = null
	    this.currentParents = []
	  },

	  force: function(def){
	    var parent = this.currentParents[this.currentParents.length-1]
	    if (!this.currentItem && parent && (this.currentKey != null)){
	      this.currentItem = def || {}
	      parent.value[this.currentKey] = this.currentItem
	    }
	    return !!this.currentItem
	  },

	  getLocal: function(localName){
	    if (~localName.indexOf('/')){
	      var result = null
	      var parts = localName.split('/')

	      for (var i=0;i<parts.length;i++){
	        var part = parts[i]
	        if (i == 0){
	          result = this.locals[part]
	        } else if (result && result[part]){
	          result = result[part]
	        }
	      }

	      return result
	    } else {
	      return this.locals[localName]
	    }
	  },

	  getGlobal: function(globalName){
	    if (~globalName.indexOf('/')){
	      var result = null
	      var parts = globalName.split('/')

	      for (var i=0;i<parts.length;i++){
	        var part = parts[i]
	        if (i == 0){
	          result = this.globals[part]
	        } else if (result && result[part]){
	          result = result[part]
	        }
	      }

	      return result
	    } else {
	      return this.globals[globalName]
	    }
	  },

	  getFilter: function(filterName){
	    if (~filterName.indexOf('/')){
	      var result = null
	      var filterParts = filterName.split('/')

	      for (var i=0;i<filterParts.length;i++){
	        var part = filterParts[i]
	        if (i == 0){
	          result = this.filters[part]
	        } else if (result && result[part]){
	          result = result[part]
	        }
	      }

	      return result
	    } else {
	      return this.filters[filterName]
	    }
	  },

	  addReferences: function(references){
	    if (references){
	      references.forEach(this.addReference, this)
	    }
	  },

	  addReference: function(ref){
	    if (ref instanceof Object && !~this.currentReferences.indexOf(ref)){
	      this.currentReferences.push(ref)
	    }
	  },

	  // helper functions
	  getValues: function(values, callback){
	    return values.map(this.getValue, this)
	  },

	  getValue: function (value) {
	    return this.getValueFrom(value, null)
	  },

	  getValueFrom: function (value, item) {
	    if (value._param != null){
	      return this.params[value._param]
	    } else if (value._sub){

	      var options = copy(this.options)
	      options.force = null
	      options.currentItem = item

	      var result = this.handleQuery(value._sub, options, this.params)
	      this.addReferences(result.references)
	      return result.value

	    } else {
	      return value
	    }
	  },

	  deepQuery: function(source, tokens, options, callback){
	    var keys = Object.keys(source)

	    for (var key in source){
	      if (key in source){

	        var options = copy(this.options)
	        options.currentItem = source[key]

	        var result = this.handleQuery(tokens, options, this.params)

	        if (result.value){
	          return result
	        }
	      }
	    }

	    return null
	  }

	}

	function firstNonNull(args){
	  for (var i=0;i<arguments.length;i++){
	    if (arguments[i] != null){
	      return arguments[i]
	    }
	  }
	}

	function copy(obj){
	  var result = {}
	  if (obj){
	    for (var key in obj){
	      if (key in obj){
	        result[key] = obj[key]
	      }
	    }
	  }
	  return result
	}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	// todo: syntax checking
	// todo: test handle args
	var depthSplit = __webpack_require__(13)

	module.exports = function(query, shouldAssignParamIds){
	  if (!query) return []

	  var result = []
	    , prevChar, char
	    , nextChar = query.charAt(0)
	    , bStart = 0
	    , bEnd = 0
	    , partOffset = 0
	    , pos = 0
	    , depth = 0
	    , mode = 'get'
	    , deepQuery = null

	  // if query contains params then number them
	  if (shouldAssignParamIds){
	    query = assignParamIds(query)
	  }

	  var tokens = {
	    '.': {mode: 'get'},
	    ':': {mode: 'filter'},
	    '|': {handle: 'or'},
	    '[': {open: 'select'},
	    ']': {close: 'select'},
	    '{': {open: 'meta'},
	    '}': {close: 'meta'},
	    '(': {open: 'args'},
	    ')': {close: 'args'}
	  }

	  function push(item){
	    if (deepQuery){
	      deepQuery.push(item)
	    } else {
	      result.push(item)
	    }
	  }

	  var handlers = {
	    get: function(buffer){
	      var trimmed = typeof buffer === 'string' ? buffer.trim() : null
	      if (trimmed){
	        push({get:trimmed})
	      }
	    },
	    select: function(buffer){
	      if (buffer){
	        push(tokenizeSelect(buffer))
	      } else {
	        // deep query override
	        var x = {deep: []}
	        result.push(x)
	        deepQuery = x.deep
	      }
	    },
	    filter: function(buffer){
	      if (buffer){
	        push({filter:buffer.trim()})
	      }
	    },
	    or: function(){
	      deepQuery = null
	      result.push({or:true})
	      partOffset = i + 1
	    },
	    args: function(buffer){
	      var args = tokenizeArgs(buffer)
	      result[result.length-1].args = args
	    }
	  }

	  function handleBuffer(){
	    var buffer = query.slice(bStart, bEnd)
	    if (handlers[mode]){
	      handlers[mode](buffer)
	    }
	    mode = 'get'
	    bStart = bEnd + 1
	  }

	  for (var i = 0;i < query.length;i++){

	    // update char values
	    prevChar = char; char = nextChar; nextChar = query.charAt(i + 1);
	    pos = i - partOffset

	    // root query check
	    if (pos === 0 && (char !== ':' && char !== '.')){
	      result.push({root:true})
	    }

	    // parent query check
	    if (pos === 0 && (char === '.' && nextChar === '.')){
	      result.push({parent:true})
	    }

	    var token = tokens[char]
	    if (token){

	      // set mode
	      if (depth === 0 && (token.mode || token.open)){
	        handleBuffer()
	        mode = token.mode || token.open
	      }

	      if (depth === 0 && token.handle){
	        handleBuffer()
	        handlers[token.handle]()
	      }

	      if (token.open){
	        depth += 1
	      } else if (token.close){
	        depth -= 1
	      }

	      // reset mode to get
	      if (depth === 0 && token.close){
	        handleBuffer()
	      }

	    }

	    bEnd = i + 1

	  }

	  handleBuffer()
	  return result
	}

	function tokenizeArgs(argsQuery){
	  if (argsQuery === ',') return [',']
	  return depthSplit(argsQuery, /,/).map(function(s){
	    return handleSelectPart(s.trim())
	  })
	}

	function tokenizeSelect (selectQuery) {
	  if (selectQuery === '*') {
	    return {
	      values: true
	    }
	  } else if (selectQuery === '**') {
	    return {
	      values: true,
	      deep: true
	    }
	  }

	  var multiple = false
	  if (selectQuery.charAt(0) === '*') {
	    multiple = true
	    selectQuery = selectQuery.slice(1)
	  }

	  var booleanParts = depthSplit(selectQuery, /&|\|/, { includeDelimiters: true })
	  if (booleanParts.length > 1) {
	    var result = [
	      getSelectPart(booleanParts[0].trim())
	    ]
	    for (var i = 1; i < booleanParts.length; i += 2) {
	      var part = getSelectPart(booleanParts[i + 1].trim())
	      if (part) {
	        part.booleanOp = booleanParts[i]
	        result.push(part)
	      }
	    }
	    return {
	      multiple: multiple,
	      boolean: true,
	      select: result
	    }
	  } else {
	    var result = getSelectPart(selectQuery.trim())
	    if (!result) {
	      return {
	        get: handleSelectPart(selectQuery.trim())
	      }
	    } else {
	      if (multiple) {
	        result.multiple = true
	      }
	      return result
	    }
	  }
	}

	function getSelectPart (selectQuery) {
	  var parts = depthSplit(selectQuery, /(!)?(=|~|\:|<=|>=|<|>)/, { max: 2, includeDelimiters: true })
	  if (parts.length === 3) {
	    var negate = parts[1].charAt(0) === '!'
	    var key = handleSelectPart(parts[0].trim())
	    var result = {
	      negate: negate,
	      op: negate ? parts[1].slice(1) : parts[1]
	    }
	    if (result.op === ':') {
	      result.select = [key, {_sub: module.exports(':' + parts[2].trim())}]
	    } else if (result.op === '~') {
	      var value = handleSelectPart(parts[2].trim())
	      if (typeof value === 'string') {
	        var reDef = parts[2].trim().match(/^\/(.*)\/([a-z]?)$/)
	        if (reDef) {
	          result.select = [key, new RegExp(reDef[1], reDef[2])]
	        } else {
	          result.select = [key, value]
	        }
	      } else {
	        result.select = [key, value]
	      }
	    } else {
	      result.select = [key, handleSelectPart(parts[2].trim())]
	    }
	    return result
	  }
	}

	function isInnerQuery (text) {
	  return text.charAt(0) === '{' && text.charAt(text.length-1) === '}'
	}

	function handleSelectPart(part){
	  if (isInnerQuery(part)){
	    var innerQuery = part.slice(1, -1)
	    return {_sub: module.exports(innerQuery)}
	  } else {
	    return paramToken(part)
	  }
	}

	function paramToken(text){
	  if (text.charAt(0) === '?'){
	    var num = parseInt(text.slice(1))
	    if (!isNaN(num)){
	      return {_param: num}
	    } else {
	      return text
	    }
	  } else {
	    return text
	  }
	}



	function assignParamIds(query){
	  var index = 0
	  return query.replace(/\?/g, function(match){
	    return match + (index++)
	  })
	}

	function last (array) {
	  return array[array.length - 1]
	}


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = depthSplit

	function depthSplit (text, delimiter, opts) {
	  var max = opts && opts.max || Infinity
	  var includeDelimiters = opts && opts.includeDelimiters || false

	  var depth = 0
	  var start = 0
	  var result = []
	  var zones = []

	  text.replace(/([\[\(\{])|([\]\)\}])/g, function (current, open, close, offset) {
	    if (open) {
	      if (depth === 0) {
	        zones.push([start, offset])
	      }
	      depth += 1
	    } else if (close) {
	      depth -= 1
	      if (depth === 0) {
	        start = offset + current.length
	      }
	    }
	  })

	  if (depth === 0 && start < text.length) {
	    zones.push([start, text.length])
	  }

	  start = 0

	  for (var i = 0; i < zones.length && max > 0; i++) {
	    for (
	      var pos = zones[i][0], match = delimiter.exec(text.slice(pos, zones[i][1]));
	      match && max > 1;
	      pos += match.index + match[0].length, start = pos, match = delimiter.exec(text.slice(pos, zones[i][1]))
	    ) {
	      result.push(text.slice(start, match.index + pos))
	      if (includeDelimiters) {
	        result.push(match[0])
	      }
	      max -= 1
	    }
	  }

	  if (start < text.length) {
	    result.push(text.slice(start))
	  }

	  return result
	}


/***/ })
/******/ ]);