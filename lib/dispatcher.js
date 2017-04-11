// shallow dispatcher
var listeners = [];
var after = {};
module.exports = {
    dispatch: _.debounce(function dispatch(action, data) {
        
        for (var i = 0; i < listeners.length; i++) {
            if (typeof listeners[i] === 'function') {
                listeners[i].call(this, action, data);
                // if there are any actions waiting to dispatch after this
                // one has completed then do it
                if(after[action]) {
                    var afters = after[action];
                    after = {};
                    $.each(afters, function (idx, val) {
                        dispatch(val.action, val.data);
                    });
                }
            }
        }

        console.log('dispatching: ', action);
    }, 1000/24),
    subscribe: function (callback) {
        if (typeof callback === 'function') listeners.push(callback);
    },
    dispatchAfter: function(afterAction, action, data) {

        var afterStack = after[afterAction] || {};

        afterStack[action] = {action: action, data: data};

        after[afterAction] = afterStack;
    }
};