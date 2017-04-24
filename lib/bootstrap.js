var utils = require('./utils.js');
var debug = utils.getParameterByName('debug');

if(debug) {
    app.debug = true;
}

// set some stuff up for debugging
window.app = app;

// bootstrap the base apps index.js
// this is an alias in the webpack config
require('edge');
require('baseApp');