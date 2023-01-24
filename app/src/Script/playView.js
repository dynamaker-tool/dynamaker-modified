var sX, sY, sW, sH, dX, dY, dW, dH;
var showParticles = true;
var showHitSound = false;
var gradual = true;
var gradualPx = 400;
var markSecion = 0;
var editSide = 0; //0Down 1Left 2Right
var noteChosen = [];
var noteChosenList = [];
var hitAnimeList = [];
var shadowAnimeList = [];
var noteShow = [];
var noteHoldShow = [];
var lowList = [];
var didList = [];
var didListPlace = -1;
var mixerLT = 0;
var mixerRT = 0;
var perfectHit = 0;
var greatHit = 0;
var goodHit = 0;
var missHit = 0;
var hitNote = 0;
var hitDouble = false;
var pauseShadowH = 120;

//TLC and Jmak - .dy, Mixer Height, Hitsound Vol
var basicMenu = [
	["     Edit side", 6, 38],
	["[1]  Normal note", 46, 38, rgba(0, 255, 255, 0.8)],
	["[2]  Chain note", 86, 38, rgba(255, 128, 128, 0.8)],
	["[3]  Hold note", 126, 38, rgba(255, 255, 0, 0.8)],
	["[4]  编辑模式", 166, 38, rgba(255, 255, 255, 0.8)],
	["[_]  Pause/Play", 206, 38],
	["     Mark here", 246, 38, rgba(128, 128, 255, 0.8)],
	["[M]  Start from mark", 286, 38, rgba(128, 128, 255, 0.8)],
	["[R]  重播", 326, 38],
	["     另存为 .xml", 366, 38],
	["     另存为 .dy", 406, 38],
	["     背景", 446, 38],
	["     Mixer Height", 486, 38],
	["     Animation", 526, 38],
	["     Hitsound Vol", 566, 38],
	["     Music Volume", 606, 38]
];
var deleteMenu = [
	["     Delete", 6, 38]
];
function shootParticle(frames, type, x1, y1, d1, x2, y2, d2) {
	if (! showParticles  || (musicCtrl && musicCtrl.paused && !showCS)) return;
	shadowAnimeList.push([frames, frames, x1, y1, d1, x2, y2, d2, type]);
}

function shootRVParticle(frames, type, x, y, r) {
	if (! showParticles || (musicCtrl && musicCtrl.paused)) return;
	var sv = jb(Math.random()*2*Math.PI, 0, Math.PI*2);
	shadowAnimeList.push([frames, frames, x, y, Math.random()*360, x + Math.cos(sv) * r, y + Math.sin(sv) * r, Math.random()*180 - 90, type]);
}

function playView() {
}

playView.prototype = {
	set:function() {

	},
	refresh:function() {
		//test
//		holdBottom = [];
//		drawMiddleImage(redCanvasU, 0, 0, 160, 93, windowWidth/2, windowHeight/2, 1);

		// Controlling the frame rate of the animations
		let currDate = new Date();
		let modifyParticlesInNextFrame = true;

		if (isParticles60FPS) {
			// let currFrameNo = getFrameNumberOutOf60FromSongTime(thisTime);
			let currFrameNo = getFrameNumberOutOf60FromMs(currDate.getMilliseconds());
			//console.log(currFrameNo);
			if (currFrameNo > previousFrameWithParticles || currFrameNo < previousFrameWithParticles) {
				previousFrameWithParticles = currFrameNo % 60 == 59 ? -1 : currFrameNo % 60;
			} else {
				modifyParticlesInNextFrame = false;
			}
		}

		//file check
		{
			if (loaded < 5 + totalHitBuffer) return;

			//TLC - mp4 Support Addition
			if(bg) {
				ctx.drawImage(bgCanvas, 0, 0);
				ctx.fillStyle = rgba(0, 0, 0, .81);
				ctx.fillRect(0, windowHeight - ud, windowWidth, ud);
				if(showStart >= 0) {
					if(showStart < 40) {
						ctx.fillStyle = rgba(0, 0, 0, .81)
					} else {
						ctx.fillStyle = rgba(0, 0, 0, showStart >= 40 && showStart <= 60 ? .81 - .035 * (showStart - 40) : .81)
					}
				} else {
					ctx.fillStyle = rgba(0, 0, 0, .81)
				}
				ctx.fillRect(0, 0, windowWidth, windowHeight)
			} else {
				ctx.clearRect(0, 0, windowWidth, windowHeight);
				if(!showCS) {
					ctx.fillStyle = "rgba(25,25,25,0.2)"
				} else {
					ctx.fillStyle = "rgba(32,32,32,0.2)"
				}
				if(isVideo) {
					ctx.globalAlpha = 0.3;
					ctx.drawImage(musicCtrl, 0, 0, windowWidth, windowHeight);
					ctx.globalAlpha = 1
				} else {
					if (showCS) {
						// TLC - White bkg gradient thing
						if (!bg) {
							drawMiddleImage(bkgWhiteGradientCanvas, 0, 0, 1920, 1080, windowWidth / 2, windowHeight / 2, 1);
						}
					}
				}
				ctx.fillStyle = "rgba(0,0,0,0.7)";
				ctx.fillRect(0, windowHeight - ud, windowWidth, ud)
			}


			if (showStart >= -1) {
				if (! musicCtrl.paused) {
					musicCtrl.pause();
				}
				if (between(showStart, 48, 60)) {
					ud = (tud + 20 +   ud*3)/4;
				}
				if (between(showStart, 43, 47)) {
					ud = (tud*2 + ud*3)/5;
				}
				if (between(showStart, 5, 35)) {
					ud = tud;
					if (Math.abs(lr - tlr) <= 0.5) {
						lr = tlr;
					}
					else {
						lr = (tlr + lr*5)/6;
					}
				}
				if (between(showStart, 10, 30)) {
					pauseShadowH = (120 + pauseShadowH*4)/5;
				}
				if (showStart == -1 && modifyParticlesInNextFrame) {
					pauseShadowH = 120;
					lr = tlr;
					ud = tud;
					setTime(0);
					resetCS();
					musicCtrl.goplay();
				}
				if (modifyParticlesInNextFrame) {
					showStart--;
				}
			}

			if (! timerReady) {
				timerReady = true;
				audioRate = 1;//Math.random()/10;
				audioRateCache = 1;
				musicCtrl.playbackRate = 1;
				// Avoid blowing up people's speakers
				musicCtrl.volume = 0.8;
				// Do not start playing right after entering editor
				//musicCtrl.goplay();
				// Default to editing mode
				mainMouse.movement = "choose";
				var realTime = 0;
				timer = new Date();
				baseTime = timer.getTime();
				score = 0;
				preScore = 0;
				combo = 0;
				hitThisFrame = 0;
			}
		}

		//musicMessageUpdate
		if (audioRate != audioRateCache) {
			audioRateCache = audioRate;
			musicCtrl.playbackRate = audioRateCache;
		}

		//updateTime
		{
//		currentPerfectJudge = perfectJudge*audioRate;
			doration = musicCtrl.duration;
			timer = new Date();
			var realTime = timer.getTime();// - CMap.m_timeOffset;
//		thisTime = timer.getTime()/1000 - baseTime;
			thisTime = musicCtrl.currentTime + offset*spu;
			score = Math.floor((combo*0.08 + combo*0.92)*1000000/totalNote);
			preScore = (score + preScore)/2;
			preScoreStr = "" + Math.round(preScore);
			while (preScoreStr.length < 7) {
				preScoreStr = "0" + preScoreStr;
			}
			hitNote = 0;
		}


		drawMiddleImage(blueCanvasU, 0, 0, 160, 100, windowWidth*0.95, windowHeight-ud+87, 1);
		for (var i = 1; i <= 3; ++i) {
			drawMiddleImage(blankCanvasU, 0, 0, 160, 100, windowWidth*(0.95 - i*0.1) , windowHeight-ud+87, 1);
		}
		for (var i = 1; i <= 4; ++i) {
			if (i == 2 && showCS && isBleedBarGraphicOn) {
				drawMiddleImage(redCanvasD, 0, 0, 160, 100, windowWidth * (1 - i * 0.1), windowHeight - ud + 51, 1);
			} else {
				drawMiddleImage(blankCanvasD, 0, 0, 160, 100, windowWidth * (1 - i * 0.1), windowHeight - ud + 51, 1);
			}
		}

		//console.log("RUNNING");


		// TLC - Bleed Addition
		if (showCS && isBleedBarGraphicOn) {
			drawMiddleImage(bleedCanvas, 0, 0, 398, 75, windowWidth / 2, windowHeight * 0.6, 1);
		}
		//TEST: ctx.drawImage(bleedCanvas, 0, 0, 264, 50, 0, 0, 264, 50);



		//comboScore
		if (showCS) {
			drawJBox(ctx, 0, pauseShadowH - 60, windowWidth, 50, 0, pauseShadowH - 60, 0, pauseShadowH - 10, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
			ctx.fillStyle = "black";
			ctx.fillRect(0, pauseShadowH - 10, windowWidth, 20);
			drawJBox(ctx, 0, pauseShadowH + 10, windowWidth, 50, 0, pauseShadowH + 10, 0, pauseShadowH + 60, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
			if (musicCtrl.paused) {
				ctx.beginPath();
				ctx.moveTo(windowWidth*0.487, pauseShadowH - 60);
				ctx.lineTo(windowWidth*0.517, pauseShadowH - 10);
				ctx.lineTo(windowWidth*0.487, pauseShadowH + 40);
				ctx.closePath();
				ctx.fillStyle = "white";
				ctx.fill();
			}
			else {
				drawMiddleImage(pauseCanvas, 0, 0, 17, 92, windowWidth*0.49, pauseShadowH, 1);
				drawMiddleImage(pauseCanvas, 0, 0, 17, 92, windowWidth*0.51, pauseShadowH, 1);
			}
			if (score > 0) drawNumber(preScoreStr, "center", (hitThisFrame > 0 ? 0.58 : 0.48), (hitThisFrame > 0 ? windowWidth*0.294 : windowWidth*0.29), windowHeight*0.54, 7);
			if (combo > 3) drawNumber(combo, "left", (hitThisFrame > 0 ? 0.58 : 0.48), (hitThisFrame > 0 ? windowWidth*0.89 : windowWidth*0.88),  windowHeight*0.54);
			if (hitThisFrame2 > 106) {
				var rate = hitDouble > 0 ? 0.12 : 0.07;
				drawMiddleImage(perfectShineCanvas, 0, 0, 514, 201, windowWidth*0.257, windowHeight*0.63, 1.03 + (hitThisFrame2 - 106)*rate);
				drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth*0.26, windowHeight*0.65, 1.03 + (hitThisFrame2 - 106)*rate);
				drawMiddleImage(perfectShineCanvas, 0, 0, 514, 201, windowWidth*0.734, windowHeight*0.63, 1.03 + (hitThisFrame2 - 106)*rate);
				drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth*0.737, windowHeight*0.65, 1.03 + (hitThisFrame2 - 106)*rate);
			}
			else if (hitThisFrame2 >= 80) {
				ctx.globalAlpha = (hitThisFrame2 - 80)/25;
				drawMiddleImage(perfectShineCanvas, 0, 0, 514, 201, windowWidth*0.257, windowHeight*0.63, 1.03);
				drawMiddleImage(perfectShineCanvas, 0, 0, 514, 201, windowWidth*0.734, windowHeight*0.63, 1.03);
				ctx.globalAlpha = 1;
				drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth*0.26, windowHeight*0.65, 1.03);
				drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth*0.737, windowHeight*0.65, 1.03);
			}
			else if (hitThisFrame2 >= 40){
				drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth*0.26, windowHeight*0.65, 1.03);
				drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth*0.737, windowHeight*0.65, 1.03);
			}
			else{
				ctx.globalAlpha = hitThisFrame2/40;
				drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth*0.26, windowHeight*0.65, 1.03);
				drawMiddleImage(perfectJudgeCanvas, 0, 0, 438, 153, windowWidth*0.737, windowHeight*0.65, 1.03);
				ctx.globalAlpha = 1;
			}

		}


		ctx.globalAlpha = jb((1 - Math.abs(Math.round(thisTime / spu) - thisTime / spu) * 2) * .6 + .4, 0, 1);
		drawJBox(ctx, 0, windowHeight - ud - 350, windowWidth, 350, windowWidth / 2, windowHeight - ud - 350, windowWidth / 2, windowHeight - ud, rgba(0, 255, 255, 0), rgba(0, 255, 255, .17));

		//Jmak - Font, title and difficulty opacity
		//bottomMessage
		{
			ctx.textBaseline = "top";
			//message
			ctx.font = "bold 48px Orbitron,NotoSans";
			ctx.fillStyle = "#FFF";
			ctx.textAlign = "left";
			ctx.globalAlpha = 0.35;
			ctx.fillText(CMap.m_path, windowWidth*0.021, windowHeight - ud + 28);

//		ctx.font = "50px Dynamix";
//		ctx.fillStyle = hardshipColor;
//		ctx.fillText(hardship, 10, windowHeight - ud + 77);
			var hardshipCut = 0;
			switch (hardship) {
				case "CASUAL": {
					hardshipCut = 0;
					break;
				}
				case "NORMAL": {
					hardshipCut = 1;
					break;
				}
				case "HARD": {
					hardshipCut = 2;
					break;
				}
				case "MEGA": {
					hardshipCut = 3;
					break;
				}
				case "GIGA": {
					hardshipCut = 4;
					break;
				}
				case "HORNEEE": {
					hardshipCut = 5;
					break;
				}
				case "BASIC": {
					hardshipCut = 6;
					break;
				}
				case "TERA": {
					hardshipCut = 7;
					break;
				}
				case "CUSTOM": {
					hardshipCut = 8;
					break;
				}

			}

			if (hardshipCut <= 4) {
				ctx.drawImage(hardshipCanvas, 0, 43 * hardshipCut, 190, 43, windowWidth * 0.022, windowHeight - ud + 77, 190, 43);
			} else if (hardshipCut == 5) {
				ctx.drawImage(hardshipCanvas, 0, 43 * hardshipCut, 218, 47, windowWidth * 0.022, windowHeight - ud + 77, 218, 47);
			} else {
				ctx.drawImage(hardshipCanvas, 190, 43*(hardshipCut - 6), 190, 43, windowWidth*0.022, windowHeight - ud + 77, 190, 43);
			}

			ctx.globalAlpha = 1;

			//Jmak - Bottom menu: Enlarged FPS size, decreased H size
			if (showCS) ctx.globalAlpha = 0;
			ctx.font = "26px Dynamix,NotoSans";
			ctx.fillStyle = "#FFF";
			ctx.textAlign = "right";
			//ctx.fillText(((realTime - baseTime)/1000).toFixed(3) + " s (REAL)", 0, 50);
			ctx.fillText(fps + " Fps", windowWidth, windowHeight - 90);
			if (musicCtrl.paused) {
				ctx.fillStyle = "#0F0";
			}

			if (showCS) ctx.globalAlpha = 0;
			ctx.font = "22px Dynamix,NotoSans";
			ctx.fillStyle = "#FFF";
			ctx.textAlign = "right";
			if (musicCtrl.paused) {
				ctx.fillStyle = "#0F0";
			}
			ctx.fillText(offset + " 小节延迟/偏移 (O- P+)", windowWidth, windowHeight - 30);
			ctx.fillText(musicCtrl.currentTime.toFixed(3) + " 秒 (音乐)", windowWidth, windowHeight - 55);

			ctx.fillText((hiSpeed/1000).toFixed(1) + " x 下落速度 (Q- E+)", windowWidth*0.80, windowHeight - 30);
			if (audioRate < 0.5 || audioRate > 4.0) {
				ctx.fillStyle = "#F88";
			}
			ctx.fillText(audioRate.toFixed(1) + " x 播放速度 (S- W+)", windowWidth*0.80, windowHeight - 55);
			
			if (showCS) ctx.globalAlpha = 0;
			ctx.font = "18px Dynamix,NotoSans";
			ctx.fillStyle = "#FFF";
			ctx.textAlign = "right";
			if (hOn) {
				ctx.textAlign = "left";
				ctx.fillStyle = "rgba(128, 128, 128, 0.8)";
				//Left Region
				ctx.fillText("(L) 简洁模式", windowWidth*0.24, windowHeight - 106);
				ctx.fillText("(B) 鼠标滚轮方向", windowWidth*0.24, windowHeight - 80);
				ctx.fillText("(Z) 长按锁定/解锁小节", windowWidth*0.24, windowHeight - 55);
				ctx.fillText("(X) 长按锁定/解锁X轴", windowWidth*0.24, windowHeight - 30);
				//Middle Region
				ctx.fillText("(N) 音符计算器", windowWidth*0.38, windowHeight - 106);
				ctx.fillText("(←↓→)  小节线", windowWidth*0.38, windowHeight - 80);
				ctx.fillText("(C- V+) ±小节切分数", windowWidth*0.38, windowHeight - 55);
				ctx.fillText("(A- D+) ±[0.01]1s", windowWidth*0.38, windowHeight - 30);
				//Right Region
				if (navigator.userAgent.indexOf("Mac") != -1) {
					ctx.fillText("(Ctrl Cmd F) 全屏", windowWidth*0.52, windowHeight - 80);
				} else {
					ctx.fillText("(F11) 全屏", windowWidth*0.52, windowHeight - 80);
				}
				ctx.fillText("(Shift← →) 撤销/恢复", windowWidth*0.52, windowHeight - 55);
				ctx.fillText("(G) Bleed", windowWidth*0.52, windowHeight - 30);
			}
			//Jmak - Prevent the font of the note types numbers being affected by the help menu
			ctx.font = "22px Dynamix,NotoSans";
			//End of prevention

			//Jmak - Legacy menu
			//ctx.font = "22px Dynamix,NotoSans";
			// if (hOn) {
			// 	ctx.textAlign = "left";
			// 	ctx.fillStyle = "rgba(128, 128, 128, 0.8)";
			// 	//Left Region
			// 	ctx.fillText("(B) 鼠标滚轮方向", windowWidth*0.24, windowHeight - 80);
			// 	ctx.fillText("(Z) 长按锁定/解锁小节", windowWidth*0.24, windowHeight - 55);
			// 	ctx.fillText("(X) 长按锁定/解锁X轴", windowWidth*0.24, windowHeight - 30);
			// 	//Middle Region
			// 	ctx.fillText("(←↓→)  小节线", windowWidth*0.38, windowHeight - 80);
			// 	ctx.fillText("(C- V+) ±小节切分数", windowWidth*0.38, windowHeight - 55);
			// 	ctx.fillText("(A- D+) ±[0.01]1s", windowWidth*0.38, windowHeight - 30);
			// 	//Right Region
			// 	if (navigator.userAgent.indexOf("Mac") != -1) {
			// 		ctx.fillText("(Ctrl Cmd F) 全屏", windowWidth*0.53, windowHeight - 80);
			// 	} else {
			// 		ctx.fillText("(F11) 全屏", windowWidth*0.53, windowHeight - 80);
			// 	}
			// 	ctx.fillText("(Shift← →) 撤销/恢复", windowWidth*0.52, windowHeight - 55);
			// 	ctx.fillText("(L) 简洁模式", windowWidth*0.52, windowHeight - 30);
			// }
//		ctx.fillText(offset + " s offset (O- P+)", windowWidth, windowHeight - 25);
//		ctx.fillText(musicCtrl.currentTime.toFixed(3) + " s (MUSIC)", windowWidth, windowHeight - 50);
//		ctx.fillText((hiSpeed/1000).toFixed(1) + " x Hispeed (Q- E+)", windowWidth, windowHeight - 100);
//		if (audioRate < 0.5 || audioRate > 4.0) {
//			ctx.fillStyle = "#F88";
//		}
//		ctx.fillText(audioRate.toFixed(1) + " x Rate (S- W+)", windowWidth, windowHeight - 75);
			ctx.textAlign = "left";
			ctx.fillStyle = "#FFF";
			ctx.globalAlpha = 1;

			/*
                    ctx.fillStyle =  "white";
                    ctx.shadowColor = "white";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 3;
            */
			//editLine
			if ((includeSolidBarLine && showD % 3 != 0) || (!includeSolidBarLine && showD % 2 == 1)) {
				ctx.globalAlpha = !includeSolidBarLine
					? 0.5
					: showD % 3 == 1
						? 0.5
						: 1;
				for (var qsection = Math.ceil(thisTime/spq); hiSpeed*(qsection*spq - thisTime) <= windowHeight - ud; ++qsection) {
					var lineDis = hiSpeed*(qsection*spq - thisTime);
					var lineColor1 = rgba(128, 128, 128, 0.0);
					var lineColor2 = rgba(128, 128, 128, 1.0);
					var lineWidth = 3;
					var b = 2;
					if (qsection == 0) {
						b = 1024;
					}
					else while (qsection % b == 0) {
						b = b*2;
					}
					if (qsection % 8 == 0) {
						lineColor1 = rgba(255, 255, 255, 0.0);
						lineColor2 = rgba(255, 255, 255, 1.0);
						lineWidth = 12;
					}
					else if (qsection % 4 == 0) {
						lineColor1 = rgba(192, 192, 192, 0.0);
						lineColor2 = rgba(192, 192, 192, 1.0);
						lineWidth = 9;
					}
					else if (qsection % 2 == 0) {
						lineColor1 = rgba(128, 128, 128, 0.0);
						lineColor2 = rgba(128, 128, 128, 1.0);
						lineWidth = 3;
					}
					if ((!low)) {
						drawJBox(ctx, lr, windowHeight - ud - lineDis - lineWidth, windowWidth - 2*lr, lineWidth, windowWidth/2, windowHeight - ud - lineDis - lineWidth, windowWidth/2, windowHeight - ud - lineDis, lineColor1, lineColor2);
					}
					else {
						ctx.fillRect(lr, windowHeight - ud - lineDis - lineWidth/2, windowWidth - 2*lr, lineWidth);
					}
				}
				ctx.globalAlpha = 1;
				ctx.save();
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2;
				for(var h = Math.ceil(thisTime / spq); hiSpeed * (h * spq - thisTime) <= windowHeight - ud; ++h) {
					var d = hiSpeed * (h * spq - thisTime);
					var r = rgba(128, 128, 128, 1);
					var n = 2;
					if(h == 0) {
						n = 1024
					} else
						while(h % n == 0) {
							n = n * 2
						}
					if(h % 8 == 0) {
						r = rgba(255, 255, 255, 1)
					} else if(h % 4 == 0) {
						r = rgba(192, 192, 192, 1)
					} else if(h % 2 == 0) {
						r = rgba(128, 128, 128, 1)
					}
					ctx.fillStyle = r;
					if(hiSpeed * spq >= 50 / n) {
						ctx.strokeText(h / 32, windowWidth - lr + 5, windowHeight - ud - d - 20);
						ctx.fillText(h / 32, windowWidth - lr + 5, windowHeight - ud - d - 20)
					}
				}
				ctx.restore();
			}
			ctx.textAlign = "center";
			if ((includeSolidBarLine && showL % 3 != 0) || (!includeSolidBarLine && showL % 2 == 1)) {
				ctx.globalAlpha = !includeSolidBarLine
					? 0.5
					: showL % 3 == 1
						? 0.5
						: 1;
				for (var qsection = Math.ceil(thisTime/spq); hiSpeed*(qsection*spq - thisTime) <= windowWidth/2 - lr; ++qsection) {
					var lineDis = hiSpeed*(qsection*spq - thisTime);
					var lineColor1 = rgba(128, 128, 128, 0.0);
					var lineColor2 = rgba(128, 128, 128, 1.0);
					var lineWidth = 5;
					var b = 2;
					if (qsection == 0) {
						b = 1024;
					}
					else while (qsection % b == 0) {
						b = b*2;
					}
					if (qsection % 8 == 0) {
						lineColor1 = rgba(255, 255, 255, 0.0);
						lineColor2 = rgba(255, 255, 255, 1.0);
						lineWidth = 12;
					}
					else if (qsection % 4 == 0) {
						lineColor1 = rgba(192, 192, 192, 0.0);
						lineColor2 = rgba(192, 192, 192, 1.0);
						lineWidth = 9;
					}
					else if (qsection % 2 == 0) {
						lineColor1 = rgba(128, 128, 128, 0.0);
						lineColor2 = rgba(128, 128, 128, 1.0);
						lineWidth = 3;
					}
					if ((!low)) {
						drawJBox(ctx, lr + lineDis, 0, lineWidth, windowHeight - ud, lr + lineDis, 0, lr + lineDis + lineWidth, 0,lineColor2, lineColor1);
					}
					else {
						ctx.fillRect(lr + lineDis - lineWidth/2, 0, lineWidth, windowHeight - ud);
					}
				}
				ctx.globalAlpha = 1;
				ctx.save();
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2;
				for(var h = Math.ceil(thisTime / spq); hiSpeed * (h * spq - thisTime) <= windowWidth / 2 - lr; ++h) {
					var d = hiSpeed * (h * spq - thisTime);
					var r = rgba(128, 128, 128, 1);
					var n = 2;
					if(h == 0) {
						n = 1024
					} else
						while(h % n == 0) {
							n = n * 2
						}
					if(h % 8 == 0) {
						r = rgba(255, 255, 255, 1)
					} else if(h % 4 == 0) {
						r = rgba(192, 192, 192, 1)
					} else if(h % 2 == 0) {
						r = rgba(128, 128, 128, 1)
					}
					ctx.fillStyle = r;
					if(hiSpeed * spq >= 200 / n) {
						ctx.strokeText(h / 32, d + lr, windowHeight - ud);
						ctx.fillText(h / 32, d + lr, windowHeight - ud)
					}
				}
				ctx.restore();
			}
			if ((includeSolidBarLine && showR % 3 != 0) || (!includeSolidBarLine && showR % 2 == 1)) {
				ctx.globalAlpha = !includeSolidBarLine
					? 0.5
					: showR % 3 == 1
						? 0.5
						: 1;
				for (var qsection = Math.ceil(thisTime/spq); hiSpeed*(qsection*spq - thisTime) <= windowWidth/2 - lr; ++qsection) {
					var lineDis = hiSpeed*(qsection*spq - thisTime);
					var lineColor1 = rgba(128, 128, 128, 0.0);
					var lineColor2 = rgba(128, 128, 128, 1.0);
					var lineWidth = 5;
					var b = 2;
					if (qsection == 0) {
						b = 1024;
					}
					else while (qsection % b == 0) {
						b = b*2;
					}
					if (qsection % 8 == 0) {
						lineColor1 = rgba(255, 255, 255, 0.0);
						lineColor2 = rgba(255, 255, 255, 1.0);
						lineWidth = 12;
					}
					else if (qsection % 4 == 0) {
						lineColor1 = rgba(192, 192, 192, 0.0);
						lineColor2 = rgba(192, 192, 192, 1.0);
						lineWidth = 9;
					}
					else if (qsection % 2 == 0) {
						lineColor1 = rgba(128, 128, 128, 0.0);
						lineColor2 = rgba(128, 128, 128, 1.0);
						lineWidth = 3;
					}
					if ((!low)) {
						drawJBox(ctx, windowWidth - lr - lineDis - lineWidth, 0, lineWidth, windowHeight - ud, windowWidth - lr - lineDis - lineWidth, 0, windowWidth - lr - lineDis, 0,lineColor1, lineColor2);
					}
					else {
						ctx.fillRect(windowWidth - lr - lineDis - lineWidth/2, 0, lineWidth, windowHeight - ud);
					}
				}
				ctx.globalAlpha = 1;
				ctx.save();
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2;
				for(var h = Math.ceil(thisTime / spq); hiSpeed * (h * spq - thisTime) <= windowWidth / 2 - lr; ++h) {
					var d = hiSpeed * (h * spq - thisTime);
					var r = rgba(128, 128, 128, 1);
					var n = 2;
					if(h == 0) {
						n = 1024
					} else
						while(h % n == 0) {
							n = n * 2
						}
					if(h % 8 == 0) {
						r = rgba(255, 255, 255, 1);
						l = 20
					} else if(h % 4 == 0) {
						r = rgba(192, 192, 192, 1);
						l = 20
					} else if(h % 2 == 0) {
						r = rgba(128, 128, 128, 1);
						l = 10
					}
					ctx.fillStyle = r;
					if(hiSpeed * spq >= 200 / n) {
						ctx.fillText(h / 32, windowWidth - lr - d, windowHeight - ud)
					}
				}
				ctx.restore();
			}
		}

		//ctx.fillText(spq + " s/demisemiquaver", 0, 250);
		/*
		for (var i = 0; i < hitUrl.length; ++i) {
			var used = 0;
			ctx.fillStyle = "#FFF";
			for (var j = 0; j < hitBuffer[i]; ++j) {
				if (! hitCtrl[i][j].paused) ++used;
			}
			if (used == hitBuffer[i]) {
				ctx.fillStyle = "#F88";
			}
			ctx.fillText("hitUsage" + i + " " + used + "/" + hitBuffer[i], 0, 300 + 50*i);
		}
		*/
		if (! editMode) {
			drawNumber(ctx, 1, combo, 1, (hitThisFrame == 10 ? 3 : 4), 0.8*windowWidth, (0.5 - 0.001*hitThisFrame)*windowHeight);
			drawNumber(ctx, 1, preScoreStr, 1, (hitThisFrame == 10 ? 3 : 4), 0.4*windowWidth, (0.5 - 0.001*hitThisFrame)*windowHeight);
		}


		//TLC Edits List for playView.js:
		/**
		 Changed right click menu 4th side option 3 to be Grey color.
		 Changed position of display and activation of Volume Slider.

		 Changed auto Mixer response time to behave more like in Dynamix.
		 Starts moving when chain notes are a distance away from the mixer at the start
		 of a trail of chain notes. Moves fast when there are a lot of chain notes coming
		 at once just like previously.
		 Changed main side center line + side lines to be thinner to be more consistent with Dynamix.

		 Changed help text to be enabled by toggling.
		 Fixed the faint blue glow at the bottom half of the screen that pulses according to the song's BPM like in Dynamix.
		 Add hitsound volume slider and moved hitsound ON/OFF option in the right click menu.
		 Add ability to restrict the height of mixers in the right click menu. (Above or below 0.4)
		 Fixed the size of the right click menu, and appearance (Now it will never open with the menu partially outside the screen).
		 Add option to remove the solid guiding barlines from being displayed after pressing arrow keys.
		 Limit the frame rate of particles and animations to 60FPS.

		 Add hold particles continue showing when the song is paused. (Like in Dynamix)

		 */
		var leftTargetDetected = false;
		var rightTargetDetected = false;

		//note
		lowList = [];

		noteShow = [];
		noteHoldShow = [];
		var magPos = (mainMouse.condition == "writeHold" && mainMouse.condition == 2) ? coverPos2 : coverPos1;
		var magWidth = (mainMouse.condition == "writeHold" && mainMouse.condition == 2) ? coverWidth2 : coverWidth1;
		for (var i = 0; i < noteDown.length; ++i) {
			if (! noteDown[i]) continue;
			var thisNote = noteDown[i];
			var touchTime = GetBar(thisNote.m_time);
			var dis = hiSpeed*(touchTime - thisTime);
			var x = mtox(thisNote.m_position, 0);
			var width = thisNote.m_width *300 - 30;
			switch (thisNote.m_type) {
				case "NORMAL":
					if (dis >= 0 && dis <= windowHeight - ud) {
						noteShow.push([0, 0, width, x, dis, ((editSide == 0 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 0 && equal(thisNote.m_width, magWidth)) ? 1 : 0), thisNote.m_id]);
					}
//						drawSingleNote(ctx, 0, width, x, dis);
					if (! noteDownHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
						noteDownHit[i] = true;
						hitAnime(0, 0, width, x, Math.floor(10.0/audioRate));
					}
					break;

				case "CHAIN":
					if (dis >= 0 && dis <= windowHeight - ud) {
						noteShow.push([1, 0, width, x, dis, ((editSide == 0 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 0 && equal(thisNote.m_width, magWidth)) ? 1 : 0), thisNote.m_id]);
					}
					if (! noteDownHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
						noteDownHit[i] = true;
						hitAnime(0, 1, width, x, Math.floor(10.0/audioRate));
					}
					break;

				//Jmak w/ Special Guest - Hold particles amount is Hardcoded
				case "HOLD":
					var subTime = GetBar(noteDown[noteDown[i].m_subId].m_time);
					var dis2 = hiSpeed*(subTime - thisTime);
					var extra = 0;
					if (! noteDownHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
						noteDownHit[i] = true;
						hitAnime(0, 2, width, x, Math.floor((subTime - thisTime)*60/audioRate));
					}
					if (dis > windowHeight - ud || dis2 < 0) {
						break;
					}
					if (dis2 >= windowHeight - ud +100) {
						dis2 = windowHeight - ud +100;
					}
					if (dis <= 0) {
						if (modifyParticlesInNextFrame) {
							shootParticle(8 + Math.floor(Math.random() * 24), 1, x + (Math.random() - 0.5) * width, windowHeight - ud, Math.random() * 360, x + (Math.random() * 2 - 1) * width * 2, windowHeight - ud + (Math.random() - 0.5) * 2 * ud * 2, (Math.random() - 0.5) * 180);
						}
						extra = 180 - Math.round(- dis) % 180;
						dis = 0;
					}
					noteHoldShow.push([0, width, dis2 - dis, x, dis, extra, ((editSide == 0 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 0 && equal(thisNote.m_width, magWidth)) ? 1 : 0), noteDownHit[i], thisNote.m_id]);
					break;

				case "SUB":
					if ((autoMode && touchTime < thisTime && ! noteDownHit[i]) || Math.abs(touchTime - thisTime) <= currentPerfectJudge && ! noteDownHit[i]) {
						noteDownHit[i] = true;
						hitAnime(0, 3, width, x, Math.floor(10.0/audioRate));
					}
					break;
			}
		}

		for (var i = 0; i < noteLeft.length; ++i) {
			if (! noteLeft[i]) continue;
			var thisNote = noteLeft[i];
			var touchTime = GetBar(thisNote.m_time);
			var dis = hiSpeed*(touchTime - thisTime);
			var x = mtox(thisNote.m_position, 1);
			var width = thisNote.m_width*150 - 30;
			switch (thisNote.m_type) {
				case "NORMAL":
					if (dis >= 0 && dis <= windowWidth/2 - lr) {
						noteShow.push([0, 1, width, x, dis, ((editSide == 1 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 1 && equal(thisNote.m_width, magWidth)) ? 1 : 0), thisNote.m_id]);
					}
//						drawSingleNote(ctx, 1, width, x, dis);
					if (! noteLeftHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
						noteLeftHit[i] = true;
						hitAnime(1, 0, width, x, Math.floor(10.0/audioRate));
					}
					break;

				case "CHAIN":
					if (dis >= 0 && dis <= windowWidth/2 - lr) {
						if (dis < 500 && leftTargetDetected == false) {
							barTargetL = x;
							leftTargetDetected = true;
						}

						noteShow.push([1, 1, width, x, dis, ((editSide == 1 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 1 && equal(thisNote.m_width, magWidth)) ? 1 : 0), thisNote.m_id]);
					}
//						drawSlideNote(ctx, 1, width, x, dis);
					if (! noteLeftHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge || (Math.abs(touchTime - thisTime) <= perfectJudge && CMap.m_leftRegion == "MIXER"))) {
						noteLeftHit[i] = true;
						hitAnime(1, 1, width, x, Math.floor(10.0/audioRate));
					}
					break;

				//Jmak w/ Special Guest - Hold particles amount is Hardcoded
				case "HOLD":
					var subTime = GetBar(noteLeft[noteLeft[i].m_subId].m_time);
					var dis2 = hiSpeed*(subTime - thisTime);
					var extra = 0;
					if (! noteLeftHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
						noteLeftHit[i] = true;
						hitAnime(1, 2, width, x, Math.floor((subTime - thisTime)*60/audioRate));
					}
					if (dis > windowWidth - lr || dis2 < 0) {
						break;
					}
					if (dis2 >= windowWidth - lr +100) {
						dis2 = windowWidth - lr +100;
					}
					if (dis <= 0) {
						if (modifyParticlesInNextFrame) {
							shootParticle(8 + Math.floor(Math.random() * 24), 1, lr, x + (Math.random() - 0.5) * width, Math.random() * 360, lr + (Math.random() - 0.5) * 2 * ud * 2, x + (Math.random() - 0.5) * 2 * width * 2, (Math.random() - 0.5) * 180);
						}
						extra = 180 - Math.round(- dis) % 180;
						dis = 0;
					}
					noteHoldShow.push([1, width, dis2 - dis, x, dis, extra, ((editSide == 1 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 1 && equal(thisNote.m_width, magWidth)) ? 1 : 0), noteLeftHit[i], thisNote.m_id]);
//					drawLongNote(ctx, 1, width, dis2 - dis, x, dis, extra);
//					drawLongBoxNote(ctx, 1, width, dis2 - dis, x, dis, extra);
					break;
//					var x = windowHeight/2 + (-2.5 + Number(thisNote.m_position))*150;
//					var width = thisNote.m_width*150 - 30;
//					var subTime = noteLeft[noteLeftMap[noteLeft[i].m_id]].m_time*(spu);
//					var dis2 = hiSpeed*(subTime - thisTime);
//					if (dis2 >= 0) {
//						if (dis2 >= windowWidth - lr) {
//							dis2 = windowWidth - lr;
//						}
//						if (dis <= 0 || touchTime - thisTime <= lcurrentPerfectJudge) {
//							drawLongNote(ctx, 1, width, dis2, x, 0);
//							if ((autoMode && touchTime < thisTime && ! noteLeftHit[i]) || Math.abs(touchTime - thisTime) <= currentPerfectJudge && ! noteLeftHit[i]) {
//								noteLeftHit[i] = true;
//								hitAnime(1, 2, thisNote.m_width*150 - 30, x, Math.floor((subTime - thisTime)*60));
//							}
//						}
//						else if (dis > 0 && dis <= windowWidth - lr + 5) {
//							drawLongNote(ctx, 1, width, dis2 - dis, x, dis);
//						}
//					}
//					break;

				case "SUB":
					if (! noteLeftHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
						noteLeftHit[i] = true;
						hitAnime(1, 3, width, x, Math.floor(10.0/audioRate));
					}
					break;
			}
		}

		for (var i = 0; i < noteRight.length; ++i) {
			if (! noteRight[i]) continue;
			var thisNote = noteRight[i];
			var touchTime = GetBar(thisNote.m_time);
			var dis = hiSpeed*(touchTime - thisTime);
			var x = mtox(thisNote.m_position, 2);
			var width = thisNote.m_width*150 - 30;
			switch (thisNote.m_type) {
				case "NORMAL":
					if (dis >= 0 && dis <= windowWidth/2 - lr) {
						noteShow.push([0, 2, width, x, dis, ((editSide == 2 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 2 && equal(thisNote.m_width, magWidth)) ? 1 : 0), thisNote.m_id]);
					}
//						drawSingleNote(ctx, 2, width, x, dis);
					if (! noteRightHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
						noteRightHit[i] = true;
						hitAnime(2, 0, width, x, Math.floor(10.0/audioRate));
					}
					break;

				case "CHAIN":
					if (dis >= 0 && dis <= windowWidth/2 - lr) {
						if (dis < 500 && rightTargetDetected == false) {
							barTargetR = x;
							rightTargetDetected = true;
						}

						noteShow.push([1, 2, width, x, dis, ((editSide == 2 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 2 && equal(thisNote.m_width, magWidth)) ? 1 : 0), thisNote.m_id]);
					}
//						drawSlideNote(ctx, 2, width, x, dis);
					if (! noteRightHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge || (Math.abs(touchTime - thisTime) <= perfectJudge && CMap.m_rightRegion == "MIXER"))) {
						noteRightHit[i] = true;
						hitAnime(2, 1, width, x, Math.floor(10.0/audioRate));
					}
					break;

				//Jmak w/ Special Guest - Hold particles amount is Hardcoded
				case "HOLD":
					var subTime = GetBar(noteRight[noteRight[i].m_subId].m_time);
					var dis2 = hiSpeed*(subTime - thisTime);
					var extra = 0;
					if (! noteRightHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
						noteRightHit[i] = true;
						hitAnime(2, 2, width, x, Math.floor((subTime - thisTime)*60/audioRate));
					}
					if (dis > windowWidth - lr || dis2 < 0) {
						break;
					}
					if (dis2 >= windowWidth - lr +100) {
						dis2 = windowWidth - lr +100;
					}
					if (dis <= 0) {
						if (modifyParticlesInNextFrame) {
							shootParticle(8 + Math.floor(Math.random() * 24), 1, windowWidth - lr, x + (Math.random() - 0.5) * width, Math.random() * 360, windowWidth - lr + (Math.random() - 0.5) * 2 * ud * 2, x + (Math.random() - 0.5) * 2 * width * 2, (Math.random() - 0.5) * 180);
						}
						extra = 180 - Math.round(- dis) % 180;
						dis = 0;
					}
					noteHoldShow.push([2, width, dis2 - dis, x, dis, extra, ((editSide == 2 && equal(thisNote.m_position, magPos)) ? 2 : 0) + ((editSide == 2 && equal(thisNote.m_width, magWidth)) ? 1 : 0), noteRightHit[i], thisNote.m_id]);
					break;

				case "SUB":
					if (! noteRightHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
						noteRightHit[i] = true;
						hitAnime(2, 3, thisNote.m_width*150 - 30, x, Math.floor(10.0/audioRate));
					}
					break;
			}
		}
		if (hitNote > 1) {
			hitDouble = 4;
		}
		else {
			hitDouble = Math.max(0, hitDouble - 1);
		}
		var w = 13;
		for (var v of noteHoldShow) {
			drawLongNote(ctx, v[0], v[1], v[2], v[3], v[4], v[5], v[7]);
		}
		for (var v of noteHoldShow) {
			drawLongBoxNote(ctx, v[0], v[1], v[2], v[3], v[4], v[5]);
			if (showCS) continue;
			if (v[7] === movingId || (v[4] > 0 && v[6] > 0)) {
				switch (v[6]) {
					case 1:
						ctx.fillStyle = "rgba(64, 64, 255, 1)";
						break;
					case 2:
						ctx.fillStyle = "rgba(255, 64, 64, 1)";
						break;
					case 3:
						ctx.fillStyle = "rgba(255, 64, 255, 1)";
						break;
				}
				if (mainMouse.movement == "choose" && v[7] === movingId) {
					if (editSide == movingSide) {
						ctx.fillStyle = "rgba(255, 255, 255, 1)";
					}
					else {
						ctx.fillStyle = "rgba(255, 255, 255, 0)";
					}
				}
				switch (editSide) {
					case 0:
						ctx.fillRect(v[3] - w, windowHeight - ud - v[4] - w, 2*w, 2*w);
						break;
					case 1:
						ctx.fillRect(lr + v[4] - w, v[3] - w, 2*w, 2*w);
						break;
					case 2:
						ctx.fillRect(windowWidth - lr - v[4] - w, v[3] - w, 2*w, 2*w);
						break;
				}
			}
		}

		for (var v of noteShow) {
			if (v[0] == 0) {
				drawSingleNote(ctx, v[1], v[2], v[3], v[4]);
			}
			else {
				drawSlideNote(ctx, v[1], v[2], v[3], v[4]);
			}
			if (showCS) continue;
			if (v[6] === movingId || (v[4] > 0 && v[5] > 0)) {
				switch (v[5]) {
					case 1:
						ctx.fillStyle = "rgba(64, 64, 255, 1)";
						break;
					case 2:
						ctx.fillStyle = "rgba(255, 64, 64, 1)";
						break;
					case 3:
						ctx.fillStyle = "rgba(255, 64, 255, 1)";
						break;

				}
				if (mainMouse.movement == "choose" && v[6] === movingId) {
					if (editSide == movingSide) {
						ctx.fillStyle = "rgba(255, 255, 255, 1)";
					}
					else {
						ctx.fillStyle = "rgba(255, 255, 255, 0)";
					}
				}
				switch (editSide) {
					case 0:
						ctx.fillRect(v[3] - w, windowHeight - ud - v[4] - w, 2*w, 2*w);
						break;
					case 1:
						ctx.fillRect(lr + v[4] - w, v[3] - w, 2*w, 2*w);
						break;
					case 2:
						ctx.fillRect(windowWidth - lr - v[4] - w, v[3] - w, 2*w, 2*w);
						break;
				}
			}
		}
		if(editSide==3)
		{
			for(var v of bpmlist)
			{
				var dis = hiSpeed*(GetBar(v.m_time) - thisTime);
				drawBpmchange(ctx,dis,v.m_value);
			}
		}


		//bone
		//function drawJBox(c, x, y, w, h, x1, y1, x2, y2, r1, g1, b1, a1, r2, g2, b2, a2)
		// ctx.globalAlpha = jb((1 - Math.abs(Math.round(SetBar(thisTime)/2) - GetBar(thisTime)/2)*2) * 0.2 + 0.8, 0, 1);
		// drawJBox(ctx, 0, windowHeight - ud - 550, windowWidth, 550, windowWidth/2, windowHeight - ud - 550, windowWidth/2, windowHeight - ud, rgba(0, 255, 255, 0.0), rgba(0, 255, 255, 0.2));
		ctx.globalAlpha = 1;
		drawJBox(ctx, 0, windowHeight - ud - 16, windowWidth, 16, windowWidth/2, windowHeight - ud - 16, windowWidth/2, windowHeight - ud, rgba(0, 255, 255, 0.0), rgba(0, 255, 255, 0.5));
		drawJBox(ctx, 0, windowHeight - ud, windowWidth, 20, windowWidth/2, windowHeight - ud, windowWidth/2, windowHeight - ud + 20, rgba(0, 255, 255, 0.5), rgba(0, 255, 255, 0.0));

		drawJBox(ctx, lr, 0, 16, windowHeight - ud, lr, (windowHeight - ud)/2, lr + 16, (windowHeight - ud)/2, rgba(0, 255, 255, 0.5), rgba(0, 255, 255, 0.0));
		drawJBox(ctx, lr - 16, 0, 16, windowHeight - ud, lr - 16, (windowHeight - ud)/2, lr, (windowHeight - ud)/2, rgba(0, 255, 255, 0.0), rgba(0, 255, 255, 0.5));

		drawJBox(ctx, windowWidth - lr - 16, 0, 16, windowHeight - ud, windowWidth - lr - 16, (windowHeight - ud)/2, windowWidth - lr, (windowHeight - ud)/2, rgba(0, 255, 255, 0.0), rgba(0, 255, 255, 0.5));
		drawJBox(ctx, windowWidth - lr, 0, 16, windowHeight - ud, windowWidth - lr , (windowHeight - ud)/2, windowWidth - lr + 16, (windowHeight - ud)/2, rgba(0, 255, 255, 0.5), rgba(0, 255, 255, 0.0));

		//targetLine
		ctx.fillStyle = "#FFF";
		drawRect(ctx, "#FFF", 0, windowHeight - ud - 3, windowWidth, 7);
		drawRect(ctx, "#FFF", lr - 2, 0, 5, windowHeight - ud - 3);
		drawRect(ctx, "#FFF", windowWidth - lr - 2, 0, 5, windowHeight - ud - 3);


		{
			var t = mixerLT;
			if (t > 0) {
				ctx.globalAlpha = jb(t/24, 0, 1);
				ctx.drawImage(mixerShadowCanvasL, 0, 0, 437, 381, lr - 95, barL - 190, 437, 381);
				ctx.globalAlpha = 1;
			}
			var t = mixerRT;
			if (t > 0) {
				ctx.globalAlpha = jb(t/24, 0, 1);
				ctx.drawImage(mixerShadowCanvasR, 0, 0, 437, 381, windowWidth - lr - 342, barR - 190, 437, 381);
				ctx.globalAlpha = 1;
				t = 0;
			}
			if (modifyParticlesInNextFrame) {
				if (mixerLT > 0) mixerLT--;
				if (mixerRT > 0) mixerRT--;
			}




			for (var i = 0; i < hitAnimeList.length; ++i) {
				var thisAnime = hitAnimeList[i];
				var width = thisAnime[2];
				var x = thisAnime[3];
				var maxFrames = thisAnime[4];
				var type = thisAnime[5];
				var per = 1 - (1 - thisAnime[0]/maxFrames)*(1 - thisAnime[0]/maxFrames);
//			switch (type) {
//			case 0:
////				ctx.fillStyle = rgba(0, Math.floor(thisAnime[0]/maxFrames*255), Math.floor(thisAnime[0]/maxFrames*255), (0.3 + 0.7*thisAnime[0]/maxFrames));
//				break;
//			case 1:
////				ctx.fillStyle = rgba(Math.floor(thisAnime[0]/maxFrames*255), 0, 0, (0.3 + 0.7*thisAnime[0]/maxFrames));
//				break;
//			case 2:
////				ctx.fillStyle = rgba(Math.floor(thisAnime[0]/maxFrames*255)s, Math.floor(thisAnime[0]/maxFrames*255), 0, (0.3 + 0.7*thisAnime[0]/maxFrames));
//				break;
//			}

				ctx.globalAlpha = 1 - (1 - thisAnime[0]/maxFrames)*(1 - thisAnime[0]/maxFrames);
				var swid = (width)*Math.min(1, 0.70 + 0.30*per)*(545/305)+5;
				if (low) {
					switch (thisAnime[1]) {
						case 0:
							ctx.fillRect(x - width/2, windowHeight - ud - (0), width, 0 + 1.1*ud*thisAnime[0]/maxFrames);
							break;
						case 1:
							ctx.fillRect(lr + (- 1.1*lr*thisAnime[0]/maxFrames), x - width/2, 1.1*lr*thisAnime[0]/maxFrames, width);
							break;
						case 2:
							ctx.fillRect(windowWidth - lr - (0), x - width/2, 0 + 1.1*lr*thisAnime[0]/maxFrames, width);
							break;
					}

				}
				else {
					switch (thisAnime[1]) {
						case 0:
							ctx.drawImage(perfectShadowCanvasD, 0, 0, 545, 905, x - swid/2, windowHeight - ud - (1202 - 398), swid, 905);
							break;
						case 1:
							ctx.drawImage(perfectShadowCanvasL, 0, 0, 905, 545, lr - 101, x - swid/2, 905, swid);
							break;
						case 2:
							ctx.drawImage(perfectShadowCanvasR, 0, 0, 905, 545, windowWidth - (1202 - 398) - lr, x - swid/2, 905, swid);
							break;
					}
				}
				ctx.globalAlpha = 1;

				if (modifyParticlesInNextFrame) {
					thisAnime[0]--;
				}
				if (thisAnime[0] == 0) {
					hitAnimeList[i] = false;
				}
			}



			

			if (! low ) {

				shadowAnimeList.sort(function(x, y) {
					return x[8] - y[8];
				})
				for (var i = 0; i < shadowAnimeList.length; ++i) {
					var thisAnime = shadowAnimeList[i];
					var frames = thisAnime[0];
					var maxFrames = thisAnime[1];
					if (i < 800 && frames <= maxFrames) {
						var shadowRate = jb((1 - frames/maxFrames), 0, 1);
						var x1 = thisAnime[2];
						var y1 = thisAnime[3];
						var d1 = thisAnime[4];
						var x2 = thisAnime[5];
						var y2 = thisAnime[6];
						var d2 = thisAnime[7];
						var type = thisAnime[8];
						if (!between(x1 + (x2 - x1)*shadowRate, 0, windowWidth) || !between(y1 + (y2 - y1)*shadowRate, 0, windowHeight)) {
							shadowAnimeList[i] = false;
							continue;
						}
						//Jmak - Particles refinement
						ctx.save();
						ctx.translate(x1 + (x2 - x1)*shadowRate, y1 + (y2 - y1)*shadowRate);
						ctx.rotate((d1 + d2*shadowRate) * Math.PI/360);
						//ctx.scale(1 - Math.pow(shadowRate, 3), 1 - Math.pow(shadowRate, 3));
						ctx.scale(1.5 - Math.pow(shadowRate, 5), 1.5 - Math.pow(shadowRate, 3));
						switch (type) {
							case 0: // Purple
							//	ctx.globalAlpha = 0.45 - 0.45*Math.pow(shadowRate, 2);
								ctx.globalAlpha = 0.7 - 0.7*Math.pow(shadowRate, 2);
								ctx.drawImage(purpleParticleCanvas, -58, -73);
								break;
							case 1: // Yellow
							//	ctx.globalAlpha = 0.9 - 0.9*Math.pow(shadowRate, 1.8);
								ctx.globalAlpha = 0.75 - 0.75*Math.pow(shadowRate, 2);
								ctx.drawImage(yellowParticleCanvas, -58, -73);
								break;
							case 2: // White
							//	ctx.globalAlpha = 0.95 (0.35) - 0.95*Math.pow(shadowRate, 2.5);
								ctx.globalAlpha = 0.55 - 0.55 *Math.pow(shadowRate, 1.5);
								ctx.drawImage(whiteParticleCanvas, -58, -73);
							default:
								break;
						}
						ctx.globalAlpha = 1;
						ctx.restore();

						//			switch (type) {
						//			case 0:
						////				ctx.fillStyle = rgba(0, Math.floor(thisAnime[0]/maxFrames*255), Math.floor(thisAnime[0]/maxFrames*255), (0.3 + 0.7*thisAnime[0]/maxFrames));
						//				break;
						//			case 1:
						////				ctx.fillStyle = rgba(Math.floor(thisAnime[0]/maxFrames*255), 0, 0, (0.3 + 0.7*thisAnime[0]/maxFrames));
						//				break;
						//			case 2:
						////				ctx.fillStyle = rgba(Math.floor(thisAnime[0]/maxFrames*255), Math.floor(thisAnime[0]/maxFrames*255), 0, (0.3 + 0.7*thisAnime[0]/maxFrames));
						//				break;
						//			}
					}

					if (modifyParticlesInNextFrame) {
						thisAnime[0]--;
					}
					if (thisAnime[0] == 0) {
						shadowAnimeList[i] = false;
					}
				}

				var newShadowAnimeList = [];
				var j = 0;
				for (i = 0; i < shadowAnimeList.length; ++i) {
					if (shadowAnimeList[i]) {
						newShadowAnimeList[j] = $.extend(true, [], shadowAnimeList[i]);
						++j;
					}
				}
				shadowAnimeList = $.extend(true, [], newShadowAnimeList);
			}


			//TLC - added Mixer restriction
			//bar
			if (modifyParticlesInNextFrame) {
				barL = Math.round((barL + barTargetL) / 2);
			}
			if (barL < 198) {
				barL = 198;
			}
			if (barL > 908 && !restrictMixerHeight) {
				barL = 908;
			} else if (barL > 858 && restrictMixerHeight) {
				barL = 858;
			}

			if (modifyParticlesInNextFrame) {
				barR = Math.round((barR + barTargetR) / 2);
			}
			if (barR < 198) {
				barR = 198;
			}
			if (barR > 908 && !restrictMixerHeight && restrictMixerHeight) {
				barR = 908;
			} else if (barR > 858) {
				barR = 858;
			}
			if (CMap.m_leftRegion == "MIXER") { //198~808
				ctx.drawImage(barCanvas, 0, 0, 79, 234, lr - 40, barL - 117, 79, 234);
			}
			if (CMap.m_rightRegion == "MIXER") {
				ctx.drawImage(barCanvas, 0, 0, 79, 234, windowWidth - lr - 40, barR - 117, 79, 234);
			}

			//animation
			var newHitAnimeList = [];
			var j = 0;
			for (i = 0; i < hitAnimeList.length; ++i) {
				if (hitAnimeList[i]) {
					newHitAnimeList[j] = $.extend(true, [], hitAnimeList[i]);
					++j;
				}
			}
			hitAnimeList = $.extend(true, [], newHitAnimeList);

			//shadowAnime 0frame 1maxframe 234567 x1y1d1x2y2d2 type


		}

		// TLC - Note Type Counter
		if (noteTypeCounterShown) {
			var normalNoteCount = [0, 0, 0];
			var holdNoteCount = [0, 0, 0];
			var chainNoteCount = [0, 0, 0];
			var subNoteCount = [0, 0, 0];

			// Calculate total number of each note type on each side
			for (var i = 0; i < noteDown.length; ++i) {
				if (!noteDown[i]) {
					continue;
				}

				var currNote = noteDown[i];
				switch (currNote.m_type) {
					case "NORMAL":
						normalNoteCount[0] = normalNoteCount[0] + 1;
						break;
					case "HOLD":
						holdNoteCount[0] = holdNoteCount[0] + 1;
						break;
					case "CHAIN":
						chainNoteCount[0] = chainNoteCount[0] + 1;
						break;
					case "SUB":
						subNoteCount[0] = subNoteCount[0] + 1;
						break;
				}
			}

			for (var i = 0; i < noteLeft.length; ++i) {
				if (!noteLeft[i]) {
					continue;
				}

				var currNote = noteLeft[i];
				switch (currNote.m_type) {
					case "NORMAL":
						normalNoteCount[1] = normalNoteCount[1] + 1;
						break;
					case "HOLD":
						holdNoteCount[1] = holdNoteCount[1] + 1;
						break;
					case "CHAIN":
						chainNoteCount[1] = chainNoteCount[1] + 1;
						break;
					case "SUB":
						subNoteCount[1] = subNoteCount[1] + 1;
						break;
				}
			}

			for (var i = 0; i < noteRight.length; ++i) {
				if (!noteRight[i]) {
					continue;
				}

				var currNote = noteRight[i];
				switch (currNote.m_type) {
					case "NORMAL":
						normalNoteCount[2] = normalNoteCount[2] + 1;
						break;
					case "HOLD":
						holdNoteCount[2] = holdNoteCount[2] + 1;
						break;
					case "CHAIN":
						chainNoteCount[2] = chainNoteCount[2] + 1;
						break;
					case "SUB":
						subNoteCount[2] = subNoteCount[2] + 1;
						break;
				}
			}

			var totalNormalNotes = normalNoteCount.reduce(
				(acc, currVal) => acc + currVal, 0
			);

			var totalHoldNotes = holdNoteCount.reduce(
				(acc, currVal) => acc + currVal, 0
			);

			var totalChainNotes = chainNoteCount.reduce(
				(acc, currVal) => acc + currVal, 0
			);

			var totalSubNotes = subNoteCount.reduce(
				(acc, currVal) => acc + currVal, 0
			);

			var totalNotes = totalNormalNotes + totalHoldNotes + totalChainNotes + totalSubNotes;

			// console.log("Total Normal Notes: " + totalNormalNotes.toString());
			// console.log("Total Hold Notes: " + totalHoldNotes.toString());
			// console.log("Total Chain Notes: " + totalChainNotes.toString());
			// console.log("\nTotal Notes: " + totalNotes.toString() + "\n");

			// Draw Note Icons
			drawSingleNote(ctx, 0, 0.7 * 300 - 30, mtox(1.5, 0), 550);

			drawLongNote(ctx, 0, 0.7 * 300 - 30,100, mtox(2.5, 0), 550, 0, true);
			drawLongBoxNote(ctx, 0, 0.7 * 300 - 30,100, mtox(2.5, 0), 550);

			drawSlideNote(ctx, 0, 0.7 * 300 - 30, mtox(3.5, 0), 550);

			// drawNumber(combo, "left", (hitThisFrame > 0 ? 0.58 : 0.48), (hitThisFrame > 0 ? windowWidth*0.89 : windowWidth*0.88),  windowHeight*0.54);

			drawNumber(totalNormalNotes, "center", 0.3, mtox(1.5, 0) + 30,  500);
			drawNumber(totalHoldNotes, "center", 0.3, mtox(2.5, 0) + 30,  500);
			drawNumber(totalChainNotes, "center", 0.3, mtox(3.5, 0) + 30,  500);

		}

		//pre anime
		drawJBox(ctx, 0, 0, (thisTime - offset*spu)/doration*windowWidth, 30, windowWidth/2, 0, windowWidth/2, 30, rgba(0, 255, 255, 0.5), rgba(0, 255, 255, 0.0));
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, windowWidth, 7);
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0, 0, (thisTime - offset*spu)/doration*windowWidth, 7);

		if (modifyParticlesInNextFrame) {
			if (hitThisFrame > 0) {
				hitThisFrame--;
			}
			if (hitThisFrame2 > 0) {
				hitThisFrame2--;
			}
			if (hitDouble > 0) {
				hitDouble--;
			}
		}

		//mouse
		if (mainMouse.movement == "choose") {
			ctx.fillStyle = "#FFF";
			if (mainMouse.condition > 0 && coverPos1 != coverPos2 && coverTime1 != coverTime2) {
				switch (editSide) {
					case 0:
						var x1 = Math.min(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						var x2 = Math.max(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						var y1 = Math.min(windowHeight - ud - (hiSpeed*(GetBar(coverTime1) - thisTime)), windowHeight - ud - (hiSpeed*(GetBar(coverTime2) - thisTime)));
						var y2 = Math.max(windowHeight - ud - (hiSpeed*(GetBar(coverTime1) - thisTime)), windowHeight - ud - (hiSpeed*(GetBar(coverTime2) - thisTime)));
						if (y1 > windowHeight - ud) break;
						if (y1 >= 0) {
							ctx.fillRect(x1 - 3, y1 - 3, x2 - x1 + 6, 6);
						}
						if (y2 <= windowHeight - ud) {
							ctx.fillRect(x1 - 3, y2 - 3, x2 - x1 + 6, 6); //
						}
						y1 = jb(y1, 0, windowHeight - ud);
						y2 = jb(y2, 0, windowHeight - ud);
						ctx.fillRect(x1 - 3, y1 - 3, 6, y2 - y1 + 6);
						ctx.fillRect(x2 - 3, y1 - 3, 6, y2 - y1 + 6);
						ctx.fillStyle = rgba(255, 255, 255, 0.3);
						ctx.fillRect(x1 + 3, y1 + 3, x2 - x1 - 6, y2 - y1 - 6);
						break;

					case 1:
						var x1 = Math.min(lr + (hiSpeed*(GetBar(coverTime1) - thisTime)), lr + (hiSpeed*(GetBar(coverTime2) - thisTime)));
						var x2 = Math.max(lr + (hiSpeed*(GetBar(coverTime1) - thisTime)), lr + (hiSpeed*(GetBar(coverTime2) - thisTime)));
						var y1 = Math.min(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						var y2 = Math.max(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						if (x2 < lr) break;
						if (x1 >= lr) {
							ctx.fillRect(x1 - 3, y1 - 3, 6, y2 - y1 + 6); //
						}
						if (x2 <= windowWidth/2) {
							ctx.fillRect(x2 - 3, y1 - 3, 6, y2 - y1 + 6);
						}
						x1 = jb(x1, lr, windowWidth/2);
						x2 = jb(x2, lr, windowWidth/2);
						ctx.fillRect(x1 - 3, y1 - 3, x2 - x1 + 6, 6);
						ctx.fillRect(x1 - 3, y2 - 3, x2 - x1 + 6, 6);
						ctx.fillStyle = rgba(255, 255, 255, 0.3);
						ctx.fillRect(x1 + 3, y1 + 3, x2 - x1 - 6, y2 - y1 - 6);
						break;

					case 2:
						var x1 = Math.min(windowWidth - lr - (hiSpeed*(GetBar(coverTime1) - thisTime)), windowWidth - lr - (hiSpeed*(GetBar(coverTime2) - thisTime)));
						var x2 = Math.max(windowWidth - lr - (hiSpeed*(GetBar(coverTime1) - thisTime)), windowWidth - lr - (hiSpeed*(GetBar(coverTime2) - thisTime)));
						var y1 = Math.min(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						var y2 = Math.max(mtox(coverPos1, editSide), mtox(coverPos2, editSide));
						if (x1 > windowWidth - lr) break;
						if (x1 >= windowWidth/2) {
							ctx.fillRect(x1 - 3, y1 - 3, 6, y2 - y1 + 6); //
						}
						if (x2 <= windowWidth - lr) {
							ctx.fillRect(x2 - 3, y1 - 3, 6, y2 - y1 + 6);
						}
						x1 = jb(x1, windowWidth/2, windowWidth - lr);
						x2 = jb(x2, windowWidth/2, windowWidth - lr);
						ctx.fillRect(x1 - 3, y1 - 3, x2 - x1 + 6, 6);
						ctx.fillRect(x1 - 3, y2 - 3, x2 - x1 + 6, 6);
						ctx.fillStyle = rgba(255, 255, 255, 0.3);
						ctx.fillRect(x1 + 3, y1 + 3, x2 - x1 - 6, y2 - y1 - 6);
						break;

					default:
						break;
				}
			}
		}
		else {
			for (var i = 0; i < noteTemp.length; ++i) {
				var thisNote = noteTemp[i];
				var touchTime = GetBar(thisNote.m_time);
				var dis = hiSpeed*(touchTime - thisTime);
				var lineDis = dis;
				var lineWidth = 5;
				var fz = Math.round((thisNote.m_time - Math.floor(thisNote.m_time))/(1/(magnaticStrength)));
				var fm = magnaticStrength;
				switch (thisNote.m_type) {
					case "NORMAL":
						var lineColor1 = rgba(0, 255, 255, 0.0);
						var lineColor2 = rgba(0, 255, 255, 1.0);
						break;

					case "CHAIN":
						var lineColor1 = rgba(255, 0, 0, 0.0);
						var lineColor2 = rgba(255, 0, 0, 1.0);
						break;

					case "HOLD":
						var lineColor1 = rgba(255, 255, 0, 0.0);
						var lineColor2 = rgba(255, 255, 0, 1.0);
						break;

					case "SUB":
						var lineColor1 = rgba(255, 128, 0, 0.0);
						var lineColor2 = rgba(255, 128, 0, 1.0);
						break;
				}
				switch (editSide){
					case 0:
					case 3:
						if (dis >= 0 && dis <= windowHeight - ud) {
							drawJBox(ctx, 0, windowHeight - ud - lineDis - lineWidth, windowWidth, lineWidth, 0, windowHeight - ud - lineDis - lineWidth, 0, windowHeight - ud - lineDis, lineColor1, lineColor2);
							drawJBox(ctx, lr + lineDis, 0, lineWidth, windowHeight, lr + lineDis, 0, lr + lineDis + lineWidth, 0, "rgba(255, 0, 255, 1.0)", "rgba(255, 0, 255, 0.0)");
							drawJBox(ctx, windowWidth - lr - lineDis - lineWidth, 0, lineWidth, windowHeight, windowWidth - lr - lineDis - lineWidth, 0, windowWidth - lr - lineDis, 0, "rgba(255, 0, 255, 0.0)", "rgba(255, 0, 255, 1.0)");
							ctx.fillStyle = "white";
							ctx.fillRect(mtox(thisNote.m_position, 0) -1, 0, 3, windowHeight - ud);
							ctx.save();
							ctx.textAlign = "left";
							ctx.shadowColor = rgba(0, 0, 0, 0.9);
							ctx.shadowOffsetX = 0;
							ctx.shadowOffsetY = 0;
							ctx.shadowBlur = 4;
							ctx.fillText(thisNote.m_width, mtox(thisNote.m_position, 0) +22, windowHeight - ud - lineDis);
							ctx.textAlign = "right";
							ctx.fillStyle =  lineColor2;
							ctx.fillText(thisNote.m_position, mtox(thisNote.m_position, 0) -22, windowHeight - ud - lineDis);
							if (i % 2 == 1) {
								ctx.textAlign = "left";
							}
							if (!keysDown[90] && i == noteTemp.length - 1) {
								ctx.fillText("   " + Math.floor(thisNote.m_time) + (fz == 0 ? "" : "+" + fz + "/" + fm) + "  ", mtox(thisNote.m_position, 0) , windowHeight - ud - lineDis - 40);
							}
							else {
								ctx.fillText("      " + thisNote.m_time, mtox(thisNote.m_position, 0) -22, windowHeight - ud - lineDis - 40);
							}
							ctx.restore();
						}
						break;

					case 1:
						if (dis >= 0 && dis <= windowWidth/2 - lr) {
							drawJBox(ctx, 0, windowHeight - ud - lineDis - lineWidth, windowWidth, lineWidth, 0, windowHeight - ud - lineDis - lineWidth, 0, windowHeight - ud - lineDis, "rgba(255, 0, 255, 0.0)", "rgba(255, 0, 255, 1.0)");
							drawJBox(ctx, lr + lineDis, 0, lineWidth, windowHeight, lr + lineDis, 0, lr + lineDis + lineWidth, 0, lineColor2, lineColor1);
							drawJBox(ctx, windowWidth - lr - lineDis - lineWidth, 0, lineWidth, windowHeight, windowWidth - lr - lineDis - lineWidth, 0, windowWidth - lr - lineDis, 0, lineColor1, lineColor2)
							ctx.fillRect(0, mtox(thisNote.m_position, 1) - 1, windowWidth/2, 3);
							ctx.save();
							ctx.textAlign = "left";
							ctx.fillStyle =  "white";
							ctx.shadowColor = rgba(0, 0, 0, 0.9);
							ctx.shadowOffsetX = 0;
							ctx.shadowOffsetY = 0;
							ctx.shadowBlur = 4;
							ctx.fillText(thisNote.m_width, lr + lineDis + 22, mtox(thisNote.m_position, 1));
							ctx.textAlign = "right";
							ctx.fillStyle =  lineColor2;
							ctx.fillText(thisNote.m_position, lr + lineDis - 22, mtox(thisNote.m_position, 1));
							if (i % 2 == 1) {
								ctx.textAlign = "left";
							}
							if (!keysDown[90] && i == noteTemp.length - 1) {
								ctx.fillText(Math.floor(thisNote.m_time) + (fz == 0 ? "" : "+" + fz + "/" + fm) + "      ", lr + lineDis +22, mtox(thisNote.m_position, 1) - 40);
							}
							else {
								ctx.fillText(thisNote.m_time, lr + lineDis -22, mtox(thisNote.m_position, 1) - 40);
							}
							ctx.restore();
						}
						break;

					case 2:
						if (dis >= 0 && dis <= windowWidth/2 - lr) {
							drawJBox(ctx, 0, windowHeight - ud - lineDis - lineWidth, windowWidth, lineWidth, 0, windowHeight - ud - lineDis - lineWidth, 0, windowHeight - ud - lineDis, "rgba(255, 0, 255, 0.0)", "rgba(255, 0, 255, 1.0)");
							drawJBox(ctx, lr + lineDis, 0, lineWidth, windowHeight, lr + lineDis, 0, lr + lineDis + lineWidth, 0, lineColor2, lineColor1);
							drawJBox(ctx, windowWidth - lr - lineDis - lineWidth, 0, lineWidth, windowHeight, windowWidth - lr - lineDis - lineWidth, 0, windowWidth - lr - lineDis, 0, lineColor1, lineColor2);
							ctx.fillRect(windowWidth/2, mtox(thisNote.m_position, 2) - 1, windowWidth/2, 3);
							ctx.save();
							ctx.textAlign = "left";
							ctx.fillStyle =  "white";
							ctx.shadowColor = rgba(0, 0, 0, 0.9);
							ctx.shadowOffsetX = 0;
							ctx.shadowOffsetY = 0;
							ctx.shadowBlur = 4;
							ctx.fillText(thisNote.m_width, windowWidth - lr - lineDis + 22, mtox(thisNote.m_position, 2));
							ctx.textAlign = "right";
							ctx.fillStyle =  lineColor2;
							ctx.fillText(thisNote.m_position, windowWidth - lr - lineDis - 22, mtox(thisNote.m_position, 2));
							if (i % 2 == 0) {
								ctx.textAlign = "left";
							}
							if (!keysDown[90] && i == noteTemp.length - 1) {
								ctx.fillText(Math.floor(thisNote.m_time) + (fz == 0 ? "" : "+" + fz + "/" + fm) + "      ", windowWidth - lr - lineDis +22, mtox(thisNote.m_position, 2) - 40);
							}
							else {
								ctx.fillText(thisNote.m_time, windowWidth - lr - lineDis +22, mtox(thisNote.m_position, 2) - 40);
							}
							ctx.restore();
						}
						break;

					default:
						break;
				}

			}
		}


		//noteTemp
		for (var i = 0; i < Math.min(1, noteTemp.length); ++i) {
			var thisNote = noteTemp[i];
			var touchTime = GetBar(thisNote.m_time);
			var dis = hiSpeed*(touchTime - thisTime);
			var x = mtox(thisNote.m_position, editSide);
			var width = thisNote.m_width*(editSide == 0 ? 300 : 150) - 30;
			var disLimit = editSide == 0 ? windowHeight - ud : windowWidth/2 - lr;
			var disLimit2 = editSide == 0 ? windowHeight - ud : windowWidth - lr;
			switch (thisNote.m_type) {
				case "NORMAL":
					if (dis >= 0 && dis <= disLimit) {
						ctx.globalAlpha = 0.6;
						drawSingleNote(ctx, editSide, width, x, dis);
						ctx.globalAlpha = 1;
//						if (! noteDownHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
//							noteDownHit[i] = true;
//							hitAnime(0, 0, width, x, Math.floor(10.0/audioRate));
//						}
					}
					break;

				case "CHAIN":
					if (dis >= 0 && dis <= disLimit) {
						ctx.globalAlpha = 0.6;
						drawSlideNote(ctx, editSide, width, x, dis);
						ctx.globalAlpha = 1;
//						if (! noteDownHit[i] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
//							noteDownHit[i] = true;
//							hitAnime(0, 1, width, x, Math.floor(10.0/audioRate));
//						}
					}
					break;

				case "HOLD":
					var subTime = GetBar(coverTime2); //special
					var dis2 = hiSpeed*(subTime - thisTime);
					var extra = 0;
					if (dis > disLimit2 || dis2 < 0) {
						break;
					}
					if (dis2 >= disLimit +100) {
						dis2 = disLimit2 +100;
					}
					if (dis <= 0) {
						extra = 180 - Math.round(- dis) % 180;
						dis = 0;
					}
					ctx.globalAlpha = 0.6;
					drawLongNote(ctx, editSide, width, dis2 - dis, x, dis, extra);
					drawLongBoxNote(ctx, editSide, width, dis2 - dis, x, dis, extra);
					ctx.globalAlpha = 1;
					break;

				case "SUB":
					if (dis >= 0 && dis <= disLimit2) {
						var x = windowWidth/2 + (-2.5 + Number(thisNote.m_position))*300;
						var width = thisNote.m_width*300 - 30;
//						if ((autoMode && touchTime < thisTime && ! noteDownHit[i]) || Math.abs(touchTime - thisTime) <= currentPerfectJudge && ! noteDownHit[i]) {
//							noteDownHit[i] = true;
//							hitAnime(0, 3, width, x, Math.floor(10.0/audioRate));
//						}
					}
					break;
			}
		}


		//bottomButtons
		//for (var i = 0;)

		//rightClick
		//TLC - Shifted music volume slider to display and function in the correct row. Also changed 4th menu to have 2nd and 3rd row greyed out
		if (mainMouse.menu) {
			switch (mainMouse.menu) {
				case "basic" :
					drawBox(ctx, rx, ry, 400, 650, 0.8, 8);
					var preSide = editSide;

					basicMenu[1][3] = ((editSide == 1 && CMap.m_leftRegion == "MIXER") || (editSide == 2 && CMap.m_rightRegion == "MIXER")) ? rgba(128, 128, 128, 0.8) : rgba(0, 255, 255, 0.8);
					basicMenu[2][3] = ((editSide == 1 && CMap.m_leftRegion == "PAD") || (editSide == 2 && CMap.m_rightRegion == "PAD")) ? rgba(128, 128, 128, 0.8) : rgba(255, 128, 128, 0.8);
					basicMenu[3][3] = ((editSide == 1 && CMap.m_leftRegion == "MIXER") || (editSide == 2 && CMap.m_rightRegion == "MIXER")) || (editSide == 3) ? rgba(128, 128, 128, 0.8) : rgba(255, 255, 0, 0.8);
					if(editSide==3)
					{
						basicMenu[1][0]="[1]  变速";
						basicMenu[2][0]="[2]  另存为 Dynamite";
						basicMenu[3][0]="[3]  无";
					}
					else if(editSide==0||editSide==1||editSide==2)
					{
						basicMenu[1][0]="[1]  Normal 蓝键";
						basicMenu[2][0]="[2]  Chain 红键";
						basicMenu[3][0]="[3]  Hold 长条";
					}

					if (between(mainMouse.coordinate.x, rx, rx + 400) && between(mainMouse.coordinate.y, ry + 566, ry + 604) && musicCtrl) {
						// Hitsound volume: default to the same as music volume
						hitSoundGainNode.gain.value = showHitSound ? Math.round((mainMouse.coordinate.x - rx)/400*100)/100 : musicCtrl.volume;
					} else if (between(mainMouse.coordinate.x, rx, rx + 400) && between(mainMouse.coordinate.y, ry + 606, ry + 644) && musicCtrl) {
						musicCtrl.volume = Math.round((mainMouse.coordinate.x - rx)/400*100)/100;
					}
					else if (between(mainMouse.coordinate.y, ry + 0, ry + 38)) {
						if (between(mainMouse.coordinate.x, rx, rx + 100)) {
							editSide = 1;
						}
						else if (between(mainMouse.coordinate.x, rx + 100, rx + 200)) {
							editSide = 0;
						}
						else if (between(mainMouse.coordinate.x, rx + 200, rx + 300)) {
							editSide = 2;
						}
						else if (between(mainMouse.coordinate.x, rx + 300, rx + 400)) {
							editSide = 3;
						}

					}
					if (editSide != preSide) {
						changeSide();
					}

					if (showHitSound) {
						ctx.fillStyle = rgba(Math.round(jb((255 - hitSoundGainNode.gain.value * 255)), 0, 255), Math.round(jb(hitSoundGainNode.gain.value * 255, 0, 255)), Math.round(jb(hitSoundGainNode.gain.value * 255, 0, 255)), 0.8);
						ctx.fillRect(rx, ry + 566, hitSoundGainNode.gain.value * 400, 38);
					}

					ctx.fillStyle = rgba(Math.round(jb((255 - musicCtrl.volume*255)), 0, 255), Math.round(jb(musicCtrl.volume*255, 0, 255)), Math.round(jb(musicCtrl.volume*255, 0, 255)), 0.8);
					ctx.fillRect(rx, ry + 606, musicCtrl.volume*400, 38);

					ctx.fillStyle = rgba(128, 128, 128, 0.8);
					switch (editSide){
						case 0:
							ctx.fillRect(rx + 100, ry + 6, 100, 38);
							basicMenu[0][0] = "[↑]  编辑 ↓";
							break;
						case 1:
							ctx.fillRect(rx, ry + 6, 100, 38);
							basicMenu[0][0] = "[↑]  编辑 ←";
							break;
						case 2:
							ctx.fillRect(rx + 200, ry + 6, 100, 38);
							basicMenu[0][0] = "[↑]  编辑 →";
							break;
						case 3:
							ctx.fillRect(rx + 300, ry + 6, 100, 38);
							basicMenu[0][0] = "[#]  编辑 #";
							break;
						default:
							break;
					}
					//TLC & Jmak - Added Mixer restriction (0.4)
					basicMenu[6][0] = "     标记 " + (thisTime / spq / 32).toFixed(3);
					basicMenu[7][0] = "[M]  从标记点开始 " + Number(markSecion).toFixed(3);
					basicMenu[12][0] = "     Mixer 限制 " + (restrictMixerHeight ? "开" : "关");
					//basicMenu[12][0] = "     Mixer " + (restrictMixerHeight ? "ABOVE" : "BELOW") + " 0.4";
					basicMenu[13][0] = "     粒子特效 " + (showParticles ? "开" : "关");
					basicMenu[14][0] = "     打击声" + (showHitSound ? "量 " + Math.round(hitSoundGainNode.gain.value * 100) + "%" : " 关");
					basicMenu[15][0] = "     音量 " + Math.round(musicCtrl.volume * 100) + "%";
					if (musicCtrl) {
						if (musicCtrl.paused) {
							basicMenu[5][0] = "[_]  播放";
							basicMenu[5][3] = "rgba(0, 255, 0, 0.8)";
						}
						else {
							basicMenu[5][0] = "[_]  暂停";
							basicMenu[5][3] = "rgba(255, 0, 0, 0.8)";
						}
					}
					else {
						basicMenu[5][0] = "Music ctrl error";
						basicMenu[5][3] = "rgba(255, 0, 0, 0.8)";
					}
					var thisMenu = basicMenu;
					break;

				case "delete" :
					drawBox(ctx, rx, ry, 400, 50, 0.8, 8);
					var thisMenu = deleteMenu;
					break;

			}
			ctx.textAlign = "left";
			ctx.textBaseline = "alphabetic";
			ctx.font = "bold 28px Dynamix";
			for (var i = 0; i < thisMenu.length; ++i) { // Menu Color
				if (!(i == 0 && thisMenu.length != 1) && (!showHitSound || i != 14) && i != 15 && between(mainMouse.coordinate.y, ry + thisMenu[i][1], ry + thisMenu[i][1] + thisMenu[i][2]) && between(mainMouse.coordinate.x, rx, rx + 440)) {
					ctx.fillStyle = thisMenu[i][3] ? thisMenu[i][3] : "rgba(0, 255, 255, 0.8)";
					ctx.fillRect(rx, ry + thisMenu[i][1], 400, thisMenu[i][2]);
					ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
				}
				else {
					ctx.fillStyle = thisMenu[i][3] ? thisMenu[i][3] : "rgba(0, 255, 255, 0.8)";
				}
				ctx.fillText(thisMenu[i][0], rx + 20, ry + thisMenu[i][1] + thisMenu[i][2] - 10);
			}
			ctx.textBaseline = "top";
		}
	}
}
