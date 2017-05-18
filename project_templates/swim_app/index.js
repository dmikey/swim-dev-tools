// include material design from swim-dev
__material__;

// include base styles
require('./styles/main.css');

// setup the router
var router = Router({
    '/': function() {
        var helloView = require('./views/hello_world');
        helloView.appendTo('#app');
    }
});

// set the default route if no route is found
router.init('#/');