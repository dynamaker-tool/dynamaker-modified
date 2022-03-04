var fpsDog;
var fps = 0;
var frameCount = 0;
var absFrameCount = 0;
var preFrameCount = 0;

function fpsWatcher() {
}

fpsWatcher.prototype = {
	set:function() {
		fpsDog = setInterval(function(){
			fps = absFrameCount - preFrameCount;
			preFrameCount = absFrameCount;
		},1000);
	},
	refresh:function() {
		frameCount = (frameCount + 1) % 108;
		absFrameCount++;
	}
}
