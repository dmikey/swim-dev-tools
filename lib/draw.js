var frames = [];

var drawTimer;
var lastFrameIndex = 0;

var drawFn = function drawFn() {
    var startDate = new Date();
    requestAnimationFrame(function(){

        var startingFrameIndex = lastFrameIndex;
        if(lastFrameIndex == (frames.length - 1)) lastFrameIndex = 0;
        
        for (var i = startingFrameIndex; i < frames.length; i++) {

            var isVisible = $(frames[i].element).is(':visible');
            
            // for backwards compatibility, assume state is dirty
            var isStateDirty = true;    
	        var state = frames[i].stateId && Store.get(frames[i].stateId);        

            //if state exists
            if(state) {
                isStateDirty = state.dirty;
            }
            
            // do some work
            if(isStateDirty && isVisible) {
                //console.log('drawing for: ', frames[i].stateId);
                frames[i](state);
            }
            
  
            // Do your operations
            var endDate   = new Date();
            var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

            // 1000/24fps ~ 0.042 seconds
            if(seconds > 0.042) {
                // defer work
                lastFrameIndex = i;
                break;
            }

        }

        drawTimer  = setTimeout(drawFn, 1000/24);
    });

}

// draw at 24 fps
drawTimer = setTimeout(drawFn, 1000/24);

module.exports = function draw(fn) {
    // if this is a function, push it to frames, and debounce it
    // 24 FPS
    if(typeof fn == 'function') {
        var drawMethod =_.debounce(fn, 1000/24);
        drawMethod.stateId = (this && this.guid) || -1;
        drawMethod.element = this;
        frames.push(drawMethod);
    }
}