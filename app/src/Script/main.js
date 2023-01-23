var BlobBuilder = Blob;
var browser = getBrowser();
var windowWidth = 1920;
var windowHeight = 1080;
var loaded = 0;
var low = false;
var gLine = false;
var musicName = false;
var bpmName = false;
var offsetName = false;
var hardshipName = false;
var leftName = false;
var rightName = false;
var musicFileElement = false;
var musicFileCtrl = false;
var musicUrl = false;
var musicPlayButton;
var musicCtrl = false;
var mapFileElement = false;
var xmlJson = false;
var mapFileCtrl = [];
var mapJsonUrl = false;
var mapXmlUrl = false;
var backgroundFileElement = false;
var backgroundFileCtrl = false;
var hitUrl = ["./audio/hit.wav", "./audio/clap.wav", "./audio/drum.wav", "./audio/drumh.wav", "./audio/slideShort.wav"];
var hitCtrl = [];
var hitBuffer = [10, 10, 10, 10, 60];
var hitTypeMap = [];
				   //N,S,H,Sub
	hitTypeMap[0] = [0,4,0,4];//Down
	hitTypeMap[1] = [3,4,3,4];//Left
	hitTypeMap[2] = [3,4,3,4];//Right
var totalHitBuffer = 0;
var audioNow = false;
var audioReady = false;
var audioRate = 1;
var audioRateCache = 1;
var doration = 0;
var timerReady = false;
var bpm = 0;
var bpmlist = [];
var timelist = [];
var hardship = 0;
var hardshipColor = "#FFF";
var CMap = false;
var note = [];
var noteDown = [];
var noteLeft = [];
var noteRight = [];
var noteDownMax = 0;
var noteLeftMax = 0;
var noteRightMax = 0;
var noteDownHit = [];
var noteLeftHit = [];
var noteRightHit = [];
var noteDownMap = [];
var noteLeftMap = [];
var noteRightMap = [];
var noteDownUsed = [];
var noteLeftUsed = [];
var noteRightUsed = [];
var noteTemp = [];
//var noteDownChose = [];
//var noteLeftChose = [];
//var noteRightChose = [];
var barTargetL = windowHeight/2;
var barTargetR = windowHeight/2;
var barL = windowHeight/2;
var barR = windowHeight/2;
var totalNote = 0;
var combo = 0;
var score = 0;
var preScore = 0;
var hitThisFrame = 0;
var hitThisFrame2 = 0;
var hiSpeed = 1400;
var offset = 0;
var N_perfectJudge = 0.030;
var greatJudge = 0.090;
var goodJudge = 0.115;
var missJudge = 0.250;
var perfectJudge = 0.030;
var currentPerfectJudge = 0.010;
var spq = 0;
var spu = 0;
var scene = false;
var mapFileOk = false;
var musicFileOk = false;
var isFullScreen = false;
var defaultCanvasStyle = false;
var editMode = true;
var autoMode = true;
var showCS = false;
var showStart = -3;
var rollReverse = true;
var lr = 112;//(1920 - 5.8*300)/2*1920/windowWidth; //112/1920
var ud = 137/1080 * windowHeight;
var tlr = lr;
var tud = ud;
var udUnit = 270/1920 * windowWidth;
var lrUnit = 135/1920 * windowHeight;
var timer = new Date();
var mainMouse = false;
var baseTime = timer.getTime();
var thisTime = false;
var nail = [];
var	showD = 0; //1 noteOnly 2 note&line;
var	showL = 0;
var	showR = 0;
var typeL = false;
var typeR = false;
var tempCanvas = null;
var tempContext = null;
var mixerSrc = null;
var playSrc = null;
var playCanvas = null;
var playContext = null;
var barCanvas = null;
var barContext = null;
var holdSrc = null;
var holdNoteCanvasD = null;
var holdNoteContextD = null;
var holdNoteCanvasL = null;
var holdNoteContextL = null;
var holdNoteCanvasR = null;
var holdNoteContextR = null;
var holdBoxCanvasD = null;
var holdBoxContextD = null;
var holdBoxCanvasL = null;
var holdBoxContextL = null;
var holdBoxCanvasR = null;
var holdBoxContextR = null;
var chainNoteCanvasD = null;
var chainNoteContextD = null;
var chainNoteCanvasL = null;
var chainNoteContextL = null;
var chainNoteCanvasR = null;
var chainNoteContextR = null;
var normalNoteCanvasD = null;
var normalNoteContextD = null;
var normalNoteCanvasL = null;
var normalNoteContextL = null;
var normalNoteCanvasR = null;
var normalNoteContextR = null;
var perfectShadowCanvasD = null;
var perfectShadowContextD = null;
var perfectShadowCanvasL = null;
var perfectShadowContextL = null;
var perfectShadowCanvasR = null;
var perfectShadowContextR = null;
var perfectJudgeCanvas = null;
var perfectJudgeContext = null;
var perfectShineCanvas = null;
var perfectShineContext = null;
var mixerShadowCanvasD = null;
var mixerShadowContextD = null;
var mixerShadowCanvasL = null;
var mixerShadowContextL = null;
var mixerShadowCanvasR = null;
var mixerShadowContextR = null;
var blankCanvasU = null;
var blankContextU = null;
var blankCanvasD = null;
var blankContextD = null;
var redCanvasU = null;
var redContextU = null;
var redCanvasD = null;
var redContextD = null;
var blueCanvasU = null;
var blueContextU = null;
var blueCanvasD = null;
var blueContextD = null;
var pauseCanvas = null;
var pauseContext = null;
var hardshipCanvas = null;
var hardshipContext = null;
var bg = false;
var bgSrc = new Image();
var bgCanvas = null;
var bgContext = null;
var charSrc = null;
var charCanvas = null;
var charContext = null;
var numberSrc = null;
var numberCanvas = null;
var numberContext = null;
var yellowParticleSrc = null;
var yellowParticleCanvas = null;
var yellowParticleContext = null;
var purpleParticleSrc = null;
var purpleParticleCanvas = null;
var purpleParticleContext = null;
var whiteParticleSrc = null;
var whiteParticleCanvas = null;
var whiteParticleContext = null;
var canvas = null;
var ctx = null;

//------------- TLC Vars ------------------------//

// BOOLEANS
/** Added for mp4 Support, true if video was loaded. */
var isVideo = false;

/** Toggle for whether to show Help menu. */
var hOn = false;

/** Restrict Mixer Height toggle. */
var restrictMixerHeight = true;

/** Toggle Bleed Bar Graphic. */
var isBleedBarGraphicOn = false;



/** Restrict Particles to 60FPS. */
var isParticles60FPS = true;
// var particlesShownInFrameArr = Array.apply(null, Array(60)).map((val, i) => false);
var previousFrameWithParticles = -1;

/** Display Error Messages. */
var errorMsgContainer = [];

/** GRAPHICS - Canvas and Context Variables **/
var morePlaySrc = null;
var bleedCanvas = null;
var bleedContext = null;

var bkgWhiteGradientSrc = null;
var bkgWhiteGradientCanvas = null;
var bkgWhiteGradientContext = null;

/** Note Type Counter */
var noteTypeCounterShown = false;


//TLC Options
/** false: Arrow keys toggle 2 options of bar lines instead of 3. The solid bar line option is left out. */
var includeSolidBarLine = true;

//----------------------------------------------//


document.oncontextmenu = function stop(){
	return false;
};

canvas = document.createElement("canvas");
canvas.width = windowWidth;
canvas.height = windowHeight;
document.getElementById("game").appendChild(canvas);
defaultCanvasStyle = $.extend(true, {}, canvas.style);
ctx = canvas.getContext("2d");
ctx.font = "30px Dynamix";
ctx.textBaseline = "top";


mixerSrc = new Image();
mixerSrc.src = "Graphics/MIXshadow.png";
playSrc = new Image();
playSrc.src = "Graphics/play.png";
holdSrc = new Image();
holdSrc.src = "Graphics/hold.png";
numberSrc = new Image();
numberSrc.src = "Graphics/number.png";
//charSrc = new Image();
//charSrc.src = "Graphics/char2.png";

// TLC- More Play Graphics
morePlaySrc = new Image();
morePlaySrc.src = "Graphics/morePlayGraphics.png";

bkgWhiteGradientSrc = new Image();
bkgWhiteGradientSrc.src = "Graphics/BkgWhiteGradient.png";


blankCanvasU = document.createElement("canvas"); blankContextU = blankCanvasU.getContext("2d"); blankCanvasU.width = 160; blankCanvasU.height = 100;
blankCanvasD = document.createElement("canvas"); blankContextD = blankCanvasD.getContext("2d"); blankCanvasD.width = 160; blankCanvasD.height = 100;
redCanvasU = document.createElement("canvas"); redContextU = redCanvasU.getContext("2d"); redCanvasU.width = 160; redCanvasU.height = 100;
redCanvasD = document.createElement("canvas"); redContextD = redCanvasD.getContext("2d"); redCanvasD.width = 160; redCanvasD.height = 100;
blueCanvasU = document.createElement("canvas"); blueContextU = blueCanvasU.getContext("2d"); blueCanvasU.width = 160; blueCanvasU.height = 100;
blueCanvasD = document.createElement("canvas"); blueContextD = blueCanvasD.getContext("2d"); blueCanvasD.width = 160; blueCanvasD.height = 100;
pauseCanvas = document.createElement("canvas"); pauseContext = pauseCanvas.getContext("2d"); pauseCanvas.width = 17; pauseCanvas.height = 92;
yellowParticleCanvas = document.createElement("canvas"); yellowParticleContext = yellowParticleCanvas.getContext("2d"); yellowParticleCanvas.width = 116; yellowParticleCanvas.height = 146;
purpleParticleCanvas = document.createElement("canvas"); purpleParticleContext = purpleParticleCanvas.getContext("2d"); purpleParticleCanvas.width = 116; purpleParticleCanvas.height = 146;
whiteParticleCanvas = document.createElement("canvas"); whiteParticleContext = whiteParticleCanvas.getContext("2d"); whiteParticleCanvas.width = 116; whiteParticleCanvas.height = 146;
barCanvas = document.createElement("canvas"); barContext = barCanvas.getContext("2d"); barCanvas.width = 79; barCanvas.height = 234;  //131+67 741+67   
playCanvas = document.createElement("canvas"); playContext = playCanvas.getContext("2d"); playCanvas.width = 2048; playCanvas.height = 1320;
numberCanvas = document.createElement("canvas"); numberContext = numberCanvas.getContext("2d"); numberCanvas.width = 1541; numberCanvas.height = 176;
bgCanvas = document.createElement("canvas"); bgContext = bgCanvas.getContext("2d"); bgCanvas.width = 1920; bgCanvas.height = 1080;
hardshipCanvas = document.createElement("canvas"); hardshipContext = hardshipCanvas.getContext("2d"); hardshipCanvas.width = 380; hardshipCanvas.height = 262;
//charCanvas = document.createElement("canvas"); charContext = charCanvas.getContext("2d"); charCanvas.width = 1920; charCanvas.height = 1080;
holdNoteCanvasD = document.createElement("canvas"); holdNoteContextD = holdNoteCanvasD.getContext("2d"); holdNoteCanvasD.width = 512; holdNoteCanvasD.height = 256;
holdNoteCanvasL = document.createElement("canvas"); holdNoteContextL = holdNoteCanvasL.getContext("2d"); holdNoteCanvasL.width = 256; holdNoteCanvasL.height = 512;
holdNoteCanvasR = document.createElement("canvas"); holdNoteContextR = holdNoteCanvasR.getContext("2d"); holdNoteCanvasR.width = 256; holdNoteCanvasR.height = 512;
holdBoxCanvasD = document.createElement("canvas"); holdBoxContextD = holdBoxCanvasD.getContext("2d"); holdBoxCanvasD.width = 69; holdBoxCanvasD.height = 108;
holdBoxCanvasL = document.createElement("canvas"); holdBoxContextL = holdBoxCanvasL.getContext("2d"); holdBoxCanvasL.width = 108; holdBoxCanvasL.height = 69;
holdBoxCanvasR = document.createElement("canvas"); holdBoxContextR = holdBoxCanvasR.getContext("2d"); holdBoxCanvasR.width = 108; holdBoxCanvasR.height = 69;

chainNoteCanvasD = document.createElement("canvas"); chainNoteContextD = chainNoteCanvasD.getContext("2d"); chainNoteCanvasD.width = 122; chainNoteCanvasD.height = 77;
chainNoteCanvasL = document.createElement("canvas"); chainNoteContextL = chainNoteCanvasL.getContext("2d"); chainNoteCanvasL.width = 77; chainNoteCanvasL.height = 122;
chainNoteCanvasR = document.createElement("canvas"); chainNoteContextR = chainNoteCanvasR.getContext("2d"); chainNoteCanvasR.width = 77; chainNoteCanvasR.height = 122;

normalNoteCanvasD = document.createElement("canvas"); normalNoteContextD = normalNoteCanvasD.getContext("2d"); normalNoteCanvasD.width = 45; normalNoteCanvasD.height = 28;
normalNoteCanvasL = document.createElement("canvas"); normalNoteContextL = normalNoteCanvasL.getContext("2d"); normalNoteCanvasL.width = 28; normalNoteCanvasL.height = 45;
normalNoteCanvasR = document.createElement("canvas"); normalNoteContextR = normalNoteCanvasR.getContext("2d"); normalNoteCanvasR.width = 28; normalNoteCanvasR.height = 45;

perfectShadowCanvasD = document.createElement("canvas"); perfectShadowContextD = perfectShadowCanvasD.getContext("2d"); perfectShadowCanvasD.width = 545; perfectShadowCanvasD.height = 905;
perfectShadowCanvasL = document.createElement("canvas"); perfectShadowContextL = perfectShadowCanvasL.getContext("2d"); perfectShadowCanvasL.width = 905; perfectShadowCanvasL.height = 545;
perfectShadowCanvasR = document.createElement("canvas"); perfectShadowContextR = perfectShadowCanvasR.getContext("2d"); perfectShadowCanvasR.width = 905; perfectShadowCanvasR.height = 545;
perfectJudgeCanvas = document.createElement("canvas"); perfectJudgeContext = perfectJudgeCanvas.getContext("2d"); perfectJudgeCanvas.width = 438; perfectJudgeCanvas.height = 153;
perfectShineCanvas = document.createElement("canvas"); perfectShineContext = perfectShineCanvas.getContext("2d"); perfectShineCanvas.width = 514; perfectShineCanvas.height = 201;

mixerShadowCanvasD = document.createElement("canvas"); mixerShadowContextD = mixerShadowCanvasD.getContext("2d"); mixerShadowCanvasD.width = 381; mixerShadowCanvasD.height = 437;
mixerShadowCanvasL = document.createElement("canvas"); mixerShadowContextL = mixerShadowCanvasL.getContext("2d"); mixerShadowCanvasL.width = 437; mixerShadowCanvasL.height = 381;
mixerShadowCanvasR = document.createElement("canvas"); mixerShadowContextR = mixerShadowCanvasR.getContext("2d"); mixerShadowCanvasR.width = 437; mixerShadowCanvasR.height = 381;

bleedCanvas = document.createElement("canvas"); bleedContext = bleedCanvas.getContext("2d"); bleedCanvas.width = 398; bleedCanvas.height = 75;

bkgWhiteGradientCanvas = document.createElement("canvas"); bkgWhiteGradientContext = bkgWhiteGradientCanvas.getContext("2d"); bkgWhiteGradientCanvas.width = 1920; bkgWhiteGradientCanvas.height = 1080;

//imgLoad(mixerSrc, function() {
//});

imgLoad(playSrc, function() {
	barContext.drawImage(playSrc, 0, 152, 79, 234, 0, 0, 79, 234);
	hardshipContext.drawImage(playSrc, 0, 416, 380, 262, 0, 0, 380, 262);
	perfectJudgeContext.drawImage(playSrc, 951, 203, 438, 153, 0, 0, 438, 153);
	perfectShineContext.drawImage(playSrc, 913, 0, 514, 201, 0, 0, 514, 201);
	
	mixerShadowContextD.drawImage(playSrc, 951, 359, 381, 437, 0, 0, 381, 437);
	mixerShadowContextL.save();
	mixerShadowContextL.translate(437, 0);
	mixerShadowContextL.rotate(90 * Math.PI/180);
	mixerShadowContextL.drawImage(mixerShadowCanvasD, 0, 0);
	mixerShadowContextL.restore();
	mixerShadowContextR.save();
	mixerShadowContextR.translate(0, 381);
	mixerShadowContextR.rotate(270 * Math.PI/180);
	mixerShadowContextR.drawImage(mixerShadowCanvasD, 0, 0);
	mixerShadowContextR.restore();
	
	normalNoteContextD.drawImage(playSrc, 1, 105, 45, 28, 0, 0, 45, 28);
	normalNoteContextL.save();
	normalNoteContextL.translate(28, 0);
	normalNoteContextL.rotate(90 * Math.PI/180);
	normalNoteContextL.drawImage(normalNoteCanvasD, 0, 0);
	normalNoteContextL.restore();
	normalNoteContextR.save();
	normalNoteContextR.translate(0, 45);
	normalNoteContextR.rotate(270 * Math.PI/180);
	normalNoteContextR.drawImage(normalNoteCanvasD, 0, 0);
	normalNoteContextR.restore();
	
	chainNoteContextD.drawImage(playSrc, 1, 16, 122, 77, 0, 0, 122, 77);
	chainNoteContextL.save();
	chainNoteContextL.translate(77, 0);
	chainNoteContextL.rotate(90 * Math.PI/180);
	chainNoteContextL.drawImage(chainNoteCanvasD, 0, 0);
	chainNoteContextL.restore();
	chainNoteContextR.save();
	chainNoteContextR.translate(0, 122);
	chainNoteContextR.rotate(270 * Math.PI/180);
	chainNoteContextR.drawImage(chainNoteCanvasD, 0, 0);
	chainNoteContextR.restore();
	
	holdBoxContextD.drawImage(playSrc, 0, 677, 69, 108, 0, 0, 69, 108);
	holdBoxContextL.save();
	holdBoxContextL.translate(108, 0);
	holdBoxContextL.rotate(90 * Math.PI/180);
	holdBoxContextL.drawImage(holdBoxCanvasD, 0, 0);
	holdBoxContextL.restore();
	holdBoxContextR.save();
	holdBoxContextR.translate(0, 69);
	holdBoxContextR.rotate(270 * Math.PI/180);
	holdBoxContextR.drawImage(holdBoxCanvasD, 0, 0);
	holdBoxContextR.restore();
	
	perfectShadowContextD.drawImage(playSrc, 361, 38, 545, 905, 0, 0, 545, 905);
	perfectShadowContextL.save();
	perfectShadowContextL.translate(905, 0);
	perfectShadowContextL.rotate(90 * Math.PI/180);
	perfectShadowContextL.drawImage(perfectShadowCanvasD, 0, 0);
	perfectShadowContextL.restore();
	perfectShadowContextR.save();
	perfectShadowContextR.translate(0, 545);
	perfectShadowContextR.rotate(270 * Math.PI/180);
	perfectShadowContextR.drawImage(perfectShadowCanvasD, 0, 0);
	perfectShadowContextR.restore();
	
	blankContextD.drawImage(playSrc, 147, 0, 160, 100, 0, 0, 160, 100);
	blankContextU.save();
	blankContextU.translate(160, 100);
	blankContextU.rotate(180 * Math.PI/180);
	blankContextU.drawImage(blankCanvasD, 0, 0);
	blankContextU.restore();
	
	redContextD.drawImage(playSrc, 147, 100, 160, 100, 0, 0, 160, 100);
	redContextU.save();
	redContextU.translate(160, 100);
	redContextU.rotate(180 * Math.PI/180);
	redContextU.drawImage(redCanvasD, 0, 0);
	redContextU.restore();
	
	blueContextD.drawImage(playSrc, 147, 200, 160, 100, 0, 0, 160, 100);
	blueContextU.save();
	blueContextU.translate(160, 100);
	blueContextU.rotate(180 * Math.PI/180);
	blueContextU.drawImage(blueCanvasD, 0, 0);
	blueContextU.restore();
	
	pauseContext.drawImage(playSrc, 339, 8, 17, 92, 0, 0, 17, 92);
	
	yellowParticleContext.drawImage(playSrc, 1, 814, 116, 146, 0, 0, 116, 146);

	purpleParticleContext.drawImage(playSrc, 117, 814, 116, 146, 0, 0, 116, 146);

	whiteParticleContext.drawImage(playSrc, 233, 814, 116, 146, 0, 0, 116, 146);

	// TLC - Cant move this into a separate imgLoad function because it affects the loaded variable
	//bleedContext.drawImage(playSrc, 1041, 887, 264, 50, 0, 0, 264, 50);
	bleedContext.drawImage(morePlaySrc, 0, 0, 398, 75, 0, 0, 398, 75);

	bkgWhiteGradientContext.drawImage(bkgWhiteGradientSrc, 0, 0, 1920, 1080, 0, 0, 1920, 1080);


});





//imgLoad(charSrc, function() {
//	charContext.drawImage(charSrc, 0, 0);
//});

imgLoad(holdSrc, function() {
	holdNoteContextD.drawImage(holdSrc, 0, 0);
	holdNoteContextL.save();
	holdNoteContextL.translate(256, 0);
	holdNoteContextL.rotate(90 * Math.PI/180);
	holdNoteContextL.drawImage(holdNoteCanvasD, 0, 0);
	holdNoteContextL.restore();
	holdNoteContextR.save();
	holdNoteContextR.translate(0, 512);
	holdNoteContextR.rotate(270 * Math.PI/180);
	holdNoteContextR.drawImage(holdNoteCanvasD, 0, 0);
	holdNoteContextR.restore();
});

imgLoad(numberSrc, function() {
	numberContext.drawImage(numberSrc, 0, 0, 1541, 176, 0, 0, 1541, 176);
});

var mainPlayView = new playView();
var mainFpsWatcher = new fpsWatcher();
	mainFpsWatcher.set();
var mainKeybord = new keyboard();
	mainKeybord.set();
 
mapFileElement = document.createElement("input");
mapFileElement.type = "file";
mapFileElement.multiple  = true;
mapFileElement.style = "display:none";
mapFileElement.addEventListener("change", function () {
	mapFileCtrl = this.files;
}, false);

musicFileElement = document.createElement("input");
musicFileElement.type = "file";
musicFileElement.accept = "audio/*,video/*";
musicFileElement.style = "display:none";
musicFileElement.addEventListener("change", function () {
	musicFileCtrl = this.files[0];
	musicName.value = musicFileCtrl.name.substr(0, musicFileCtrl.name.length - 4);
}, false);


window.onload = function () {
	mainMouse = new mouse(canvas);
	musicPlayButton = $("#goplay");
	function onMouseWheel(event) {
		if (scene || ! musicCtrl) {
			return;
		}
		var event = event || window.event;
		if (event.wheelDelta ? event.wheelDelta < 0 : event.detail > 0) {
			if (rollReverse) {
				setTime(musicCtrl.currentTime - 100 / hiSpeed);
			}
			else {
				setTime(musicCtrl.currentTime + 100 / hiSpeed);
			}
	       	resetAnime();
		}
		else {
			if (rollReverse) {
				setTime(musicCtrl.currentTime + 100 / hiSpeed);
			}
			else {
				setTime(musicCtrl.currentTime - 100 / hiSpeed);
			}
	       	resetAnime();
		}
	}
	var gameDiv = document.getElementById("game");
	addEvent(gameDiv,'mousewheel',onMouseWheel);
	addEvent(gameDiv,'DOMMouseScroll',onMouseWheel);
		
	backgroundFileElement = document.createElement("input");
	backgroundFileElement.type = "file";
	backgroundFileElement.accept = "image/png,image/jpg,image/jpeg";
	backgroundFileElement.style = "display:none";
	backgroundFileElement.addEventListener("change", function () {
		backgroundFileCtrl = this.files[0]; 
		bgSrc.src = window.URL.createObjectURL(backgroundFileCtrl);
		imgLoad(bgSrc, function() {
			bgContext.save();
			bgContext.fillStyle = "#111";
			bgContext.fillRect(0, 0, windowWidth, windowHeight);
//			bgContext.rect(0, 0, windowWidth, windowHeight - ud);
//			bgContext.stroke();
//			bgContext.clip();
			bgContext.drawImage(bgSrc, 0, 0, bgSrc.width, bgSrc.height, 0, 0, windowWidth, windowHeight);
			bgContext.restore();
			bg = true;
		});
	}, false);
	musicName = document.getElementById("musicName");
	bpmName = document.getElementById("bpm");
	offsetName = document.getElementById("offset");
	hardshipName = document.getElementById("hardship");
	leftName = document.getElementById("left");
	rightName = document.getElementById("right");

	bpmName.value = 0;
	offsetName.value = 0;
	
	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		AC = new window.AudioContext();
	}
	catch (e) {
		alert("Your browser does't support Web Audio API");
	}
//	if (AC) {
//		var gainNode = AC.createGain();
//		gainNode.connect(AC.destination);
//	}
//	if (AC) {// smart way
//		for (var i = 0; i < hitUrl.length; ++i) {
//			totalHitBuffer++;
//			audioLoad(hitUrl[i], function(audio){
//				loadSound(URL.createObjectURL(audio), i);
//				loaded++;
//			});
//		}
//	}
	if (AC) {// smart way
		for (var i = 0; i < hitUrl.length; ++i) {
			totalHitBuffer++;
			loadSound(hitUrl[i], i);
		}

		// TLC - Load hitsound gain node
		hitSoundGainNode = AC.createGain();
		hitSoundGainNode.connect(AC.destination);

	}
	else {// shitty way
		for (var i = 0; i < hitUrl.length; ++i) {
			hitCtrl[i] = [];
			totalHitBuffer++;
			audioLoad(hitUrl[i], function(audio){
				audio.id = "hit" + i;
				$("body").append(audio);
				hitCtrl[i][0] = audio;
				loaded++;
			});
			for (var j = 1; j < hitBuffer[i]; ++j) {
				hitCtrl[i][j] = hitCtrl[i][0].cloneNode(true);
			}
		}
	}
}
scene = new startMenuScene();

var main = function () {
	ctx.fillStyle = "#111";
	if (scene) {
		ctx.fillRect(0, 0, windowWidth, windowHeight);
	}
	// else if (bg){
	// 	ctx.drawImage(bgCanvas, 0, 0);
	// 	ctx.fillStyle = rgba(0, 0, 0, 0.7);
	// 	ctx.fillRect(0, windowHeight - ud, windowWidth, ud);
	// 	if (showStart >= 0) {
	// 		if (showStart < 40) {
	// 			ctx.fillStyle = rgba(0, 0, 0, 0.7);
	// 		}
	// 		else {
	// 			ctx.fillStyle = rgba(0, 0, 0, (showStart >= 40 && showStart <= 60) ? 0.7 - 0.035*(showStart - 40) : 0.7);
	// 		}
	// 	}
	// 	else {
	// 		ctx.fillStyle = rgba(0, 0, 0, 0.7);
	// 	}
	// 	ctx.fillRect(0, 0, windowWidth, windowHeight);
	// }
	// else {
	// 	if (! showCS) {
	// 		ctx.fillStyle = "#111";	
	// 	}
	// 	else {
	// 		ctx.fillStyle = "rgba(32,32,32,1)";	
	// 	}
	// 	ctx.fillRect(0, 0, windowWidth, windowHeight);
	// 	ctx.fillStyle = "rgba(0,0,0,1)";
	// 	ctx.fillRect(0, windowHeight - ud, windowWidth, ud);
	// }

	try {
		mainKeybord.refresh();
		mainPlayView.refresh();
		mainFpsWatcher.refresh();
		if (mainMouse) {
			mainMouse.refresh()
		}
		if (scene) {
			scene.refresh()
		}

	} catch (e) {
		errorMsgContainer.push(e);
	}

	// TLC - Displaying of error message with info
	if (errorMsgContainer.length >= 1) {
		ctx.fillStyle = "red";
		ctx.font = "52px Dynamix";
		ctx.textAlign = "center";

		ctx.fillText("An Error Occured!", windowWidth / 2, windowHeight / 8)
		ctx.fillText("Please ensure that your chart file is not corrupted.", windowWidth / 2, 7 * windowHeight / 8);

		ctx.font = "20px Dynamix";

		// Starts at 2 because I don't want to add 2 to all the "lineNo" in the for loop
		let lineNo = 2;

		// Displays the latest 5 error messages
		// Truncates the error message if it is longer than 150 characters
		for (let i = Math.max(0, errorMsgContainer.length - 5); i < errorMsgContainer.length; i++) {
			ctx.fillText(errorMsgContainer[i].name, windowWidth / 2, (windowHeight / 8) * lineNo);
			ctx.fillText(errorMsgContainer[i].message.length > 150 ? errorMsgContainer[i].message.substring(0, 150) + "..." : errorMsgContainer[i].message, windowWidth / 2, (windowHeight / 8) * lineNo + windowHeight / 32);
			ctx.fillText(errorMsgContainer[i].stack.length > 150 ? errorMsgContainer[i].stack.substring(0, 150) + "..." : errorMsgContainer[i].stack, windowWidth / 2, (windowHeight / 8) * lineNo + windowHeight / 16);
			lineNo++;
			console.log(errorMsgContainer[i].message);
		}
	}

	requestAnimationFrame(main);
};

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
main();