// import stylesheet
require('./style.css');

// export component as tag
// Swim-Dev-Tools use X-Tag: https://x-tag.github.io/docs
tag('x-hello-component', {
    template: require('./template.html'),
    inserted: function() {
        var instance = this;
        var actions = require('store/actions');
        Dispatcher.subscribe(function(action, data) {
            switch (action) {
                case actions.UPDATE_HELLO_COMPONENT:
                    instance.message = data.message;
                    break;
            }
        });
    },
    accessors: {
        message: {
            // links to the 'message' attribute
            attribute: {},
            set: function(val) {
                this._message = val;
                $('div', this).text(val)
            },
            get: function() {
                return this._message;
            }
        }
    }
});