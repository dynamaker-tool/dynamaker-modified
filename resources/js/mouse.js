var coverPos1 = 0;
var coverTime1 = 0;
var coverWidth1 = 1;
var coverPos2 = 0;
var coverTime2 = 0;
var coverWidth2 = 1;
var preCoverWidth = 1;
var magnaticStrength = 32;
var movingId = false;
var movingSide = 0;
var movingJump = false;
var rx, ry = 0;

function getPTnow(index) {
	switch (editSide) {
		case 0:
			if (index == 1) {
				coverPos1 = xtom(mainMouse.coordinate.x, 0);
				coverTime1 = SetBar((jb(windowHeight - mainMouse.coordinate.y, ud, windowHeight) - ud)/hiSpeed + thisTime);
			}
			else {
				coverPos2 = xtom(mainMouse.coordinate.x, 0);
				coverTime2 = SetBar((jb(windowHeight - mainMouse.coordinate.y, ud, windowHeight) - ud)/hiSpeed + thisTime);
			}
			break;
		case 1:
			if (index == 1) {
				coverPos1 = xtom(mainMouse.coordinate.y, 1);
				coverTime1 = SetBar((jb(mainMouse.coordinate.x, lr, windowWidth/2) - lr)/hiSpeed + thisTime);
			}
			else {
				coverPos2 = xtom(mainMouse.coordinate.y, 1);
				coverTime2 = SetBar((jb(mainMouse.coordinate.x, lr, windowWidth/2) - lr)/hiSpeed + thisTime);
			}
			break;
		
		case 2:
			if (index == 1) {
				coverPos1 = xtom(mainMouse.coordinate.y, 2);
				coverTime1 = SetBar((jb(windowWidth - mainMouse.coordinate.x, lr, windowWidth/2) - lr)/hiSpeed + thisTime);
			}
			else {
				coverPos2 = xtom(mainMouse.coordinate.y, 2);
				coverTime2 = SetBar((jb(windowWidth - mainMouse.coordinate.x, lr, windowWidth/2) - lr)/hiSpeed + thisTime);
			}
			break;
		case 3:
			if (index == 1) {
				coverPos1 = xtom(mainMouse.coordinate.x, 0);
				coverTime1 = SetBar((jb(windowHeight - mainMouse.coordinate.y, ud, windowHeight) - ud)/hiSpeed + thisTime);
			}
			else {
				coverPos2 = xtom(mainMouse.coordinate.x, 0);
				coverTime2 = SetBar((jb(windowHeight - mainMouse.coordinate.y, ud, windowHeight) - ud)/hiSpeed + thisTime);
			}
			break;
	}
}

function mouse(canvas) {
	this.c = canvas;
	this.pressed = false;
	this.condition = 0; //
	/*				0		1	1		2	2		3
	 * NORMAL/CHAIN	(move) down (move) up
	 * HOLD-SUB		(move) down (move) up (move) down
	 * lock height when move&&(1&&NORMAL/CHAIN ||  
	 */
	this.coordinate = {x:0, y:0};
	this.movement = "writeNormal";
	this.menu = false;
	canvas.ondblclick = function(e) {
		if (mainMouse.movement == "choose") {
			if (movingId !== false) {
				switch (editSide) {
					case 0:
						noteTemp[0] = $.extend(true, {}, noteDown[movingId]);
						coverTime1 = noteTemp[0].m_time;
						coverPos1 = noteTemp[0].m_position;
						coverWidth1 = noteTemp[0].m_width;
						preCoverWidth = coverWidth1;
						switch (noteDown[movingId].m_type) {
							case "HOLD":
								mainMouse.movement = "writeHold";
								mainMouse.condition = 3;
								noteTemp[0].m_subId = 1;
								noteTemp[1] = $.extend(true, {}, noteDown[noteDown[movingId].m_subId]);
								coverTime2 = noteTemp[1].m_time;
								delNoteById(noteDown[movingId].m_subId, editSide);
								break;
							
							case "CHAIN":
								mainMouse.movement = "writeChain";
								mainMouse.condition = 3;
								break;
							
							case "NORMAL":
								mainMouse.movement = "writeNormal";
								mainMouse.condition = 3;
								break;
								
						}
						break;
					case 1:
						noteTemp[0] = $.extend(true, {}, noteLeft[movingId]);
						coverTime1 = noteTemp[0].m_time;
						coverPos1 = noteTemp[0].m_position;
						coverWidth1 = noteTemp[0].m_width;
						preCoverWidth = coverWidth1;
						switch (noteLeft[movingId].m_type) {
							case "HOLD":
								mainMouse.movement = "writeHold";
								mainMouse.condition = 3;
								noteTemp[0].m_subId = 1;
								noteTemp[1] = $.extend(true, {}, noteLeft[noteLeft[movingId].m_subId]);
								coverTime2 = noteTemp[1].m_time;
								delNoteById(noteLeft[movingId].m_subId, editSide);
								break;
							
							case "CHAIN":
								mainMouse.movement = "writeChain";
								mainMouse.condition = 3;
								break;
							
							case "NORMAL":
								mainMouse.movement = "writeNormal";
								mainMouse.condition = 3;
								break;
								
						}
						break;
					case 2:
						noteTemp[0] = $.extend(true, {}, noteRight[movingId]);
						coverTime1 = noteTemp[0].m_time;
						coverPos1 = noteTemp[0].m_position;
						coverWidth1 = noteTemp[0].m_width;
						preCoverWidth = coverWidth1;
						switch (noteRight[movingId].m_type) {
							case "HOLD":
								mainMouse.movement = "writeHold";
								mainMouse.condition = 3;
								noteTemp[0].m_subId = 1;
								noteTemp[1] = $.extend(true, {}, noteRight[noteRight[movingId].m_subId]);
								coverTime2 = noteTemp[1].m_time;
								delNoteById(noteRight[movingId].m_subId, editSide);
								break;
							
							case "CHAIN":
								mainMouse.movement = "writeChain";
								mainMouse.condition = 3;
								break;
							
							case "NORMAL":
								mainMouse.movement = "writeNormal";
								mainMouse.condition = 3;
								break;
								
						}
						break;
				}
				delNoteById(movingId, editSide);
				movingId = false;
				movingJump = true;
			}
		}
		else {
			movingJump = false;
		}
	}
	
	canvas.onmousedown = function(e) {
		mainMouse.coordinate = getPointOnCanvas(canvas, e.pageX, e.pageY);
		mainMouse.pressed = true;
		if (scene) {
			scene.down(mainMouse.coordinate);
			return;
		}
		mainMouse.coordinate = getPointOnCanvas(canvas, e.pageX, e.pageY);
		if (between(mainMouse.coordinate.y, 0, 18)) {
			setTime(mainMouse.coordinate.x / 1920 * doration);
			return;
		}
		switch (e.button) {
			case 0://leftClick
				if (mainMouse.menu == "basic") {
					if (between(mainMouse.coordinate.x, rx, rx + 400)) {
						for (var i = 0; i < basicMenu.length; ++i) {
							if (between(mainMouse.coordinate.y, ry + basicMenu[i][1], ry + basicMenu[i][1] + basicMenu[i][2])) {
								if(editSide==3)//if BPMOption
								{
									switch(i)
									{
										case 1:
										{
											resetEdit();
											mainMouse.condition = 0;
											mainMouse.movement = "writeBPM";
											break;	
										}
										case 2:
										{
											savefixbpm(); //TLC rm functionality
											break;
										}
									}
								}
								else
								{
									switch (i) 
									{
										
										case 0: // Edit
										{
											break;
										}
										case 1: // NORMAL
										{
											
											if ((editSide == 1 && CMap.m_leftRegion == "MIXER") || (editSide == 2 && CMap.m_rightRegion == "MIXER")) return;
											resetEdit();
											mainMouse.condition = 0;
											mainMouse.movement = "writeNormal";
											break;
										}
										case 2: // CHAIN
											{
											if ((editSide == 1 && CMap.m_leftRegion == "PAD") || (editSide == 2 && CMap.m_rightRegion == "PAD")) return;
											resetEdit();
											mainMouse.condition = 0;
											mainMouse.movement = "writeChain";
											break;
										}
										case 3: // HOLD
										{
											if ((editSide == 1 && CMap.m_leftRegion == "MIXER") || (editSide == 2 && CMap.m_rightRegion == "MIXER")) return;
											resetEdit();
											mainMouse.condition = 0;
											mainMouse.movement = "writeHold";
											break;
										}
									}
								}
								switch (i) 
								{
									case 4: {// revise
										resetEdit();
										mainMouse.condition = 0;
										mainMouse.movement = "choose";
										break;
									}
									case 5: {// Play/Pause
										if (musicCtrl) {
											if (musicCtrl.paused) {
												musicCtrl.goplay();
											}
											else {
												musicCtrl.pause();
											}
											resetAnime();
										}
									}
									case 6: { // Mark
										markSecion = Number((thisTime/spq/32)).toFixed(3);
										break;
									}
									case 7: { // Start with Mark
//										thisTime = musicCtrl.currentTime + offset;
//										markSecion*spu = thisTime;
										resetAnime();
										setTime(SetBar(markSecion) - offset*spu);
										break;
									}
									case 8: {// Replay
										if (musicCtrl) {
											barTargetL = windowHeight/2;
											barTargetR = windowHeight/2;
											setTime(0);
											resetCS();
											resetAnime();
											resetEdit();
										}
										break;
									}
									case 9: {// Save
										save();
										break;
									}
									case 10: {// Save as .dy
										saveAsDynaMaker();
										break;
									}
									case 11: {// Background
										backgroundFileElement.focus();
										backgroundFileElement.click();
										break;
									}
									case 12: {// Mixer Height
										restrictMixerHeight = !restrictMixerHeight;
										break;
									}
									case 13: {// Particles
										showParticles = !showParticles;
										break;
									}
									case 14: {// Hitsound Volume and Toggle
										showHitSound = !showHitSound;
										break;
									}
									case 15: {// Music volume
										break;
									}
								}
							}
						}
					}
					mainMouse.menu = false;
					break;
				}
				else if (mainMouse.menu == "delete") {
					if (between(mainMouse.coordinate.x, rx, rx + 400)) {
						for (var i = 0; i < basicMenu.length; ++i) {
							if (between(mainMouse.coordinate.y, ry + basicMenu[i][1], ry + basicMenu[i][1] + basicMenu[i][2])) {
								switch (i) {
									case 0: {// Delete
										noteChosenList.sort(function (x ,y) {
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
										noteChosen = [];
										noteChosenList = [];
										mainMouse.condition = 0;
										break;
									}
								}
							}
						}
					}
					mainMouse.menu = false;
					break;
				}
				else if (mainMouse.movement == "writeNormal" || mainMouse.movement == "writeChain") {
					switch (mainMouse.condition) {
						case 0:
							mainMouse.condition = 1;
							break;
						case 3:
							mainMouse.condition = 0;
							switch (editSide){
								case 0:
									for (var id = 0; noteDown[id]; ++id);
									break;
								case 1:
									for (var id = 0; noteLeft[id]; ++id);
									break;
								case 2:
									for (var id = 0; noteRight[id]; ++id);
									break;
							}
							addNoteById(id, editSide, {
					        	"m_id": "unJoined",
					        	"m_type": (mainMouse.movement == "writeNormal" ? "NORMAL" : "CHAIN"),
					        	"m_time": coverTime1,
					        	"m_position": coverPos1,
					        	"m_width": coverWidth1,
					        	"m_subId": "-1"
			    			});
			    			noteTemp = [];
							preCoverWidth = coverWidth1;
							break;
						default:
							break;
							
					}
				}
				else if (mainMouse.movement == "writeHold") {
					switch (mainMouse.condition) {
						case 0:
							mainMouse.condition = 1;
							break;
						
						case 2:
						case 3:
							mainMouse.condition = 0;
							switch (editSide){
								case 0:
									for (var id = 0; noteDown[id]; ++id);
									for (var id2 = id + 1; noteDown[id2]; ++id2);
									break;
								case 1:
									for (var id = 0; noteLeft[id]; ++id);
									for (var id2 = id + 1; noteLeft[id2]; ++id2);
									break;
								case 2:
									for (var id = 0; noteRight[id]; ++id);
									for (var id2 = id + 1; noteRight[id2]; ++id2);
									break;
							}
							addNoteById(id, editSide, {
					        	"m_id": id,
					        	"m_type": "HOLD",
					        	"m_time": coverTime1,
					        	"m_position": coverPos1,
					        	"m_width": coverWidth1,
					        	"m_subId": id2
			    			});
			    			addNoteById(id2, editSide, {
					        	"m_id": id2,
					        	"m_type": "SUB",
					        	"m_time": coverTime2,
					        	"m_position": coverPos1,
					        	"m_width": coverWidth1,
					        	"m_subId": -1
					        });
			    			noteTemp = [];
							preCoverWidth = coverWidth1;
		
						default:
							break;
					}
				}
				else if(mainMouse.movement == "writeBPM")
				{
					mainMouse.condition = 0;
					bpmPopup();
				}
				else if (mainMouse.movement == "choose") {
					if (mainMouse.menu) return;
					switch (mainMouse.condition) {
						case 0:
							mainMouse.condition = 1;
							break;
						
						case 2:
							getPTnow(1);
							coverPos2 = coverPos1;
							coverTime2 = coverTime1;
							mainMouse.condition = 1;
							break;
		
						default:
							break;
					}
				}
				if (movingJump) {
					mainMouse.condition = 0;
					mainMouse.movement = "choose";
					noteTemp = [];
					movingId = false;
					movingJump = false;
				}
				break;
			
			case 1://wheelClick
			
			case 2://rightClick
				if (mainMouse.menu == false) {
					var nowPos, nowTime;
					switch (editSide) {
						case 0:
							nowPos = xtom(mainMouse.coordinate.x, 0);
							nowTime = SetBar((windowHeight - ud - Math.min(windowHeight - ud, mainMouse.coordinate.y))/hiSpeed + thisTime);
							break;
						
						case 1:
							nowPos = xtom(mainMouse.coordinate.y, 1);
							nowTime = SetBar((Math.max(lr, mainMouse.coordinate.x) - lr)/hiSpeed + thisTime);
							break;
						
						case 2:
							nowPos = xtom(mainMouse.coordinate.y, 2);
							nowTime = SetBar((jb(windowWidth - mainMouse.coordinate.x - lr, windowWidth/2 - lr, 0))/hiSpeed + thisTime);
							break;
							
						case 3:
							nowPos = xtom(mainMouse.coordinate.x, 0);
							nowTime = SetBar((windowHeight - ud - Math.min(windowHeight - ud, mainMouse.coordinate.y))/hiSpeed + thisTime);
							break;
					}
					switch (mainMouse.movement) {
						case "choose":
							if (between(nowPos, coverPos1, coverPos2) && between(nowTime, coverTime1, coverTime2) && coverPos1 != coverPos2 && coverTime1 != coverTime2) {
								rx = Math.min(mainMouse.coordinate.x, windowWidth - 400);
								ry = jb(0, mainMouse.coordinate.y, windowHeight - 50);
								mainMouse.menu = "delete";
							}
							else {
								rx = Math.min(mainMouse.coordinate.x, windowWidth - 400);
								ry = jb(0, mainMouse.coordinate.y - 75, windowHeight - 650);
								mainMouse.menu = "basic";
							}
							break;
						
						case "writeBPM":
						case "writeNormal":
						case "writeChain":
						case "writeHold":
							if (mainMouse.condition == 1) {
								preCoverWidth = coverWidth1;
								noteTemp = [];
								noteChosen = [];
								noteChosenList = [];
								mainMouse.condition = 0;
							}
							else {
								rx = Math.min(mainMouse.coordinate.x, windowWidth - 400);
								ry = jb(100, mainMouse.coordinate.y - 75, windowHeight - 650);
								mainMouse.menu = "basic";	
							}
							break;
							
						default:
							break;
					}
				}
				else {
					mainMouse.menu = false;
				}
				break;
				
			default:
				break;
		}

	}

	canvas.onmouseup = function(e){
		mainMouse.coordinate = getPointOnCanvas(canvas, e.pageX, e.pageY);
		mainMouse.pressed = false;
		if (scene) {
			scene.up(mainMouse.coordinate);
			return;
		}
		if (mainMouse.movement == "writeNormal" || mainMouse.movement == "writeChain") {
			switch (mainMouse.condition) {
				case 1:
					mainMouse.condition = 0;
					switch (editSide){
						case 0:
							for (var id = 0; noteDown[id]; ++id);
							break;
						case 1:
							for (var id = 0; noteLeft[id]; ++id);
							break;
						case 2:
							for (var id = 0; noteRight[id]; ++id);
							break;
					}
					addNoteById(id, editSide, {
			        	"m_id": "unJoined",
			        	"m_type": (mainMouse.movement == "writeNormal" ? "NORMAL" : "CHAIN"),
			        	"m_time": coverTime1,
			        	"m_position": coverPos1,
			        	"m_width": coverWidth1,
			        	"m_subId": "-1"
	    			});
	    			noteTemp = [];
					preCoverWidth = coverWidth1;
					break;

				default:
					break;
					
			}
			
		}
		else if (mainMouse.movement == "writeHold") {
			switch (mainMouse.condition) {
				case 1:
					mainMouse.condition = 2;
					break;

				default:
					break;
					
			}
		}
		else if (mainMouse.movement == "choose") {
			if (mainMouse.menu) return;
			switch (mainMouse.condition) {
				case 1:
					mainMouse.condition = 2;
					break;

				default:
					break;
					
			}
		}
	}
	
	canvas.onmousemove = function(e){
		mainMouse.coordinate = getPointOnCanvas(canvas, e.pageX, e.pageY);
		if (mainMouse.movement == "choose" && mainMouse.condition == 0) {
			var dis = 9999999999;
			var thisTime = musicCtrl.currentTime + offset*spu;
			switch (editSide) {
				case 0:
					for (var i = 0; i < noteDown.length; ++i) {
						if (noteDown[i] && noteDown[i].m_type != "SUB") {
							var abx = mainMouse.coordinate.x - mtox(noteDown[i].m_position, 0);
							var aby = mainMouse.coordinate.y - (windowHeight - hiSpeed*(GetBar(noteDown[i].m_time) - thisTime) - ud);
							if (movingId === false || (movingId !== false && dis > abx * abx + aby * aby)) {
								movingId = i;
								dis = abx * abx + aby * aby;
							}
						}
					}
					break;
				case 1:
					for (var i = 0; i < noteLeft.length; ++i) {
						if (noteLeft[i] && noteLeft[i].m_type != "SUB") {
							var abx = mainMouse.coordinate.x - (hiSpeed*(GetBar(noteLeft[i].m_time) - thisTime) + lr);
							var aby = mainMouse.coordinate.y - mtox(noteLeft[i].m_position, 1);
							if (movingId === false || (movingId !== false && dis > abx * abx + aby * aby)) {
								movingId = i;
								dis = abx * abx + aby * aby;
							}
						}
						
					}
					break;
				case 2:
					for (var i = 0; i < noteRight.length; ++i) {
						if (noteRight[i] && noteRight[i].m_type != "SUB") {
							var abx = mainMouse.coordinate.x - (windowWidth - hiSpeed*(GetBar(noteRight[i].m_time) - thisTime) - lr);
							var aby = mainMouse.coordinate.y - mtox(noteRight[i].m_position, 2);
							if (movingId === false || (movingId !== false && dis > abx * abx + aby * aby)) {
								movingId = i;
								dis = abx * abx + aby * aby;
							}
						}
						
					}
					break;
			}
			movingSide = editSide;
		}
		if (scene) {
			scene.move(mainMouse.coordinate);
			return;
		}
		
	}
}

mouse.prototype = {
	refresh:function() {
		if (!thisTime) return;
		if(mainMouse.movement == "writeBPM")
		{
			getPTnow(1);
			if (! keysDown[88]) { //X
				coverPos1 = Math.round(coverPos1*10)/10;
		    }
		    else {
				coverPos1 = Math.round(coverPos1*100)/100;
		    }
		    if (! keysDown[90]) //Z
			{
				coverTime1 = Math.round(coverTime1*magnaticStrength)/(magnaticStrength);
		    }
    		coverTime1 = Math.round(coverTime1*1000000)/1000000;
					
			noteTemp[0] = {
	        	"m_id": 0,
	        	"m_position": coverPos1,
	        	"m_subId": -1,
	        	"m_time": coverTime1,
	        	"m_type": "NORMAL",
	        	"m_width": 1
	    	};
		}
		if (mainMouse.movement == "writeNormal" || mainMouse.movement == "writeChain") {
			switch (mainMouse.condition) {
				case 0:
					getPTnow(1);
		    		if (! keysDown[88]) { //X
						coverPos1 = Math.round(coverPos1*10)/10;
		    		}
		    		else {
						coverPos1 = Math.round(coverPos1*100)/100;
		    		}
		    		if (! keysDown[90]) { //Z
						coverTime1 = Math.round(coverTime1*magnaticStrength)/(magnaticStrength);
		    		}
    				coverTime1 = Math.round(coverTime1*1000000)/1000000;
					break;
					
				case 1:
					var addWidth = xtom(editSide == 0 ? mainMouse.coordinate.x : mainMouse.coordinate.y, editSide) - coverPos1;
					coverWidth1 = Math.max(mainMouse.movement == "writeNormal" ? 0.1 : 0.1, Math.round((preCoverWidth + Math.abs(addWidth)*addWidth)*20)/20);
					break;
					
				case 3:
					getPTnow(1);
		    		if (! keysDown[88]) { //X
						coverPos1 = Math.round(coverPos1*10)/10;
		    		}
		    		else {
						coverPos1 = Math.round(coverPos1*100)/100;
		    		}
		    		if (! keysDown[90]) { //Z
						coverTime1 = Math.round(coverTime1*magnaticStrength)/(magnaticStrength);
		    		}
    				coverTime1 = Math.round(coverTime1*1000000)/1000000;
					break;

				default:
					break;
			}
      		noteTemp[0] = {
	        	"m_id": 0,
	        	"m_position": coverPos1,
	        	"m_subId": -1,
	        	"m_time": coverTime1,
	        	"m_type": (mainMouse.movement == "writeNormal" ? "NORMAL" : "CHAIN"),
	        	"m_width": coverWidth1
	    	};
		}
		else if (mainMouse.movement == "writeHold") {
			switch (mainMouse.condition) {
				case 0:
					getPTnow(1);
		    		if (! keysDown[88]) { //X
						coverPos1 = Math.round(coverPos1*10)/10;
		    		}
		    		else {
						coverPos1 = Math.round(coverPos1*100)/100;
		    		}
		    		if (! keysDown[90]) { //Z
						coverTime1 = Math.round(coverTime1*magnaticStrength)/(magnaticStrength);
		    		}
    				coverTime1 = Math.round(coverTime1*1000000)/1000000;
					coverTime2 = coverTime1;
		      		noteTemp[0] = {
			        	"m_id": 0,
			        	"m_position": coverPos1,
			        	"m_subId": 1,
			        	"m_time": coverTime1,
			        	"m_type": "HOLD",
			        	"m_width": preCoverWidth
			    	};
		      		noteTemp[1] = {
			        	"m_id": 1,
			        	"m_position": coverPos1,
			        	"m_subId": -1,
			        	"m_time": coverTime2,
			        	"m_type": "SUB",
			        	"m_width": preCoverWidth
			    	};
					break;
					
				case 1:
					var addWidth = xtom(editSide == 0 ? mainMouse.coordinate.x : mainMouse.coordinate.y, editSide) - coverPos1;
					coverWidth1 = Math.max(Math.round((preCoverWidth + Math.abs(addWidth)*addWidth)*20)/20, 0.1);
		      		noteTemp[0] = {
			        	"m_id": 1,
			        	"m_position": coverPos1,
			        	"m_subId": -1,
			        	"m_time": coverTime1,
			        	"m_type": "HOLD",
			        	"m_width": coverWidth1
			    	};
		      		noteTemp[1] = {
			        	"m_id": 1,
			        	"m_position": coverPos1,
			        	"m_subId": -1,
			        	"m_time": coverTime1,
			        	"m_type": "SUB",
			        	"m_width": coverWidth1
			    	};
					break;
					
				case 2:
					switch (editSide) {
						case 0:
							coverTime2 = SetBar((jb(windowHeight - mainMouse.coordinate.y, ud, windowHeight) - ud)/hiSpeed + thisTime);
							break;
						
						case 1:
							coverTime2 = SetBar((jb(mainMouse.coordinate.x, lr, windowWidth/2) - lr)/hiSpeed + thisTime);
							break;
						
						case 2:
							coverTime2 = SetBar((jb(windowWidth - mainMouse.coordinate.x, lr, windowWidth/2) - lr)/hiSpeed + thisTime);
							break;
					}
		    		if (! keysDown[90]) { //Z
						coverTime2 = Math.round(coverTime2*magnaticStrength)/(magnaticStrength);
		    		}
    				coverTime2 = Math.round(coverTime2*1000000)/1000000;
					coverTime2 = Math.max(coverTime1, coverTime2);
		      		noteTemp[1] = {
			        	"m_id": 1,
			        	"m_position": coverPos1,
			        	"m_subId": -1,
			        	"m_time": coverTime2,
			        	"m_type": "SUB",
			        	"m_width": coverWidth1
			    	};
					
					break;

				case 3:
					var l = coverTime2 - coverTime1;
					getPTnow(1);
		    		if (! keysDown[88]) { //X
						coverPos1 = Math.round(coverPos1*10)/10;
		    		}
		    		else {
						coverPos1 = Math.round(coverPos1*100)/100;
		    		}
		    		if (! keysDown[90]) { //Z
						coverTime1 = Math.round(coverTime1*magnaticStrength)/(magnaticStrength);
		    		}
    				coverTime1 = Math.round(coverTime1*1000000)/1000000;
					coverTime2 = coverTime1 + l;
		      		noteTemp[0] = {
			        	"m_id": 0,
			        	"m_position": coverPos1,
			        	"m_subId": 1,
			        	"m_time": coverTime1,
			        	"m_type": "HOLD",
			        	"m_width": coverWidth1
			    	};
		      		noteTemp[1] = {
			        	"m_id": 1,
			        	"m_position": coverPos1,
			        	"m_subId": -1,
			        	"m_time": coverTime2,
			        	"m_type": "SUB",
			        	"m_width": coverWidth1
			    	};
					break;
					
				default:
					break;
			}
		}
		else if (mainMouse.movement == "choose") {
			switch (mainMouse.condition) {
				case 0: 
					getPTnow(1);
					coverPos2 = coverPos1;
					coverTime2 = coverTime1;
					break;
					
				case 1:
					getPTnow(2);
					//cut half?
					noteChosen = [];
					noteChosenList = [];
					if (keysDown[16]) {
						switch (editSide) {
						case 0:
							for (var i = 0; i < noteDown.length; ++i) {
								if (noteDown[i] && noteDown[i].m_type != "SUB" && (between(noteDown[i].m_position, coverPos1 - noteDown[i].m_width, coverPos1 + noteDown[i].m_width) || between(noteDown[i].m_position, coverPos2 - noteDown[i].m_width, coverPos2 + noteDown[i].m_width)) && between(noteDown[i].m_time, coverTime1, coverTime2)) {
									noteChosen[i] = true;	
									noteChosenList.push(i);
								}
							}
							break;
						
						case 1:
							for (var i = 0; i < noteLeft.length; ++i) {
								if (noteLeft[i] && noteLeft[i].m_type != "SUB" && (between(noteLeft[i].m_position, coverPos1 - noteLeft[i].m_width, coverPos1 + noteLeft[i].m_width) || between(noteLeft[i].m_position, coverPos2 - noteLeft[i].m_width, coverPos2 + noteLeft[i].m_width)) && between(noteLeft[i].m_time, coverTime1, coverTime2)) {
									noteChosen[i] = true;	
									noteChosenList.push(i);
								}
							}
							break;
						
						case 2:
							for (var i = 0; i < noteRight.length; ++i) {
								if (noteRight[i] && noteRight[i].m_type != "SUB" && (between(noteRight[i].m_position, coverPos1 - noteRight[i].m_width, coverPos1 + noteRight[i].m_width) || between(noteRight[i].m_position, coverPos2 - noteRight[i].m_width, coverPos2 + noteRight[i].m_width)) && between(noteRight[i].m_time, coverTime1, coverTime2)) {
									noteChosen[i] = true;	
									noteChosenList.push(i);
								}
							}
							break;
						}
					}
					else switch (editSide) {
						case 0:
							for (var i = 0; i < noteDown.length; ++i) {
								if (noteDown[i] && noteDown[i].m_type != "SUB" && between(noteDown[i].m_position, coverPos1, coverPos2) && between(noteDown[i].m_time, coverTime1, coverTime2)) {
									noteChosen[i] = true;	
									noteChosenList.push(i);
								}
							}
							break;
						
						case 1:
							for (var i = 0; i < noteLeft.length; ++i) {
								if (noteLeft[i] && noteLeft[i].m_type != "SUB" && between(noteLeft[i].m_position, coverPos1, coverPos2) && between(noteLeft[i].m_time, coverTime1, coverTime2)) {
									noteChosen[i] = true;	
									noteChosenList.push(i);
								}
							}
							break;
						
						case 2:
							for (var i = 0; i < noteRight.length; ++i) {
								if (noteRight[i] && noteRight[i].m_type != "SUB" && between(noteRight[i].m_position, coverPos1, coverPos2) && between(noteRight[i].m_time, coverTime1, coverTime2)) {
									noteChosen[i] = true;	
									noteChosenList.push(i);
								}
							}
							break;
					}
					break;
				
				case 2:
					break;
				
				case 3:
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
					noteChosenList = [];
					noteChosen = [];
					mainMouse.condition = 0;
					break;
				
			}
		}
	}
}

//		switch (mainMouse.movement) {
//			case "slide":
//				mainMouse.movement = "empty";
//				musicCtrl.goplay();
//				break;
//		}	
//		switch (mainMouse.movement) {
//			case "slide":
//				var dP = mainMouse.coordinate.y - mainMouse.holding.y;
//				//console.log(dP + ' ' + musicCtrl.currentTime + ' ' + mainMouse.holdTime);
//				if (musicCtrl.paused) {
//					musicCtrl.currentTime = mainMouse.holdTime + dP * (0.001 + 0.080 * (windowWidth - mainMouse.holding.x) / 1000 / hiSpeed * 1000);
//				}
//				break;
//		}
//		switch (mainMouse.movement) {
//			case "empty":
//				mainMouse.holding  = $.extend(true, {}, mainMouse.coordinate);
//				mainMouse.holdTime = musicCtrl.currentTime;
//				mainMouse.movement = "slide";
//				musicCtrl.pause();
//				break;
//
//			case "slide":
//				//musicCtrl.goplay();
//				break;
//		}
		//console.log(this.coordinate);
	//			var thisNote = noteDown[i];
	//			var touchTime = thisNote.m_time*(spu);
	//			var dis = hiSpeed*(touchTime - thisTime);
	//			switch (thisNote.m_type) {
	//				case "NORMAL":
	//					if (dis >= 0 && dis <= windowHeight + 5 - ud) {
	//						var x = thisNote.m_position*300 + 210;
	//						var width = thisNote.m_width*270;
	//						drawSingleNote(ctx, 0, width, x, dis);
	//						if (! noteDownHit[thisNote.m_id] && ((autoMode && touchTime < thisTime) || Math.abs(touchTime - thisTime) <= currentPerfectJudge)) {
	//							noteDownHit[thisNote.m_id] = true;
	//							hitAnime(0, 0, width, x, Math.floor(10.0/audioRate));
	//						}
	//					}
	//					break;