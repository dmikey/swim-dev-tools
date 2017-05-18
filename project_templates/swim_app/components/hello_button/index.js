// import stylesheet
require('./style.css');

// export component as tag
tag('x-hello-button', {
    template: require('./template.html'),
    inserted: function() {
        var actions = require('store/actions');
        $('button', this).click(function() {
            Dispatcher.dispatch(actions.UPDATE_HELLO_COMPONENT, {
                message: 'You Updated The Message!'
            });
        });
    }
});