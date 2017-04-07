var frames = [];

var drawTimer;
var drawFn = function drawFn() {
    requestAnimationFrame(function(){
        
        for (var i = 0; i < frames.length; i++) { 
           frames[i]();
        }

        drawTimer  = setTimeout(drawFn, 1000/24);
    });
}

// draw at 24 fps
drawTimer = setTimeout(drawFn, 1000/24);

module.exports = function(fn) {
        if(typeof fn == 'function') frames.push(fn);
    }