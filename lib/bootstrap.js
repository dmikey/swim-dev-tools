var utils = require('./utils.js');
var debug = require('./debug.js');

window.app = app;

// swallow for now, hook up to production logging
if(!debug()){
    window.console = {
        log: function(){},
        dir: function(){},
        warn: function(){},
        error: function(){}
    }
}

// bootstrap the base apps index.js
// this is an alias in the webpack config
require('edge');
require('baseApp');