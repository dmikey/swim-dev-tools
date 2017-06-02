var utils = require('./utils.js');
var debug = require('./debug.js');
require('edge');

window.app = app;

// swallow for now, hook up to production logging
if (!debug()) {
    window.console = {
        log: function() {},
        dir: function() {},
        warn: function() {},
        error: function() {}
    }
}

// bootstrap the base apps index.js
// this is an alias in the webpack config

if(app.externalConfig) {
    // get external config
    $.getJSON( "assets/config.json", function( data ) {
        window.app.config = data;
        // bootstrap app
        require('baseApp'); 
        
        
        window._paq = window._paq || [];
        window._paq.push(['trackPageView']);
        window._paq.push(['enableLinkTracking']);
        (function() {
            // default tracker
            var statsID = 3;
            
            if(window.app && window.app.package && window.app.package.swimAppId) {
                statsID = window.app.package.swimAppId;
                alert(statsID)
            }
            
            // todo enable SSL on stats
            var u="http://stats.swim.it/";
            window._paq.push(['setTrackerUrl', u+'piwik.php']);
            window._paq.push(['setSiteId', statsID]);
            window._paq.push(['enableHeartBeatTimer', 30]);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
        })();


    });
}

