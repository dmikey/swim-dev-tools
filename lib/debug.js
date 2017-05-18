var utils = require('./utils.js');
var debug = utils.getParameterByName('debug');
module.exports = function(appname) {
    return function() {
        // var debug = require('debug')('app-name');
        // if(debug())
        return app.debug || debug;
    }
}