var totalState = 0;
var onloadRun = false;
//var bdReader = [];	//TLC .dy removed variables because not needed anymore
//var bdReaderOnloaded = 0;
var notes = [];
var loadOffset = 0;
var addOffset = 0;
var loadSide = 0;
var type = "";
var saveDiv = 1;
var saveType;
var savePos = 0;
var saveWidth = 0;
var saveInt;
var dy;
var remix;
var hardshipMap = {"C":["CASUAL", "#8F8"],
					"N":["NORMAL", "#88F"],
					"H":["HARD", "#F44"],
					"M":["MEGA", "#F4F"],
					"G":["GIGA", "#888"],
					"T":["TERA", "#333"],
					"B":["BASIC", "#8F8"],
					"D":["HORNEEE", "#FF4"],
					"U":["CUSTOM", "#FFF"]};

//TLC .dy - added function to separate contents in .dy file
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

//TLC .dy - Added Function to load img from the dy file
function extraImgLoad(img, callback) {
	var timer = setInterval(function() {
		if (img && img.complete) {
			clearInterval(timer);
			callback(img);
		}
	}, 50);
}


function ana(s) {
	var t = s.split(/,|\//g);
	var add = 1;
	if (t[0] == "") {
		t[0] = saveInt;
	}
	else if (t[0][0] == "-0") {
		add = -1;
	}
	saveInt = Number(t[0]);
	if (t[2]) {
		return add*(saveInt + Number(t[1])/Number(t[2])/saveDiv);
	}
	else {
		return add*(saveInt + Number(t[1])/saveDiv);
	}
}

function loadingScene() {
	//TLC .dy - removed function, shifted below
	// for (var i = 0; i < 4; ++i) {
	// 	bdReader[i] = new FileReader();
	// }
	// audioLoad(musicUrl, function(audio){
	// 	musicCtrl = audio;
	// 	musicCtrl.goplay = function() {
	// 		if (musicCtrl.ended) {
	// 			resetCS();
	// 			noteDownHit = [];
	// 			noteLeftHit = [];
	// 			noteRightHit = [];
	// 		}
	// 		if (showCS) {
	// 			musicPlayButton.focus();
	// 			musicPlayButton.click();
	// 			return;
	// 		}
	// 		if (editMode) {
	// 			clearHit();
	// 		}
	// 		if (musicCtrl) { 
	// 			musicPlayButton.focus();
	// 			musicPlayButton.click();
	// 		}
	// 	}
	//     //$('#music').attr("src", audioUrl);
	// 	loaded++;
	// });
}

loadingScene.prototype = {
	init:function(initLoadType) {
		onloadRun = false;
		this.loadType = initLoadType;
		this.status = 0;
		this.bdReader = [];
		for (var i = 0; i < 4; ++i) {
			this.bdReader[i] = new FileReader();
		}
		this.status = 0;
	},
	up:function() {
	},
	down:function() {
	},
	move:function() {
	},
	refresh:function() {
		ctx.font = "32px Dynamix";
		ctx.fillStyle = "#0FF";
		//ctx.fillText(bdReader.result, windowHeight * 0.5, windowWidth * 0.5);
		totalState = 0;
		for (var i = 0; i < (this.loadType != "X3T" ? 1 : 4); ++i) {
			totalState += this.bdReader[i].readyState;
			if (this.bdReader[i] && this.bdReader[i].readyState == 0) {
				this.bdReader[i].readAsText(mapFileCtrl[i], "utf-8");
			}
		}
		if (! onloadRun){
			if (this.loadType != "X3T" && totalState == 2) {
				switch (mapFileCtrl[0].name.substr(-4, 4).toUpperCase()) {
					case ".XML":
						var xotree = new XML.ObjTree();
					    var dumper = new JKL.Dumper();
					    var xmlText = this.bdReader[0].result;
						var tree = xotree.parseXML(xmlText);
						CMap3 = eval('(' + dumper.dump(tree) + ')');
						CMap = eval('(' + dumper.dump(tree) + ')').CMap;
						break;
					
					case "JSON":
						CMap = eval('(' + this.bdReader[0].result + ')').CMap;
						break;
					default:
						dy = eval('(' + this.bdReader[0].result + ')');
						CMap = dy.CMap;
						remix = dy.remix;
						if (remix.bg) {
							bg = true;
							bgSrc.src = URL.createObjectURL(dataURLtoBlob(remix.bg));
							extraImgLoad(bgSrc, function() {
								bgContext.drawImage(bgSrc, 0, 0, bgSrc.width, bgSrc.height, 0, 0, windowWidth, windowHeight);
							});
						}
						musicUrl = URL.createObjectURL(dataURLtoBlob(remix.music));
						break;
				}
				//TLC .dy Shifted audioLoad function here
				audioLoad(musicUrl, function(audio){
					musicCtrl = audio;
					musicCtrl.goplay = function() {
						if (musicCtrl.ended) {
							resetCS();
							noteDownHit = [];
							noteLeftHit = [];
							noteRightHit = [];
						}
						if (showCS) {
							musicPlayButton.focus();
							musicPlayButton.click();
							return;
						}
						if (editMode) {
							clearHit();
						}
						if (musicCtrl) { 
							musicPlayButton.focus();
							musicPlayButton.click();
						}
					}
					musicCtrl.id = "music";
					musicCtrl.addEventListener('error', function(mediaError) {
						debugSettings.log.push({name: mediaError.message});
					});
					loaded++;
				});

				if (!CMap) {
					CMap = {}
					noteArray = {}
					Chart = CMap3.DynamixMap
					CMap.m_path = Chart['-MapID']
					CMap.m_mapID = Chart['-MapID'].substr(5, Chart['-MapID'].length - 5)
					CMap.m_path = CMap.m_mapID.substr(0, CMap.m_mapID.length - 2)
					hardship = hardshipMap[Chart['-MapID'].substr(-1, 1)][0];
					hardshipColor = hardshipMap[Chart['-MapID'].substr(-1, 1)][1];
					typeL = Chart.Left['-Type'];
					typeR = Chart.Right['-Type'];
					CMap.m_leftRegion = typeL;
					CMap.m_rightRegion = typeR;
					bpm = Number(Chart['-BarPerMinute']);
					spu = 60 / bpm;
					spq = spu / 32;
					offset = Number(Chart['-TimeOffset']);
					// offsetSec = offsetBar/(barpm/60) + userOffsetSec;
					let S = [{
						xmlTag: 'Center',
						initTag: 'Down'
					},{
						xmlTag: 'Left',
						initTag: 'Left'
					},{
						xmlTag: 'Right',
						initTag: 'Right'
					}]
					let R = {
						'm_id': '-Index',
						'm_subId': '-SubIndex',
						'm_position': '-Position',
						'm_width': '-Size',
						'm_time': '-Time',
						'm_type': '-Type'
					}
					for (let k = 0; k < 3; ++k) {
						s = S[k]
						noteArray[s.initTag] = [];
						if (isEmptyObject(Chart[s.xmlTag].Note)) {
							noteArray[s.initTag] = [];
						}
						else if (isNaN(Chart[s.xmlTag].Note.length)) {
							var id = Chart[s.xmlTag][R.m_id]
							noteArray[s.initTag][id] = {}
							noteArray[s.initTag][id].m_id = id;
							noteArray[s.initTag][id].m_type = Chart[s.xmlTag].Note[R.m_type];
							noteArray[s.initTag][id].m_subId = Chart[s.xmlTag].Note[R.m_subId];
							noteArray[s.initTag][id].m_width = Chart[s.xmlTag].Note[R.m_width];
							noteArray[s.initTag][id].m_time = Chart[s.xmlTag].Note[R.m_time];
							noteArray[s.initTag][id].m_position = Chart[s.xmlTag].Note[R.m_position];
							noteArray[s.initTag][id].m_position = Number(noteArray[s.initTag][id].m_position) + noteArray[s.initTag][id].m_width/2;
							totalNote++;
						}
						else
							for (var i = 0; i < Chart[s.xmlTag].Note.length; ++i)
								if (Chart[s.xmlTag].Note[i]) {
									var id = Chart[s.xmlTag].Note[i][R.m_id]
									noteArray[s.initTag][id] = {}
									console.log(Chart[s.xmlTag].Note[i])
									totalNote++;
									noteArray[s.initTag][id].m_id = id;
									noteArray[s.initTag][id].m_type = Chart[s.xmlTag].Note[i][R.m_type];
									noteArray[s.initTag][id].m_subId = Chart[s.xmlTag].Note[i][R.m_subId];
									noteArray[s.initTag][id].m_width = Chart[s.xmlTag].Note[i][R.m_width];
									noteArray[s.initTag][id].m_time = Chart[s.xmlTag].Note[i][R.m_time];
									noteArray[s.initTag][id].m_position = Chart[s.xmlTag].Note[i][R.m_position];
									noteArray[s.initTag][id].m_position = Number(noteArray[s.initTag][id].m_position) + noteArray[s.initTag][id].m_width/2;
								}
					}
					noteDown = $.extend(true, [], noteArray.Down);
					noteLeft = $.extend(true, [], noteArray.Left);
					noteRight = $.extend(true, [], noteArray.Right);
				} else {


					hardship = hardshipMap[CMap.m_mapID.substr(-1, 1)][0];
					hardshipColor = hardshipMap[CMap.m_mapID.substr(-1, 1)][1];

					typeL = CMap.m_leftRegion;
					typeR = CMap.m_rightRegion;
					bpm = CMap.m_barPerMin;
					spu = 60 / CMap.m_barPerMin;
					spq = spu / 32;
					offset = Number(CMap.m_timeOffset);
					totalNote = 0;
					noteDown = [];
					if (isEmptyObject(CMap.m_notes.m_notes)) {
						noteDown = [];
					} else if (isNaN(CMap.m_notes.m_notes.CMapNoteAsset.length)) {
						noteDown[CMap.m_notes.m_notes.CMapNoteAsset.m_id] = $.extend(true, {}, CMap.m_notes.m_notes.CMapNoteAsset);
						totalNote++;
					} else
						for (var i = 0; i < CMap.m_notes.m_notes.CMapNoteAsset.length; ++i)
							if (CMap.m_notes.m_notes.CMapNoteAsset[i]) {
								totalNote++;
								noteDown[CMap.m_notes.m_notes.CMapNoteAsset[i].m_id] = ($.extend(true, {}, CMap.m_notes.m_notes.CMapNoteAsset[i]));
								noteDown[CMap.m_notes.m_notes.CMapNoteAsset[i].m_id].m_position = Number(noteDown[CMap.m_notes.m_notes.CMapNoteAsset[i].m_id].m_position) + noteDown[CMap.m_notes.m_notes.CMapNoteAsset[i].m_id].m_width / 2;
							}
					noteLeft = [];
					if (isEmptyObject(CMap.m_notesLeft.m_notes)) {
						noteLeft = [];
					} else if (isNaN(CMap.m_notesLeft.m_notes.CMapNoteAsset.length)) {
						noteLeft[CMap.m_notesLeft.m_notes.CMapNoteAsset.m_id] = $.extend(true, {}, CMap.m_notesLeft.m_notes.CMapNoteAsset);
						totalNote++;
					} else
						for (var i = 0; i < CMap.m_notesLeft.m_notes.CMapNoteAsset.length; ++i)
							if (CMap.m_notesLeft.m_notes.CMapNoteAsset[i]) {
								totalNote++;
								noteLeft[CMap.m_notesLeft.m_notes.CMapNoteAsset[i].m_id] = ($.extend(true, {}, CMap.m_notesLeft.m_notes.CMapNoteAsset[i]));
								noteLeft[CMap.m_notesLeft.m_notes.CMapNoteAsset[i].m_id].m_position = Number(noteLeft[CMap.m_notesLeft.m_notes.CMapNoteAsset[i].m_id].m_position) + noteLeft[CMap.m_notesLeft.m_notes.CMapNoteAsset[i].m_id].m_width / 2;
							}
					noteRight = [];
					if (isEmptyObject(CMap.m_notesRight.m_notes)) {
						noteRight = [];
					} else if (isNaN(CMap.m_notesRight.m_notes.CMapNoteAsset.length)) {
						noteRight[CMap.m_notesRight.m_notes.CMapNoteAsset.m_id] = $.extend(true, {}, CMap.m_notesRight.m_notes.CMapNoteAsset);
						totalNote++;
					} else
						for (var i = 0; i < CMap.m_notesRight.m_notes.CMapNoteAsset.length; ++i)
							if (CMap.m_notesRight.m_notes.CMapNoteAsset[i]) {
								totalNote++;
								noteRight[CMap.m_notesRight.m_notes.CMapNoteAsset[i].m_id] = ($.extend(true, {}, CMap.m_notesRight.m_notes.CMapNoteAsset[i]));
								noteRight[CMap.m_notesRight.m_notes.CMapNoteAsset[i].m_id].m_position = Number(noteRight[CMap.m_notesRight.m_notes.CMapNoteAsset[i].m_id].m_position) + noteRight[CMap.m_notesRight.m_notes.CMapNoteAsset[i].m_id].m_width / 2;
							}


					bpmlist = [];
					timelist = [];
					if (typeof CMap.m_argument == "undefined") {
						bpmlist = [];
						timelist = [];
						AddFirstBPM();
					} else if (typeof CMap.m_argument.m_bpmchange == "undefined") {
						bpmlist = [];
						timelist = [];
						AddFirstBPM();
					} else if (isEmptyObject(CMap.m_argument.m_bpmchange)) {
						bpmlist = [];
						timelist = [];
						AddFirstBPM();
					} else {
						for (var i = 0; i < CMap.m_argument.m_bpmchange.CBpmchange.length; ++i) {
							if (CMap.m_argument.m_bpmchange.CBpmchange[i]) {
								bpmlist[i] = ($.extend(true, {}, CMap.m_argument.m_bpmchange.CBpmchange[i]));
								timelist[i] = ($.extend(true, {}, CMap.m_argument.m_bpmchange.CBpmchange[i]));
							}
						}
						TimelistReset();
					}

				}

				onloadRun = true;
				loaded++;		
			}
			else if (! xmlJson && totalState == 8) {
				noteDown = [];
				noteLeft = [];
				noteRight = [];
				for (var index = 0; index < 4; ++index) {
					if (mapFileCtrl[index].name.substr(-4, 4).toUpperCase() == ".XML") {
						CMap = {};
						var xotree = new XML.ObjTree();
					    var dumper = new JKL.Dumper();
					    var xmlText = this.bdReader[index].result;
						var tree = xotree.parseXML(xmlText);
						var Info = eval('(' + dumper.dump(tree) + ')').DnxSong;
						CMap.m_path = Info.Name;
						CMap.m_barPerMin = Number(Info.BPM)/4;
						CMap.m_mapID = "_map_" + Info.Name + "_" + Info.Diff[0];
					}
					else {
						for (var i = 1; i <= 3; ++i) {
							notes = [];
							addOffset = 0;
							loadOffset = 0;
							loadSide = 0;
							type = "";
							saveDiv = 1;
							savePos = 0;
							saveWidth = 0;
							txt = this.bdReader[index].result;
							var arr = txt.replace(/\/\/.*/g, "").replace(/(\s*;\s*|\s+)/g, "`").split(/`/g);
		//					console.log(arr);
		//					step0 = txt.replace(/\/\/.*/g, "");
		//					step1 = step0.replace(/( - |\s+)/g, "`");
		//					step2 = step1.split(/`/g);
							var j = 0;
							while (j < arr.length) {
								if (arr[j] == "#div") {
									if (arr[j + 1] == "/") {
										saveDiv = 1;
									}
									else {
										saveDiv = Number(arr[j + 1]);
									}
									j += 2;
								}
								if (arr[j] == "#bpm") {
									CMap.m_barPerMin = Number(arr[j + 1])/4;
									j += 2;
								}
								else if (arr[j] == "#globaloffset") {
									loadOffset = ana(arr[j + 1]);
									j += 2;
								}
								else if (arr[j] == "#offset") {
									addOffset += ana(arr[j + 1]);
									j += 2;
								}
								else if (arr[j] == "#side") {
									switch (arr[j + 1]) {
										case "center":
											loadSide = 0;
											break;
										case "left":
											loadSide = 1;
											break;
										case "right":
											loadSide = 2;
											break;
									}
									j += 2;
								}
								else if (arr[j] == "#type") {
									type = arr[j + 1];
									j += 2;
								}
								else if (arr[j] == "") {
									break;
								}
								else {
									var m_id = notes.length;
									var m_type, m_time, m_position, m_width;
									switch (arr[j]) {
										case "n":
											m_type = "NORMAL";
											break;
										case "c":
											m_type = "CHAIN";
											break;
										case "h":
											m_type = "HOLD";
											break;
										case "-":
											m_type = saveType;
											break;
										default:
											console.log("boom:"+arr[j],arr[j+1],arr[j+2],arr[j+3],arr[j+4]);
											m_type = "YUKIKAZE";
											break;
									}
									saveType = m_type;
									m_time = ana(arr[j+1]);
									m_position = (arr[j+2] == "," ? savePos : Number(arr[j+2])/10);
									savePos = m_position;
									m_width = (arr[j+3] == "," ? saveWidth : Number(arr[j+3])/10);
									saveWidth = m_width;
									if (m_type == "NORMAL" || m_type == "CHAIN") {
										notes.push({
											"m_id":m_id,
											"m_type":m_type,
											"m_time":m_time + addOffset,
											"m_position":m_position,
											"m_width":m_width,
											"m_subId":-1
										});
										j += 4;
									}
									else {
										notes.push({
											"m_id":m_id,
											"m_type":"HOLD",
											"m_time":m_time + addOffset,
											"m_position":m_position,
											"m_width":m_width,
											"m_subId":m_id + 1
										});
										notes.push({
											"m_id":m_id + 1,
											"m_type":"SUB",
											"m_time":ana(arr[j+4]) + addOffset,
											"m_position":m_position,
											"m_width":m_width,
											"m_subId":-1
										});
										j += 5;
									}
								}
								
							}
							switch (loadSide) {
								case 0:
									noteDown = $.extend(notes, [], true);
									break;
								case 1:
									noteLeft = $.extend(notes, [], true);
									CMap.m_leftRegion = type.toUpperCase();
									break;
								case 2:
									noteRight = $.extend(notes, [], true);
									CMap.m_rightRegion = type.toUpperCase();
									break;
								default:
									break;
							}
						}
					}
				}
				totalNote = noteDown.length + noteLeft.length + noteRight.length;
				typeL = CMap.m_leftRegion;
				typeR = CMap.m_rightRegion;
				bpm = CMap.m_barPerMin;
				spu = 60 / CMap.m_barPerMin;
				spq = spu / 32;
				CMap.m_timeOffset = Math.round(60/CMap.m_barPerMin*loadOffset*100000)/100000;
				offset = CMap.m_timeOffset;
				hardship = hardshipMap[CMap.m_mapID.substr(-1, 1)][0];
				hardshipColor = hardshipMap[CMap.m_mapID.substr(-1, 1)][1];
				onloadRun = true;
				loaded++;		
			}
		}
		
		if (loaded >= 5 + totalHitBuffer) {
			for (var i = 0; i < noteDown.length; ++i) {
				if (noteDown[i]) {
					noteDown[i].m_position = Number(noteDown[i].m_position);
					noteDown[i].m_width = Number(noteDown[i].m_width);
					noteDown[i].m_time = Number(noteDown[i].m_time);
					noteDown[i].m_id = Number(noteDown[i].m_id);
				}
			}
			for (var i = 0; i < noteLeft.length; ++i) {
				if (noteLeft[i]) {
					noteLeft[i].m_position = Number(noteLeft[i].m_position);
					noteLeft[i].m_width = Number(noteLeft[i].m_width);
					noteLeft[i].m_time = Number(noteLeft[i].m_time);
					noteLeft[i].m_id = Number(noteLeft[i].m_id);
				}
			}
			for (var i = 0; i < noteRight.length; ++i) {
				if (noteRight[i]) {
					noteRight[i].m_position = Number(noteRight[i].m_position);
					noteRight[i].m_width = Number(noteRight[i].m_width);
					noteRight[i].m_time = Number(noteRight[i].m_time);
					noteRight[i].m_id = Number(noteRight[i].m_id);
				}
			}
			scene = false;
			showCS = true;
		}
	}
}
var txt, step0, step1, step2;
//		$("#tojson").on("click", function(e) {
//						var xotree = new XML.ObjTree();
//					    var dumper = new JKL.Dumper(); 
//						var xmlText = $("#xml").val();
//						if($("#zyBianma").attr("checked")){
//							xmlText = repalceFh(xmlText);
//						}
//						var tree = xotree.parseXML(xmlText);
//						$("#json").val(dumper.dump(tree));
//					});
//					
//					$("#toxml").on("click", function(e) {
//						var xotree = new XML.ObjTree();
//						var json = eval("(" + $("#json").val() + ")");
//						$("#xml").val(formatXml(xotree.writeXML(json))); 
//					});
		








