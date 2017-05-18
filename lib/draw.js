var frames = [];

var drawTimer;
var lastFrameIndex = 0;

var drawDirty = false;
var drawFn = function drawFn() {
    var startDate = new Date();
    requestAnimationFrame(function() {

        if (lastFrameIndex == (frames.length - 1)) {
            drawDirty = false;
            lastFrameIndex = 0;
        }

        var startingFrameIndex = lastFrameIndex;

        for (var i = startingFrameIndex; i < frames.length; i++) {

            var isVisible = $(frames[i].element).is(':visible');

            // for backwards compatibility, assume state is dirty
            var isStateDirty = true;
            var state = frames[i].stateId && Store.get(frames[i].stateId);

            //if state exists
            if (state) {
                isStateDirty = state.dirty;
            }

            // do some work
            if (isStateDirty && isVisible) {

                //console.log('drawing for: ', i, frames[i].stateId, ' ', isStateDirty);
                frames[i](state);
                Store.dirty(frames[i].stateId, false);
            }

            // Do your operations
            var endDate = new Date();
            var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

            lastFrameIndex = i;
        }
        drawTimer = setTimeout(drawFn, 1000 / 24);
    });

}

// draw at 24 fps
drawTimer = setTimeout(drawFn, 1000 / 24);

module.exports = function draw(fn) {
    // if this is a function, push it to frames, and debounce it
    // 48 FPS
    if (typeof fn == 'function') {
        var drawMethod = _.debounce(fn, 1000 / 48); // only execute a draw fn twice per frame max
        drawMethod.stateId = (this && this.guid) || -1;
        drawMethod.element = this;
        frames.push(drawMethod);
    }
}