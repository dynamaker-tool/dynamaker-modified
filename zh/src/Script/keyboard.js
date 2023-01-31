var keysDown = {};
var keysReacted = {};
var lastKeydownTimes = {};
for (var i = 0; i < 256; ++i) {
	keysReacted[i] = 0;
}

function keyboard() {
}

function kble(i) {
	if (i in keysDown) {
		if (keysReacted[i] == 0) {
			keysReacted[i] = 1;
			return true;
		}
		else {
			return keysReacted[i] == 13;
		}
	}
	else {
		return false;
	}
}

// Force release of modifier keys in 2 seconds
setInterval(function() {
	var now = +new Date();
	for(keyCode in lastKeydownTimes) {
		if(now - lastKeydownTimes[keyCode] >= 2000) {
			delete keysDown[keyCode];
		}
	}
}, 1000);

keyboard.prototype = {
	set:function() {
		addEventListener("keydown", function (e) {
			if (scene && scene.banKeyboard) return;
			// Exclude modifier keys for compatibility with closing prompt
			// For future compatibility with key combos using these modifiers,
			// add inclusions for each key individually
			//             LRCtrl          LMeta           LRAlt           RMeta             
			if (! (keysDown[17] || keysDown[91] || keysDown[18] || keysDown[93])) {
				keysDown[e.keyCode] = true;
			}
			if (e.keyCode === 17 || e.keyCode === 91 || e.keyCode === 18 || e.keyCode === 93) {
				lastKeydownTimes[e.keyCode] = +new Date();
			}
	  //   	if (kble(70)) { // F
	  //   		if (isFullScreen) {
	  //   			unFullScreen();
	  //   		}
	  //      		else {
	  //      			fullScreen();
	  //      		}
			// }
		}, false);

		addEventListener("keyup", function (e) {
			keysReacted[e.keyCode] = 0;
			delete keysDown[e.keyCode];
		}, false);
		this.ready = true;
	},
	refresh:function() {
		if (scene && scene.banKeyboard) return;
		for (var i = 0; i < 256; ++i) {
			if (keysReacted[i] != 13 && keysReacted[i] != 0) {
				++keysReacted[i];
			}
		}
		if (mainMouse) {
			var toolOnChange = false;
			if(editSide==3)
			{
				if (keysDown[49] && mainMouse.movement != "writeBPM") //1
				{
					mainMouse.movement = "writeBPM";
					//toolOnChange = true;
				}
			}
			else
			{
				if (keysDown[49] && mainMouse.movement != "writeNormal" && !((editSide == 1 && CMap.m_leftRegion == "MIXER") || (editSide == 2 && CMap.m_rightRegion == "MIXER"))) { // 1!
					mainMouse.movement = "writeNormal";
					toolOnChange = true;
				}
				if (keysDown[50] && mainMouse.movement != "writeChain" && !((editSide == 1 && CMap.m_leftRegion == "PAD") || (editSide == 2 && CMap.m_rightRegion == "PAD"))) { // 2@
					mainMouse.movement = "writeChain";
					toolOnChange = true;
				}
				if (keysDown[51] && mainMouse.movement != "writeHold"  && !((editSide == 1 && CMap.m_leftRegion == "MIXER") || (editSide == 2 && CMap.m_rightRegion == "MIXER"))) { // 3#
					mainMouse.movement = "writeHold";
					toolOnChange = true;
				}
				if (keysDown[52] && mainMouse.movement != "choose") { // 4$
					mainMouse.movement = "choose";
					toolOnChange = true;
				}
			}
			if (keysDown[8] || keysDown[46]) { //backspace or del
				noteChosenList.sort(function (x, y) {
            		return y-x;
            	});
            	for (var j of noteChosenList) {
					var delNote = getNote(j, editSide);
					switch (delNote.m_type) {
						case "HOLD":
							var subId = delNote.m_subId;
							delNoteById(j, editSide);
							delNoteById(subId, editSide);
							break;
						case "NORMAL":
						case "CHAIN":
							delNoteById(j, editSide);
							break;
						default:{}
					}
				}
				toolOnChange = true;
        	}
		}
		if (toolOnChange) {
			mainMouse.menu = false;
			mainMouse.condition = 0;
			noteTemp = [];
			noteChosen = [];
			noteChosenList = [];
		}
			
		if (kble(76)) { // L
			low = ! low;
		}
		if (kble(37)) { //left
			if (keysDown[16]) {
				undo();
			}
			else {
				showL = (showL + 1) % 6;
			}
		}
		if (kble(38)) { //up38 9tab
			editSide = (editSide + 1) % 3;
			changeSide();
		}
		if (kble(39)) { //right
			if (keysDown[16]) {
				redo();
			}
			else {
				showR = (showR + 1) % 6;
			}
		}
		if (kble(40)) { //down
			showD = (showD + 1) % 6;
		}
		if (kble(66)) { // B
			rollReverse = ! rollReverse;
		}
		if (kble(81)) { // Q
			if (hiSpeed <= 100) {
				hiSpeed = 100;
			}
			else if (hiSpeed <= 2000) {
				hiSpeed -= 100;
			}
			else if (hiSpeed <= 4000) {
				hiSpeed -= 200;
			}
			else if (hiSpeed <= 10000) {
				hiSpeed -= 500;
			}
			else {
				hiSpeed -= 1000;
			}
		}
		else if (kble(69)) { // E
			if (hiSpeed < 2000) {
				hiSpeed += 100;
			}
			else if (hiSpeed < 4000) {
				hiSpeed += 200;
			}
			else if (hiSpeed < 10000) {
				hiSpeed += 500;
			}
			else {
				hiSpeed += 1000;
			}
		}		
		if (kble(83)) { // S
			if (audioRate <= 0.2) {
				audiorate = 0.2;
				// audioRate = 0.1;
			}
			else if (audioRate <= 2) {
				audioRate -= 0.1;
			}
			else if (audioRate <= 4) {
				audioRate -= 0.2;
			}
			else if (audioRate <= 10) {
				audioRate -= 0.5;
			}
			else {
				audioRate -= 1;
			}
		}	
		else if (kble(87)) { // W
			if (audioRate < 2) {
				audioRate += 0.1;
			}
			else if (audioRate < 4) {
				audioRate += 0.2;
			}
			else if (audioRate < 10) {
				audioRate += 0.5;
			}
			else {
				audioRate += 1;
			}

			if (audioRate >= 15) {
				audioRate = 15;
			}
		}

		//TLC
		if (kble(72)) { // H
			hOn = !hOn;
		}

		if (kble(71)) { // G
			isBleedBarGraphicOn = !isBleedBarGraphicOn;
		}

		if (kble(78)) { // N
			noteTypeCounterShown = !noteTypeCounterShown;
		}
		
		if (musicCtrl && CMap) {	    	
			if (kble(77)) { // M
				resetAnime();
	       		setTime(markSecion*spu - offset*spu);
			}
			if (kble(82)) { // R
	    		if (keysDown[16]) {
	    			magnaticStrength = 32;
	    			hiSpeed = 1000;
	    			audioRate = 1;
	    		}
				barTargetL = windowHeight/2;
				barTargetR = windowHeight/2;
	       		setTime(0);
	       		resetCS();
	       		clearHit(true);
	       		resetAnime();
			}
			if (kble(13)) { // Enter
				barTargetL = windowHeight/2;
				barTargetR = windowHeight/2;
	       		setTime(0);
	       		resetCS();
	       		clearHit(true);
	       		resetAnime();
				lr = -40;
				ud = -50; 
				pauseShadowH = -180;
				noteTemp = [];
				mainMouse.condition = 0;
				mainMouse.movement = "choose";
	       		showStart = 60;
			}
			
	    	if (kble(65)) { // A
	    		if (keysDown[16]) {
	       			setTime(musicCtrl.currentTime - 0.01);
	    		} 
	    		else {
	       			setTime(musicCtrl.currentTime - 1);
	    		}
	       		resetAnime();
			}
	    	else if (kble(68)) { // D
	    		if (keysDown[16]) {
	       			setTime(musicCtrl.currentTime + 0.01);
	    		}
	    		else {
	       			setTime(musicCtrl.currentTime + 1);
	    		}
	       		resetAnime();
			}
	    	
	    if (kble(67)) { // C
    		if (magnaticStrength > 1) {
	    		if (keysDown[16]) {
	       			magnaticStrength -= 1;
	    		}
	    		else if (magnaticStrength <= 8) {
       				magnaticStrength /= 2;
       			}
    			else switch (magnaticStrength) {
    					case 12:
    						magnaticStrength = 8;
    						break;
    					case 16:
    						magnaticStrength = 12;
    						break;
    					case 24:
    						magnaticStrength = 16;
    						break;
    					case 32:
    						magnaticStrength = 24;
    						break;
    					case 48:
    						magnaticStrength = 32;
    						break;
    					case 64:
    						magnaticStrength = 48;
    						break;
    			
    					default:
    						if (magnaticStrength % 32 == 0) {
    							magnaticStrength -= 32;
    						}
    						else {
    							magnaticStrength = Math.max(1, Math.floor(magnaticStrength/32)*32);
    						}
    						break;
    				}
       		}
		}
    	else if (kble(86)) { // V
	    		if (keysDown[16]) {
	       			magnaticStrength += 1;
	    		}
	    		else if (magnaticStrength <= 4) {
       				magnaticStrength *= 2;
       			}
    			else switch (magnaticStrength) {
    					case 8:
    						magnaticStrength = 12;
    						break;
    					case 12:
    						magnaticStrength = 16;
    						break;
    					case 16:
    						magnaticStrength = 24;
    						break;
    					case 24:
    						magnaticStrength = 32;
    						break;
    					case 32:
    						magnaticStrength = 48;
    						break;
    					case 48:
    						magnaticStrength = 64;
    						break;
    			
    					default:
    						if (magnaticStrength % 32 == 0) {
    							magnaticStrength += 32;
    						}
    						else {
    							magnaticStrength = Math.max(1, Math.ceil(magnaticStrength/32)*32);
    						}
    						break;
    			}
		}
    	
    	if (kble(32)) { // space
    		if (musicCtrl.paused) {
    			musicCtrl.goplay();
    		}
    		else {
    			musicCtrl.pause();
    		}
		}	
	    	
		}

		if (CMap) {
	    	if (kble(79)) { // O
	       		offset = Math.round((offset - 0.001)*1000)/1000;
			}
	    	else if (kble(80)) { // P
	       		offset = Math.round((offset + 0.001)*1000)/1000;
			}
		}
    	

		
		if (kble(13) || kble(108)) { // 回车
//			scene = false;
		}
	}
}