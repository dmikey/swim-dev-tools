var utils = require('./utils.js');
var debug = utils.getParameterByName('debug');
module.exports = function() {
    return app.debug || debug;
}