var AC = false;

// TLC - Other Vars
let hitSoundGainNode = null;

function playSound(buffer, startTime) {
	var source = AC.createBufferSource();
	source.buffer = buffer;
	source.connect(hitSoundGainNode);
	source.start(startTime || 0);
}

function loadSound(url, index){
	var request = new XMLHttpRequest();
	request.open('GET',url,true);
	request.responseType= 'arraybuffer';
	request.onload = function(){
		AC.decodeAudioData(request.response,function(buffer){
			hitCtrl[index] = $.extend(buffer, {}, true);
			loaded++;
		}, function () {
			alert("WEB Audio API error");
		});
	}
	request.send();
}