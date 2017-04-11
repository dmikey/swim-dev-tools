var frames = [];

var drawTimer;
var lastFrameIndex = 0;

var drawFn = function drawFn() {
    var startDate = new Date();
    requestAnimationFrame(function(){

        var startingFrameIndex = lastFrameIndex;
        if(lastFrameIndex == (frames.length - 1)) lastFrameIndex = 0;
        
        for (var i = startingFrameIndex; i < frames.length; i++) {
            // do some work
            frames[i]();

            if(seconds > 1000/24) {

                console.log('deferring drawing work......');

                // defer work
                lastFrameIndex = i;
                break;
            }

        }

        drawTimer  = setTimeout(drawFn, 1000/24);
    });

    // Do your operations
    var endDate   = new Date();
    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

}

// draw at 24 fps
drawTimer = setTimeout(drawFn, 1000/24);

module.exports = function(fn) {
    // if this is a function, push it to frames, and debounce it
    // 24 FPS
    if(typeof fn == 'function') frames.push(_.debounce(fn, 1000/24));
}