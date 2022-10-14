function countNote() {
	var note = 0;
	for (var i = 0; i < noteDown.length; ++i) {
		if (noteDown[i]) note++;
	}
	for (var i = 0; i < noteLeft.length; ++i) {
		if (noteLeft[i]) note++;
	}
	for (var i = 0; i < noteRight.length; ++i) {
		if (noteRight[i]) note++;
	}
	return note;
}

function GetBar(bar)
{

	var count = bpmlist.length;

	if(count <= 1)
	{
		return bar*spu;
	}
	var num=0.0;
	for(var i=1;i<count;i++)
	{
		if(bpmlist[i].m_time>= bar)
		{
			num += (bar - bpmlist[i-1].m_time) * 60 / bpmlist[i - 1].m_value ;
			return num;
		}
		num += (bpmlist[i].m_time - bpmlist[i - 1].m_time) * 60 / bpmlist[i - 1].m_value ;
	}
	num += (bar - bpmlist[count - 1].m_time) * 60 / bpmlist[count - 1].m_value ;

	return num;
}
function SetBar(time)
{
	var count = timelist.length;
	if(count <= 1)
	{
		return time/spu;
	}
	var num=0.0;
	for(var i=1;i<count;i++)
	{
		if(timelist[i].m_time >= time)
		{
			num += (time - timelist[i-1].m_time) * timelist[i - 1].m_value / 60;
			return num;
		}
		num += (timelist[i].m_time - timelist[i - 1].m_time) * timelist[i - 1].m_value / 60;
	}
	num += (time - timelist[count - 1].m_time) * timelist[count - 1].m_value / 60;
	return num;
}

function AddBPMChange(bar, BPM)
{
	var id;
	for(id=0 ; id<bpmlist.length ; id++)
	{
		if(bar<bpmlist[id].m_time)
		{
			break;
		}
	}
	var bpmnum={};

	bpmnum.m_time=bar;
	bpmnum.m_value=BPM/4;
	bpmlist.splice(id,0,bpmnum);
	TimelistReset();
}

function TimelistReset()
{
	timelist = JSON.parse(JSON.stringify(bpmlist));
	for(var i=0;i<bpmlist.length;i++)
	{
		timelist[i].m_time = GetBar(bpmlist[i].m_time);
		timelist[i].m_value = bpmlist[i].m_value;
	}
}

function AddFirstBPM()
{
	var bpmnum={};
	bpmnum.m_time = 0;
	bpmnum.m_value = CMap.m_barPerMin;
	bpmlist[0]=bpmnum;
	TimelistReset();
}

function clearHit(only) {
	var thisTime = musicCtrl.currentTime + (offset*spu);
	noteDownHit = [];
	noteLeftHit = [];
	noteRightHit = [];
	if (! only) {
		for (var i = 0; i < noteDown.length; ++i) {
			noteDownHit[i] = noteDown[i] && GetBar(noteDown[i].m_time) < thisTime;
		}
		for (var i = 0; i < noteLeft.length; ++i) {
			noteLeftHit[i] = noteLeft[i] && GetBar(noteLeft[i].m_time) < thisTime;
		}
		for (var i = 0; i < noteRight.length; ++i) {
			noteRightHit[i] = noteRight[i] && GetBar(noteRight[i].m_time) < thisTime;
		}
	}
}

function setTime(time) {
	if (musicCtrl) {
		musicCtrl.currentTime = time;
		if (! musicCtrl.paused && ! showCS) {
			clearHit();
		}
	}
	showCS = false;
}

function resetCS() {
	showCS = true;
	combo = 0;
	totalNote = countNote();
	score = 0;
	preScore = 0;
	hitDouble = 0;
	hitThisFrame2 = 0;
	clearHit();
}

function drawNumber(nb, align, rate, x, y, len) {
	var str = String(nb), width = 154*rate, height = 176*rate, wx, wy = y - height/2;
	if (len) {
		while (str.length < len) {
			str = "0" + str;
		}
	}
	for (var i = 0; i < str.length; ++i) {
		switch (align) {
			case "left":
				wx = x + (-str.length + i - 1)*width*0.85;
				break;
			case "right":
				wx = x + i*width*0.85;
				break;
			case "center":
				wx = x + (-str.length/2 + i - 1)*width*0.85;
				break;
		}
		ctx.drawImage(numberCanvas, str[i]*154, 0, 154, 176, wx, wy, width, height);
	}
}

function drawMiddleImage(target, sx, sy, sw, sh, x, y, rate) {
	var rate = rate || 1;
	var w = sw*rate;
	var h = sh*rate;
	x = x - w/2;
	y = y - h/2;
	ctx.drawImage(target, sx, sy, sw, sh, x, y, w, h);
}

function getNote(id, side) {
	switch (side) {
		case 0:
			return noteDown[id];
			break;
		case 1:
			return noteLeft[id];
			break;
		case 2:
			return noteRight[id];
			break;
		default:
			return undefined;
			break;
	}
}

function undo() {
	var thing = didList[didListPlace];
	if (thing) {
		switch (thing[0]) {
			case "del":
				switch (thing[1]) {
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
				addNoteById(id, thing[1], thing[2], 1);
				break;

			case "add":
				delNoteById(thing[2].m_id, thing[1], 1);
				break;
		}
		didListPlace--;
		if (thing[2].m_type == "SUB") {
			undo();
		}
	}
}

function redo() {
	var thing = didList[didListPlace + 1];
	if (thing) {
		didListPlace++;
		switch (thing[0]) {
			case "add":
				switch (thing[1]) {
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
				addNoteById(id, thing[1], thing[2], 1);
				break;

			case "del":
				delNoteById(thing[2].m_id, thing[1], 1);
				break;
		}
		if (thing[2].m_type == "HOLD") {
			redo();
		}
	}
}

function equal(a, b) {
	return Math.abs(a - b) < 0.000001;
}

function approximateFraction(f, maxDen) {
	var minError = f;
	var outF;
	var outNum = 1, outDen = 1, newNum, newDen;
	for (var den = 1; den <= maxDen; ++den) {
		if (outF = Math.abs(Math.round(f*den)/den - f), outF < minError) {
			minError = outF;
			newNum = Math.abs(Math.round(f*den));
			newDen = den;
			if (newNum * outDen != newDen * outNum) {
				outNum = newNum;
				outDen = newDen;
			}
			if (minError == 0) break;
		}
	}
	return ({num : outNum, den : outDen});
}

function changeSide() {
	switch (editSide)  {
		case 1:
			if (CMap.m_leftRegion == "MIXER") {
				if (mainMouse.movement == "writeHold" || mainMouse.movement == "writeNormal") {
					mainMouse.movement = "writeChain";
					resetEdit();
				}
			}
			else {
				if (mainMouse.movement == "writeChain") {
					mainMouse.movement = "writeNormal";
					resetEdit();
				}
			}
			break;
		case 2:
			if (CMap.m_rightRegion == "MIXER") {
				if (mainMouse.movement == "writeHold" || mainMouse.movement == "writeNormal") {
					mainMouse.movement = "writeChain";
					resetEdit();
				}
			}
			else {
				if (mainMouse.movement == "writeChain") {
					mainMouse.movement = "writeNormal";
					resetEdit();
				}
			}
			break;

		default:
			break;
	}
}

function isEmptyObject(obj){
	for(var key in obj){
		return false;
	};
	return true;
};

function timeSorter(x, y) {
	return x.m_time - y.m_time;
}

function save() {
	var index, s, ss;

	index = 1;
	s = [];
	ss = $.extend(true, [], noteDown);
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			ss[i].m_position = Math.round((Number(ss[i].m_position) - ss[i].m_width/2) * 1000000)/1000000;
			if (ss[i].m_type == "HOLD") {
				ss[i].t = index;
				ss[ss[i].m_subId].t = index;
				index++;
			}
		}
	}
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			s.push(ss[i]);
		}
	}
	s.sort(timeSorter);
	for (var i = 0; i < s.length; ++i) {
		s[i].m_id = i;
		s[i].m_subId = Number(s[i].m_subId);
		s[i].m_time = Number(s[i].m_time);
		s[i].m_width = Number(s[i].m_width);
		if (s[i].m_type == "HOLD") {
			for (var j = 0; j < s.length; ++j) {
				if (s[j].m_type == "SUB" && s[j].t && s[i].t == s[j].t && i != j) {
					delete s[i].t;
					delete s[j].t;
					s[i].m_subId = j;
					break;
				}
			}
		}
	}
	CMap.m_notes = {};
	CMap.m_notes.m_notes = {};
	CMap.m_notes.m_notes.CMapNoteAsset = $.extend(true, [], s);


	index = 1;
	s = [];
	ss = $.extend(true, [], noteLeft);
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			ss[i].m_position = Math.round((Number(ss[i].m_position) - ss[i].m_width/2) * 1000000)/1000000;
			if (ss[i].m_type == "HOLD") {
				ss[i].t = index;
				ss[ss[i].m_subId].t = index;
				index++;
			}
		}
	}
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			s.push(ss[i]);
		}
	}
	s.sort(timeSorter);
	for (var i = 0; i < s.length; ++i) {
		s[i].m_id = i;
		s[i].m_subId = Number(s[i].m_subId);
		s[i].m_time = Number(s[i].m_time);
		s[i].m_width = Number(s[i].m_width);
		if (s[i].m_type == "HOLD") {
			for (var j = 0; j < s.length; ++j) {
				if (s[j].m_type == "SUB" && s[j].t && s[i].t == s[j].t && i != j) {
					delete s[i].t;
					delete s[j].t;
					s[i].m_subId = j;
					break;
				}
			}
		}
	}
	CMap.m_notesLeft = {};
	CMap.m_notesLeft.m_notes = {};
	CMap.m_notesLeft.m_notes.CMapNoteAsset = $.extend(true, [], s);


	index = 1;
	s = [];
	ss = $.extend(true, [], noteRight);
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			ss[i].m_position = Math.round((Number(ss[i].m_position) - ss[i].m_width/2) * 1000000)/1000000;
			if (ss[i].m_type == "HOLD") {
				ss[i].t = index;
				ss[ss[i].m_subId].t = index;
				index++;
			}
		}
	}
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			s.push(ss[i]);
		}
	}
	s.sort(timeSorter);
	for (var i = 0; i < s.length; ++i) {
		s[i].m_id = i;
		s[i].m_subId = Number(s[i].m_subId);
		s[i].m_time = Number(s[i].m_time);
		s[i].m_width = Number(s[i].m_width);
		if (s[i].m_type == "HOLD") {
			for (var j = 0; j < s.length; ++j) {
				if (s[j].m_type == "SUB" && s[j].t && s[i].t == s[j].t && i != j) {
					delete s[i].t;
					delete s[j].t;
					s[i].m_subId = j;
					break;
				}
			}
		}
	}
	CMap.m_notesRight = {};
	CMap.m_notesRight.m_notes = {};
	CMap.m_notesRight.m_notes.CMapNoteAsset = $.extend(true, [], s);

	CMap.m_argument={};
	CMap.m_argument.m_bpmchange={};
	CMap.m_argument.m_bpmchange.CBpmchange=bpmlist;
	CMap.m_timeOffset = offset;
	CMap.m_barPerMin = bpm;

	var xotree = new XML.ObjTree();
	var CCMap = {CMap};
	var jsonText = JSON.stringify(CCMap);
	console.log(jsonText);
	var xmlText = xotree.writeXML(CCMap);
	var BB = new Blob([xmlText], {type:"application/xml"});
	//upload(jsonText);
	saveAs(BB, CMap.m_mapID + " " + getNowFormatDate() + ".xml");

}

function savefixbpm() {
	var index, s, ss;

	index = 1;
	s = [];
	ss = $.extend(true, [], noteDown);
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			ss[i].m_position = Math.round((Number(ss[i].m_position) - ss[i].m_width/2) * 1000000)/1000000;
			if (ss[i].m_type == "HOLD") {
				ss[i].t = index;
				ss[ss[i].m_subId].t = index;
				index++;
			}
		}
	}
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			s.push(ss[i]);
		}
	}
	s.sort(timeSorter);
	for (var i = 0; i < s.length; ++i) {
		s[i].m_id = i;
		s[i].m_subId = Number(s[i].m_subId);
		s[i].m_time = Timefixbpm(Number(s[i].m_time));
		s[i].m_width = Number(s[i].m_width);
		if (s[i].m_type == "HOLD") {
			for (var j = 0; j < s.length; ++j) {
				if (s[j].m_type == "SUB" && s[j].t && s[i].t == s[j].t && i != j) {
					delete s[i].t;
					delete s[j].t;
					s[i].m_subId = j;
					break;
				}
			}
		}
	}
	CMap.m_notes = {};
	CMap.m_notes.m_notes = {};
	CMap.m_notes.m_notes.CMapNoteAsset = $.extend(true, [], s);


	index = 1;
	s = [];
	ss = $.extend(true, [], noteLeft);
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			ss[i].m_position = Math.round((Number(ss[i].m_position) - ss[i].m_width/2) * 1000000)/1000000;
			if (ss[i].m_type == "HOLD") {
				ss[i].t = index;
				ss[ss[i].m_subId].t = index;
				index++;
			}
		}
	}
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			s.push(ss[i]);
		}
	}
	s.sort(timeSorter);
	for (var i = 0; i < s.length; ++i) {
		s[i].m_id = i;
		s[i].m_subId = Number(s[i].m_subId);
		s[i].m_time = Timefixbpm(Number(s[i].m_time));
		s[i].m_width = Number(s[i].m_width);
		if (s[i].m_type == "HOLD") {
			for (var j = 0; j < s.length; ++j) {
				if (s[j].m_type == "SUB" && s[j].t && s[i].t == s[j].t && i != j) {
					delete s[i].t;
					delete s[j].t;
					s[i].m_subId = j;
					break;
				}
			}
		}
	}
	CMap.m_notesLeft = {};
	CMap.m_notesLeft.m_notes = {};
	CMap.m_notesLeft.m_notes.CMapNoteAsset = $.extend(true, [], s);


	index = 1;
	s = [];
	ss = $.extend(true, [], noteRight);
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			ss[i].m_position = Math.round((Number(ss[i].m_position) - ss[i].m_width/2) * 1000000)/1000000;
			if (ss[i].m_type == "HOLD") {
				ss[i].t = index;
				ss[ss[i].m_subId].t = index;
				index++;
			}
		}
	}
	for (var i = 0; i < ss.length; ++i) {
		if (ss[i]) {
			s.push(ss[i]);
		}
	}
	s.sort(timeSorter);
	for (var i = 0; i < s.length; ++i) {
		s[i].m_id = i;
		s[i].m_subId = Number(s[i].m_subId);
		s[i].m_time = Timefixbpm(Number(s[i].m_time));
		s[i].m_width = Number(s[i].m_width);
		if (s[i].m_type == "HOLD") {
			for (var j = 0; j < s.length; ++j) {
				if (s[j].m_type == "SUB" && s[j].t && s[i].t == s[j].t && i != j) {
					delete s[i].t;
					delete s[j].t;
					s[i].m_subId = j;
					break;
				}
			}
		}
	}
	CMap.m_notesRight = {};
	CMap.m_notesRight.m_notes = {};
	CMap.m_notesRight.m_notes.CMapNoteAsset = $.extend(true, [], s);
	CMap.m_timeOffset = offset;
	CMap.m_barPerMin = bpm;

	delete CMap.m_argument;
	var xotree = new XML.ObjTree();
	var CCMap = {CMap};

	var jsonText = JSON.stringify(CCMap);
	console.log(jsonText);
	var xmlText = xotree.writeXML(CCMap);
	var BB = new Blob([xmlText], {type:"application/xml"});
	//upload(jsonText);


	saveAs(BB, CMap.m_mapID + " " + getNowFormatDate() + ".xml");

}

function saveAsMinimal() {
	var remix = {
		isMinimal: true
	};
	if (bg) {
		var dataurl = bgCanvas.toDataURL('image/png');
		remix.bg = dataurl;
	}
	else {
		remix.bg = null;
	}
	var reader = new FileReader();
	reader.readAsDataURL(musicFileCtrl, "UTF-8");
	reader.onload = function(e) {
		remix.music = e.target.result;
		var CCMap = {
			"CMap": CMap,
			"remix": remix
		}
		var jsonText = JSON.stringify(CCMap);
		var BB = new Blob([jsonText], {type:"application/json"});
		//upload(jsonText);
		saveAs(BB, CMap.m_mapID + " " + getNowFormatDate() + ".dy");
	}
}

function saveAsDynaMaker() {
	var remix = {};
	if (bg) {
		var dataurl = bgCanvas.toDataURL('image/png');
		remix.bg = dataurl;
	}
	else {
		remix.bg = null;
	}
	var reader = new FileReader();
	reader.readAsDataURL(musicFileCtrl, "UTF-8");
	reader.onload = function(e) {
		remix.music = e.target.result;
		var CCMap = {
			"CMap": CMap,
			"remix": remix
		}
		var jsonText = JSON.stringify(CCMap);
		var BB = new Blob([jsonText], {type:"application/json"});
		//upload(jsonText);
		saveAs(BB, CMap.m_mapID + " " + getNowFormatDate() + ".dy");
	}
}

function Timefixbpm(bar)
{
	num = GetBar(bar);
	return num/spu;
}

var encodeFormData = function(data) {
	var pairs = [];
	var regexp = /%20/g;

	for (var name in data) {
		var value = data[name].toString();
		var pair = encodeURIComponent(name).replace(regexp, "+") + "=" +
			encodeURIComponent(value).replace(regexp, "+");
		pairs.push(pair);
	}
	return pairs.join("&");
};

function upload(mapdata) {
	var xhr = new XMLHttpRequest();
	var data = encodeFormData({
		authorname : "omegaPi",
		authorpassword : "Ilovegame233",
		type : "jsonmap",
		name : CMap.m_path,
		difficulty : hardship,
		mapdata : mapdata
	});
	xhr.open("POST","http://dye.omegapigame.com:3000/",true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.onreadystatechange=function() {
		if (xhr.readyState==4 && xhr.status==200 || xhr.status==304) {
			alert("Map Key: " + xhr.responseText);
		}
	}
	xhr.send(data);
}

/*
const { remote } = require("electron");
const { writeFileSync } = require("fs");
function saveAs(xblob, filename) {
	save_location = remote.dialog.showSaveDialogSync();
	writeFileSync(save_location.filePath, xblob);
/** */
function saveAs(xblob, filename) {
	var xurl = URL.createObjectURL(xblob);
	var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	save_link.href = xurl;
	save_link.download = filename;

	var xevent = document.createEvent("MouseEvents");
	xevent.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	save_link.dispatchEvent(xevent);
	URL.revokeObjectURL(xurl);
	/**/
}

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		+ " " + date.getHours() + seperator2 + date.getMinutes()
		+ seperator2 + date.getSeconds();
	return currentdate;
}

function resetAnime() {
//	noteDownHit = [];
//	noteLeftHit = [];
//	noteRightHit = [];
}

function resetEdit(condition) {
	mainMouse.condition = condition || 0;
	noteTemp = [];
	noteChosen = [];
	noteChosenList = [];
	movingId = false;
}

function mtox(m_position, side) {
	if (side == 0) {
		return windowWidth/2 + (-2.5 + Number(m_position))*300;
	}
	else {
		return windowHeight/2 + (2.5 - Number(m_position))*150;
	}
}

function xtom(x, side) {
	if (side == 0) {
		return (x - windowWidth/2)/300 + 2.5;
	}
	else {
		return - (x - windowHeight/2)/150 + 2.5;
	}
}

function between(x, a, b) {
	if (a > b) {
		var temp = a;
		a = b;
		b = temp;
	}
	return a <= x && x <= b;
}
function jb(x, a, b) {
	if (a > b) {
		var temp = a;
		a = b;
		b = temp;
	}
	if (x < a) {
		return a;
	}
	else if (x > b) {
		return b;
	}
	else {
		return x;
	}
}

function delNoteById(id, side, noRecord) {
	if (! noRecord) {
		didListPlace++;
		didList[didListPlace] = [];
		didList[didListPlace][0] = "del";
		didList[didListPlace][1] = side;
	}
	switch (side) {
		case 0:
			if (! noRecord) didList[didListPlace][2] = $.extend(true, {}, noteDown[id]);
			noteDown[id] = undefined;
			break;

		case 1:
			if (! noRecord) didList[didListPlace][2] = $.extend(true, {}, noteLeft[id]);
			noteLeft[id] = undefined;
			break;

		case 2:
			if (! noRecord) didList[didListPlace][2] = $.extend(true, {}, noteRight[id]);
			noteRight[id] = undefined;
			break;
	}
	if (! noRecord)
		didList.length = didListPlace + 1;
	showCS = false;
}

function addNoteById(id, side, note, noRecord) {
	if (! noRecord) {
		didListPlace++;
		didList[didListPlace] = [];
		didList[didListPlace][0] = "add";
		didList[didListPlace][1] = side;
	}
	switch (side) {
		case 0:
			noteDown[id] = $.extend(true, {}, note);
			noteDown[id].m_id = id;
			if (! noRecord) didList[didListPlace][2] = $.extend(true, {}, noteDown[id]);
			break;

		case 1:
			noteLeft[id] = $.extend(true, {}, note);
			noteLeft[id].m_id = id;
			if (! noRecord) didList[didListPlace][2] = $.extend(true, {}, noteLeft[id]);
			break;

		case 2:
			noteRight[id] = $.extend(true, {}, note);
			noteRight[id].m_id = id;
			if (! noRecord) didList[didListPlace][2] = $.extend(true, {}, noteRight[id]);
			break
	}
	if (! noRecord)
		didList.length = didListPlace + 1;
	showCS = false;
}

function imgLoad(img, callback) {
	var timer = setInterval(function() {
		if (img && img.complete) {
			clearInterval(timer);
			loaded++;
			callback(img);
		}
	}, 50);
}


function addEvent(obj,xEvent,fn) {
	if (obj.attachEvent) {
		obj.attachEvent('on' + xEvent,fn);
	}
	else {
		obj.addEventListener(xEvent, fn, false);
	}
}

function fullScreen() {
	var docElm = document.documentElement;
	if (docElm.requestFullscreen) {
		docElm.requestFullscreen();
	}

	//FireFox
	else if (docElm.mozRequestFullScreen) {
		docElm.mozRequestFullScreen();
	}

	//Chrome
	else if (docElm.webkitRequestFullScreen) {
		docElm.webkitRequestFullScreen();
	}

	//IE11
	else if (elem.msRequestFullscreen) {
		elem.msRequestFullscreen();
	}
	isFullScreen = true;
	canvas.style = " height: 100%;width: 100%;margin: 0;padding: 0;display: block;";
}

function unFullScreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	}
	else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	}
	else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	}
	else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
	isFullScreen = false;
	canvas.style = defaultCanvasStyle;
}

function getBrowser() {
	var userAgent = navigator.userAgent;
	var isOpera = userAgent.indexOf("Opera") > -1;
	if (isOpera) {
		return "Opera";
	}
	if (userAgent.indexOf("Firefox") > -1) {
		return "Firefox";
	}
	if (userAgent.indexOf("Edge") > -1) {
		return "Edge";
	}
	if (userAgent.indexOf("Chrome") > -1){
		return "Chrome";
	}
	if (userAgent.indexOf("Safari") > -1) {
		return "Safari";
	}
	if (userAgent.indexOf("compatible") > -1 || userAgent.indexOf("MSIE") > -1) {
		return "IE";
	}
	return "IE";
}

function getPointOnCanvas(c, x, y) {
	var box = c.getBoundingClientRect();
	return {
		x: x - box.left*(c.width/box.width),
		y: y - box.top *(c.height/box.height)
	};
}

function inArea(coordinate, x, y, w, h) {
	return coordinate.x >= x && coordinate.x <= x + w && coordinate.y >= y && coordinate.y <= y + h;
}

function rgba(red, green, blue, alpha) {
	return "rgba(" + red + ","+ green + ","+ blue + ","+ alpha + ")";
}

function rgb(red, green, blue) {
	return "rgb(" + red + ","+ green + ","+ blue + ")";
}

function drawRect(c, color, x, y, w, h) {
	c.fillStyle = color;
	c.fillRect(x, y, w, h);
}

function drawJBox(c, x, y, w, h, x1, y1, x2, y2, color1, color2) {
	c.beginPath();
	var grad = c.createLinearGradient(x1, y1, x2, y2);
	grad.addColorStop(0, color1);
	grad.addColorStop(1, color2);
	c.fillStyle = grad;
	c.fillRect(x, y, w, h);
}

function drawBox(c, x, y, w, h, alpha, lw) {
	canvas.globalAlpha = alpha;
	c.fillStyle = rgba(0, 0, 0, 0.8);
	c.fillRect(x, y, w, h);
	drawJBox(c, x, y, w, lw, x + lw/2, y, x + lw/2, y + lw, "#0FF", rgba(0, 255, 255, 0.0));
	drawJBox(c, x, y + h - lw, w, lw, x + lw/2, y + h - lw, x + lw/2, y + h, rgba(0, 255, 255, 0.0), "#0FF");
	drawJBox(c, x, y, lw, h, x, y + h/2, x + lw, y + h/2, "#0FF", rgba(0, 255, 255, 0.0));
	drawJBox(c, x + w - lw, y, lw, h, x + w - lw, y + h/2, x + w, y + h/2, rgba(0, 255, 255, 0.0), "#0FF");
	canvas.globalAlpha = 1;
}

//function drawNumber(c, lr, num, size, type, x, y) {
//	var nw = 42;
//	var nh = 40;
//	t = num + "";
//	for (var i = 0; i < t.length; ++i) {
////		c.drawImage(charCanvas[0], 8 + t[i]*nw, 217 + nw*type, nw, nh, x + (i*lr*t.length) + (i - lr*t.length)*(nw - 5), y, nw, nh)
////		c.drawImage(charCanvas[1], 2*(8 + t[i]*nw), 2*(217.5 + nw*type), 2*nw, 2*nh, x + (i - lr*t.length)*(2*nw - 10), y, 2*nw, 2*nh);
//		c.drawImage(charCanvas, 4*(8 + t[i]*nw), 4*(217.5 + nw*type), 4*nw, 4*nh, x + (i - lr*t.length)*(4*nw - 20), y, 4*nw, 4*nh);
//	}
//}

function drawLevel(c, size, type, x, y) {
	var rate = [1, 2, 4][size];
	var w = [159, 186, 114, 156, 262][type]*rate;
	//c.fillStyle = ["#ccc", "#8ff", "#f0f", "#f80", "#srcW/28"][type];
	//c.fillRect(x, y, w, 39*rate);
	c.fillStyle = "#000";
	c.drawImage(charCanvas[size], 8*rate, (42*type + 6)*rate, w, 39*rate, x, y, w, 39*rate);
}

function drawSingleNote(c, place, swidth, x, height, shadow) {
	if (low) {
		c.fillStyle = "rgba(0,255,255,1)";
		switch (place) {
			case 0 :
				c.fillRect(x - swidth/2, windowHeight - ud - (height + 7), swidth, 15);
				break;
			case 1 :
				c.fillRect(lr + (height - 7), x - swidth/2, 15, swidth);
				break;
			case 2 :
				c.fillRect(windowWidth - lr - (height + 7), x - swidth/2, 15, swidth);
				break;
			case 3 :
				c.fillRect(lr, windowHeight - ud - (height + 7),windowWidth - lr,15);
				break;
		}
		return;
	}
	if (swidth <= 40) {
		var width = 40;
	}
	else {
		var width = swidth + 10;
	}
	var l = 22;
	var cy = 23;
	var core = 1;
	var srcW = 45;
	var srcH = 28;
	var bldL = 0;
	var bldR = 0;
	switch (place) {
		case 0:
			var startX = windowHeight - ud - (height + srcH/2);
			if (width >= core + 2*l) {
				c.drawImage(normalNoteCanvasD, srcW/2 - core/2, 0, core, srcH, x - core/2, startX, core, srcH); //mid=srcW/2,
				c.drawImage(normalNoteCanvasD, cy, 0, 1, srcH, x - width/2 + l, startX, width/2 - core/2 - l, srcH); // l
				c.drawImage(normalNoteCanvasD, cy, 0, 1, srcH, x + core/2, startX, width/2 - core/2 - l, srcH); // r
				c.drawImage(normalNoteCanvasD, bldL, 0, l, srcH, x - width/2, startX, l, srcH);// l
				c.drawImage(normalNoteCanvasD, srcW - bldR - l, 0, l, srcH, x + width/2 - l, startX, l, srcH);// r

			}
			else if (width > core) {
				width -= 12;
				c.drawImage(normalNoteCanvasD, srcW/2 - core/2, 0, core, srcH, x - core/2, startX, core, srcH); //mid=srcW/2
				c.drawImage(normalNoteCanvasD, cy, 0, 1, srcH, x - width/2 , startX, width/2 - core/2, srcH); // l
				c.drawImage(normalNoteCanvasD, cy, 0, 1, srcH, x + core/2, startX, width/2 - core/2, srcH); // r
			}
			else {
				width -= 12;
				c.drawImage(normalNoteCanvasD, srcW/2 - width/2, 0, width, srcH, x - width/2, startX, width, srcH); // corepix srcW/2
			}
			if (shadow != 0 && shadow != undefined) {
				c.fillStyle = rgba(255, 0, 255, Math.pow(shadow,3));
				c.fillRect(x - width*shadow/2, windowHeight - ud - (height + 10), width*shadow, 20);
			}
			break;

		case 1:
			if (gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
			var startX = lr + height - srcH/2;
			if (width >= core + 2*l) {
				c.drawImage(normalNoteCanvasL, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(normalNoteCanvasL, 0, cy, srcH, 1, startX, x - width/2 + l, srcH, width/2 - core/2 - l); // l
				c.drawImage(normalNoteCanvasL, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2 - l); // r
				c.drawImage(normalNoteCanvasL, 0, bldL, srcH, l, startX, x - width/2, srcH, l);// l
				c.drawImage(normalNoteCanvasL, 0, srcW - bldR - l, srcH, l, startX, x + width/2 - l, srcH, l);// r
			}
			else if (width > core) {
				width -= 12;
				c.drawImage(normalNoteCanvasL, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(normalNoteCanvasL, 0, cy, srcH, 1, startX, x - width/2, srcH, width/2 - core/2); // l
				c.drawImage(normalNoteCanvasL, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2); // r
			}
			else {
				width -= 12;
				c.drawImage(normalNoteCanvasL, 0, srcW/2 - width/2, srcH, width, startX, x - core/2, srcH, width); // corepix srcW/2
			}
			c.globalAlpha = 1;
			break;

		case 2:
			if (gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
			var startX = windowWidth - lr - height - srcH/2;
			if (width >= core + 2*l) {
				c.drawImage(normalNoteCanvasR, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(normalNoteCanvasR, 0, cy, srcH, 1, startX, x - width/2 + l, srcH, width/2 - core/2 - l); // l
				c.drawImage(normalNoteCanvasR, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2 - l); // r
				c.drawImage(normalNoteCanvasR, 0, bldL, srcH, l, startX, x - width/2, srcH, l);// l
				c.drawImage(normalNoteCanvasR, 0, srcW - bldR - l, srcH, l, startX, x + width/2 - l, srcH, l);// r
			}
			else if (width > core) {
				width -= 12;
				c.drawImage(normalNoteCanvasR, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(normalNoteCanvasR, 0, cy, srcH, 1, startX, x - width/2, srcH, width/2 - core/2); // l
				c.drawImage(normalNoteCanvasR, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2); // r
			}
			else {
				width -= 12;
				c.drawImage(normalNoteCanvasR, 0, srcW/2 - width/2, srcH, width, startX, x - core/2, srcH, width); // corepix srcW/2
			}
			c.globalAlpha = 1;
			break;
	}
}

function drawSlideNote(c, place, swidth, x, height, shadow) {
	if (low) {
		c.fillStyle = "rgba(255, 128, 128, 1)";
		switch (place) {
			case 0 :
				c.fillRect(x - swidth/2, windowHeight - ud - (height + 7), swidth, 15);
				break;
			case 1 :
				c.fillRect(lr + (height - 7), x - swidth/2, 15, swidth);
				break;
			case 2 :
				c.fillRect(windowWidth - lr - (height + 7), x - swidth/2, 15, swidth);
				break;
		}
		return;
	}
	if (swidth <= 82) {
		var width = 82;
	}
	else {
		var width = swidth + 14;
	}
//	var l = 11;
//	var cy = 30;
//	var core = 72;
//	var srcW = 176;
//	var srcH = 82;
//	var bldL = 7;
//	var bldR = 5;
	var l = 21;
	var cy = 21;
	var core = 80;
	var srcW = 122;
	var srcH = 77;
	var bldL = 0;
	var bldR = 0;
	switch (place) {
		case 0:
			var startX = windowHeight - ud - (height + srcH/2);
//			c.fillRect(x - width/2, windowHeight - ud - (height + 5), width, 10);
			if (width >= core + 2*l) {
				c.drawImage(chainNoteCanvasD, srcW/2 - core/2, 0, core, srcH, x - core/2, startX, core, srcH); //mid=srcW/2,
				c.drawImage(chainNoteCanvasD, cy, 0, 1, srcH, x - width/2 + l, startX, width/2 - core/2 - l, srcH); // l
				c.drawImage(chainNoteCanvasD, cy, 0, 1, srcH, x + core/2, startX, width/2 - core/2 - l, srcH); // r
				c.drawImage(chainNoteCanvasD, bldL, 0, l, srcH, x - width/2, startX, l, srcH);// l
				c.drawImage(chainNoteCanvasD, srcW - bldR - l, 0, l, srcH, x + width/2 - l, startX, l, srcH);// r

			}
			else if (width > core) {
				width -= 14;
				c.drawImage(chainNoteCanvasD, srcW/2 - core/2, 0, core, srcH, x - core/2, startX, core, srcH); //mid=srcW/2
				c.drawImage(chainNoteCanvasD, cy, 0, 1, srcH, x - width/2 , startX, width/2 - core/2, srcH); // l
				c.drawImage(chainNoteCanvasD, cy, 0, 1, srcH, x + core/2, startX, width/2 - core/2, srcH); // r
			}
			else {
				width -= 14;
				c.drawImage(chainNoteCanvasD, srcW/2 - width/2, 0, width, srcH, x - width/2, startX, width, srcH); // corepix srcW/2
			}
			break;

		case 1:
			if (gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
			var startX = lr + height - srcH/2;
			//c.fillRect(lr + (height - 5), x - width/2, 10, width);
			if (width >= core + 2*l) {
				c.drawImage(chainNoteCanvasL, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(chainNoteCanvasL, 0, cy, srcH, 1, startX, x - width/2 + l, srcH, width/2 - core/2 - l); // l
				c.drawImage(chainNoteCanvasL, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2 - l); // r
				c.drawImage(chainNoteCanvasL, 0, bldL, srcH, l, startX, x - width/2, srcH, l);// l
				c.drawImage(chainNoteCanvasL, 0, srcW - bldR - l, srcH, l, startX, x + width/2 - l, srcH, l);// r
			}
			else if (width > core) {
				width -= 14;
				c.drawImage(chainNoteCanvasL, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(chainNoteCanvasL, 0, cy, srcH, 1, startX, x - width/2, srcH, width/2 - core/2); // l
				c.drawImage(chainNoteCanvasL, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2); // r
			}
			else {
				width -= 14;
				c.drawImage(chainNoteCanvasL, 0, srcW/2 - width/2, srcH, width, startX, x - core/2, srcH, width); // corepix srcW/2
			}
			c.globalAlpha = 1;
			break;

		case 2:
			if (gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
			var startX = windowWidth - lr - height - srcH/2;
			//c.fillRect(windowWidth - lr - (height + 5), x - width/2, 10, width);
			if (width >= core + 2*l) {
				c.drawImage(chainNoteCanvasR, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(chainNoteCanvasR, 0, cy, srcH, 1, startX, x - width/2 + l, srcH, width/2 - core/2 - l); // l
				c.drawImage(chainNoteCanvasR, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2 - l); // r
				c.drawImage(chainNoteCanvasR, 0, bldL, srcH, l, startX, x - width/2, srcH, l);// l
				c.drawImage(chainNoteCanvasR, 0, srcW - bldR - l, srcH, l, startX, x + width/2 - l, srcH, l);// r
			}
			else if (width > core) {
				width -= 14;
				c.drawImage(chainNoteCanvasR, 0, srcW/2 - core/2, srcH, core, startX, x - core/2, srcH, core); //mid=srcW/2
				c.drawImage(chainNoteCanvasR, 0, cy, srcH, 1, startX, x - width/2, srcH, width/2 - core/2); // l
				c.drawImage(chainNoteCanvasR, 0, cy, srcH, 1, startX, x + core/2, srcH, width/2 - core/2); // r
			}
			else {
				width -= 14;
				c.drawImage(chainNoteCanvasR, 0, srcW/2 - width/2, srcH, width, startX, x - core/2, srcH, width); // corepix srcW/2
			}
			c.globalAlpha = 1;
			break;
	}
}

function drawLongNote(c, place, swidth, length, x, height, extra, hitting) {
	if (low) {
		if (place > 0 && gradual) {
			if (height + lr + gradualPx >= windowHeight/2) {
				c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
			}
		}
		switch (place) {
			case 0:
				//Green Bottom
				if (hitting) {
					var t = c.globalAlpha;
					c.globalAlpha *= 0.2;
					c.fillStyle = "#00b700";
					c.fillRect(x - width/2, windowHeight - ud - (height + length), width, length);
					c.globalAlpha = t;
				}
				c.fillStyle = rgba(255, 255, 0, 0.7);
				c.fillRect(x - swidth/2, windowHeight - ud - (height + length), swidth, length);
				c.fillStyle = rgba(128, 128, 0, 0.8);
				c.fillRect(x - swidth/2, windowHeight - ud - (height) - 7, swidth, 15);
				break;

			case 1:
				//Green Left
				if (hitting) {
					var t = c.globalAlpha;
					c.globalAlpha *= 0.1;
					c.fillStyle = "#00b700";
					c.fillRect(lr + height, x - width/2, length, width);
					c.globalAlpha = t;
				}
				c.fillStyle = rgba(255, 255, 0, 0.7);
				c.fillRect(lr + height, x - swidth/2, length, swidth);
				c.fillStyle = rgba(128, 128, 0, 0.8);
				c.fillRect(lr + height - 7, x - swidth/2, 15, swidth);
				break;

			case 2:
				//Green Right
				if (hitting) {
					var t = c.globalAlpha;
					c.globalAlpha *= 0.1;
					c.fillStyle = "#00b700";
					c.fillRect(windowWidth - lr - (height + length), x - width/2, length, width);
					c.globalAlpha = t;
				}
				c.fillStyle = rgba(255, 255, 0, 0.7);
				c.fillRect(windowWidth - lr - (height + length), x - swidth/2, length, swidth);
				c.fillStyle = rgba(128, 128, 0, 0.8);
				c.fillRect(windowWidth - lr - (height) - 7, x - swidth/2, 15, swidth);
				break;
			default:
		}
		c.globalAlpha = 1;
		return;
	}
	if (swidth <= 40) {
		var width = 40;
	}
	else {
		var width = swidth + 10;
	}
	switch (place) {
		case 0:
			if (hitting) {
				var t = c.globalAlpha;
				c.globalAlpha *= 0.55;
				c.fillStyle = "#0F0";
				c.fillRect(x - width/2, windowHeight - ud - (height + length), width, length);
				c.globalAlpha = t;
			}
			var step = height;
			var ex = extra;
			while (step < height + length) {
				if (ex > 0 && height + length - step <= ex) {
					sX = 0;
					sY = (ex - (height + length - step))/180*256;
					sW = 512;
					sH = (height + length - step)/180*256;
					dX = x - width/2;
					dY = windowHeight - ud - step - (height + length - step);
					dW = width;
					dH = height + length - step;

					step = height + length;
					ex = 0;
				}
				else if (ex > 0) {
					sX = 0;
					sY = 0;
					sW = 512;
					sH = ex/180*256;
					dX = x - width/2;
					dY = windowHeight - ud - step - ex;
					dW = width;
					dH = ex;

					step += ex;
					ex = 0;
				}
				else if (height + length - step < 180) {
					sX = 0;
					sY = (180 - (height + length - step))/180*256;
					sW = 512;
					sH = (height + length - step)/180*256;
					dX = x - width/2;
					dY = windowHeight - ud - step - (height + length - step);
					dW = width;
					dH = height + length - step;

					step = height + length;
				}
				else {
					sX = 0;
					sY = 0;
					sW = 512;
					sH = 256;
					dX = x - width/2;
					dY = windowHeight - ud - step - 180;
					dW = width;
					dH = 180;

					step += 180;
				}
				sX = Math.round(sX);
				sY = Math.round(sY);
				sW = Math.round(sW);
				sH = Math.round(sH);
				dX = Math.round(dX);
				dY = Math.round(dY);
				dW = Math.round(dW);
				dH = Math.round(dH);
				c.drawImage(holdNoteCanvasD, sX, sY, sW, sH, dX, dY, dW, dH);
			}
			break;

		case 1:
			if (gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
//			c.fillRect(lr + height, x - width/2, length, width);

			if (hitting) {
				var t = c.globalAlpha;
				c.globalAlpha *= 0.45;
				c.fillStyle = "#0F0";
				c.fillRect(lr + height, x - width/2, length, width);
				c.globalAlpha = t;
			}
			var step = height;
			var ex = extra;
			while (step < height + length) {
				if (ex > 0 && height + length - step <= ex) {
					sX = (180 - ex)/180*256;
					sY = 0;
					sW = (height + length - step)/180*256;
					sH = 512;
					dX = lr + step;
					dY = (x) - width/2;
					dW = height + length - step;
					dH = width;

					step = height + length;
					ex = 0;
				}
				else if (ex > 0) {
					sX = (180 - ex)/180*256;
					sY = 0;
					sW = ex/180*256;
					sH = 512;
					dX = lr + step;
					dY = (x) - width/2;
					dW = ex;
					dH = width;

					step += ex;
					ex = 0;
				}
				else if (height + length - step < 180) {
					sX = 0;
					sY = 0;
					sW = (height + length - step)/180*256;
					sH = 512;
					dX = lr + step;
					dY = (x) - width/2;
					dW = height + length - step;
					dH = width;

					step = height + length;
				}
				else {
					sX = 0;
					sY = 0;
					sW = 256;
					sH = 512;
					dX = lr + step;
					dY = (x) - width/2;
					dW = 180;
					dH = width;

					step += 180;
				}
				sX = Math.round(sX);
				sY = Math.round(sY);
				sW = Math.round(sW);
				sH = Math.round(sH);
				dX = Math.round(dX);
				dY = Math.round(dY);
				dW = Math.round(dW);
				dH = Math.round(dH);
				c.drawImage(holdNoteCanvasL, sX, sY, sW, sH, dX, dY, dW, dH);
			}
			c.globalAlpha = 1;
			//1
			break;

		case 2:
			if (gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
//			c.fillRect(windowWidth - lr - (height + length), x - width/2, length, width);
			if (hitting) {
				var t = c.globalAlpha;
				c.globalAlpha *= 0.45;
				c.fillStyle = "#0F0";
				c.fillRect(windowWidth - lr - (height + length), x - width/2, length, width);
				c.globalAlpha = t;
			}
			var step = height;
			var ex = extra;
			while (step < height + length) {
				if (ex > 0 && height + length - step <= ex) {
					sX = (ex - (height + length - step))/180*256;
					sY = 0;
					sW = (height + length - step)/180*256;
					sH = 512;
					dX = windowWidth - lr - step - (height + length - step);
					dY = (x) - width/2;
					dW = height + length - step;
					dH = width;

					step = height + length;
					ex = 0;
				}
				else if (ex > 0) {
					sX = 0;
					sY = 0;
					sW = ex/180*256;
					sH = 512;
					dX = windowWidth - lr - step - ex;
					dY = (x) - width/2;
					dW = ex;
					dH = width;

					step += ex;
					ex = 0;
				}
				else if (height + length - step < 180) {
					sX = (180 - (height + length - step))/180*256;
					sY = 0;
					sW = (height + length - step)/180*256;
					sH = 512;
					dX = windowWidth - lr - step - (height + length - step);
					dY = (x) - width/2;
					dW = height + length - step;
					dH = width;

					step = height + length;
				}
				else {
					sX = 0;
					sY = 0;
					sW = 256;
					sH = 512;
					dX = windowWidth - lr - step - 180;
					dY = (x) - width/2;
					dW = 180;
					dH = width;

					step += 180;
				}
				sX = Math.round(sX);
				sY = Math.round(sY);
				sW = Math.round(sW);
				sH = Math.round(sH);
				dX = Math.round(dX);
				dY = Math.round(dY);
				dW = Math.round(dW);
				dH = Math.round(dH);
				c.drawImage(holdNoteCanvasR, sX, sY, sW, sH, dX, dY, dW, dH);
			}
			c.globalAlpha = 1;
			//1
			break;
	}
	c.fillStyle = "rgba(255,255,0,1.0)";
//	switch (place) {
//		case 0:
//			c.fillRect(x - width/2, windowHeight - ud - (height + 5), width, 10);
//			break;
//		case 1:
//			c.fillRect(lr + (height - 5), x - width/2, 10, width);
//			break;
//		case 2:
//			c.fillRect(windowWidth - lr - (height + 5), x - width/2, 10, width);
//			break;
//	}
}

function drawLongBoxNote(c, place, swidth, slength, x, height) {
	if (low) {
		return;
	}
	var ub = 14;
	var db = 25;
	var lrb = 13;
	c.fillStyle = rgba(208,208,128,0.5);
	var width = swidth;
	var length = slength;
	if (slength <= 66) {
		length = 66;
	}
	if (swidth <= 30) {
		width = 30;
	}
	switch (place) {
		case 0:
			c.drawImage(holdBoxCanvasD, 0, 56, 34, 48, x - width/2 - 18, windowHeight - ud - height - db, 34, 48); //LD
			c.drawImage(holdBoxCanvasD, 35, 56, 34, 48, x + width/2 - 16, windowHeight - ud - height - db, 34, 48); //RD
			c.drawImage(holdBoxCanvasD, 0, 0, 34, 55, x - width/2 - 18, windowHeight - ud - (height + length) - ub, 34, 55); //LU
			c.drawImage(holdBoxCanvasD, 35, 0, 34, 55, x + width/2 - 16, windowHeight - ud - (height + length) - ub, 34, 55); //RU
			c.drawImage(holdBoxCanvasD, 34, 56, 1, 48, x - width/2 + 16, windowHeight - ud - height - 25, width - 32, 48); //D
			c.drawImage(holdBoxCanvasD, 34, 0, 1, 55, x - width/2 + 16, windowHeight - ud - (height + length) - 14, width - 32, 55); //U
			c.drawImage(holdBoxCanvasD, 0, 55, 32, 1, x - width/2 - 18, windowHeight - ud - (height + length) - ub + 55, 32, length - 66); //L
			c.drawImage(holdBoxCanvasD, 35, 55, 34, 1, x + width/2 - 16, windowHeight - ud - (height + length) - ub + 55, 34, length - 66); //R
			break;

		case 1:
			if (gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
			c.drawImage(holdBoxCanvasL, 0, 0, 52, 34, lr + height - 25, x - width/2 - 18, 52, 34); //LU
			c.drawImage(holdBoxCanvasL, 0, 35, 52, 34, lr + height - 25, x + width/2 - 16, 52, 34); //LD
			c.drawImage(holdBoxCanvasL, 52, 0, 55, 34, lr + height + length - 44, x - width/2 - 18, 55, 34); //RU
			c.drawImage(holdBoxCanvasL, 52, 35, 55, 34, lr + height + length - 44, x + width/2 - 16, 55, 34); //RD
			c.drawImage(holdBoxCanvasL, 0, 34, 52, 1, lr + height - 25, x - width/2 + 16, 52, width - 32); //L
			c.drawImage(holdBoxCanvasL, 52, 34, 55, 1, lr + (height + length) - 44, x - width/2 + 16, 55, width - 32); //R
			c.drawImage(holdBoxCanvasL, 52, 0, 1, 32, lr + height + 27, x - width/2 - 18, length - 71, 32); //U
			c.drawImage(holdBoxCanvasL, 52, 34, 1, 34, lr + height + 27, x + width/2 - 17, length - 71, 34); //D
			c.globalAlpha = 1;
			//1
			break;

		case 2:
			if (gradual) {
				if (height + lr + gradualPx >= windowHeight/2) {
					c.globalAlpha = jb((windowWidth/2 - lr - height)/gradualPx, 0, 1);
				}
			}
			c.drawImage(holdBoxCanvasR, 0, 0, 55, 34, windowWidth - lr - (height +  length) - 12, x - width/2 - 18, 55, 34); //LU
			c.drawImage(holdBoxCanvasR, 0, 34, 55, 34, windowWidth - lr - (height +  length) - 12, x + width/2 - 17, 55, 34); //LD
			c.drawImage(holdBoxCanvasR, 56, 0, 52, 34, windowWidth - lr - height - 29, x - width/2 - 18, 52, 34); //RU
			c.drawImage(holdBoxCanvasR, 56, 35, 52, 34, windowWidth - lr - height - 29, x + width/2 - 16, 52, 34); //RD
			c.drawImage(holdBoxCanvasR, 0, 34, 55, 1, windowWidth - lr - (height +  length) - 12, x - width/2 + 16, 55, width - 33); //L
			c.drawImage(holdBoxCanvasR, 55, 34, 52, 1, windowWidth - lr - height - 30, x - width/2 + 16, 52, width - 32); //R
			c.drawImage(holdBoxCanvasR, 55, 0, 1, 32, windowWidth - lr - (height +  length) + 43, x - width/2 - 18, length - 72, 32); //U
			c.drawImage(holdBoxCanvasR, 55, 36, 1, 32, windowWidth - lr - (height +  length) + 43, x + width/2 - 15, length - 72, 32); //D
			c.globalAlpha = 1;
			//1
			break;
	}
}

function drawBpmchange(c,height,value)
{
	c.fillStyle = "rgba(255,255,255,0.6)";
	c.fillRect(0, windowHeight - ud - (height + 5),windowWidth,10);
	c.fillStyle = "rgba(255,255,255,1)";
	c.fillText(value*4+"",windowWidth-lr-40,windowHeight - ud - (height + 35));
	return;
}

function hitAnime(place, type, width, x, frames) {
	if (musicCtrl.paused) {
		return;
	}
	if (showHitSound) {
		if (AC) {
			playSound(hitCtrl[hitTypeMap[place][type]], 0);
		}
		else for (var i = 0; i < hitBuffer[hitTypeMap[place][type]]; ++i) {
			if (hitCtrl[hitTypeMap[place][type]][i].paused) {
				hitCtrl[hitTypeMap[place][type]][i].play();
				break;
			}
		}
	}
	combo++;
	hitNote++;
	hitThisFrame = 3;
	hitThisFrame2 = 110;
	//console.log(["Down ","Left ","Right "][place] + ["NORMAL ","CHAIN ","HOLD ","SUB "][type]);
	if (CMap.m_leftRegion == "MIXER" && place == 1) {
		if (type == 1) {
			barTargetL = x;
			mixerLT = 24;
			var stype = 0;
			var sx1, sy1, sd1, sx2, sy2, sd2;
			var shootRange = 270;
			var shootFrame = 24;
			width = 234;
			for (var i = 0; i < Math.ceil(width / 30 +0.1); ++i) {
				//Jmak w/ Special Guest - Particles Revamp
				//Purple
				sx1 = lr;
				sy1 = x - width/2 + Math.random()*width;
				sd1 = Math.random() * 360;
				//sv = jb((Math.random() + 1)*Math.PI, Math.PI, Math.PI*2);
				sv = 0;
				//sx2 = sx1 + (Math.sin(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				//sy2 = sy1 - 0;
				sy2 = sy1 + (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				sx2 = sx1 - 0;
				sd2 = Math.random() * 360 - 180;
				shootParticle(shootFrame, 0, sx1, sy1, sd1, sx2, sy2, sd2);
				sy2 = sy1 - (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				shootParticle(shootFrame, 0, sx1, sy1, sd1, sx2, sy2, sd2);
			}
			shootRange = 6;
			//White
			var shootFrame = 6;
			for (var i = 0; i < Math.ceil(width / 13 + 0.1); ++i) {
				sx1 = lr;
				sy1 = jb(x - width*getNumberInNormalDistribution(0.0, 0.25), x - width/2, x + width/2);
				sd1 = Math.random() * 360;
				sv = jb((Math.random() + 1)*Math.PI, Math.PI, Math.PI*2);
				sx2 = sx1 - Math.min(Math.random() * shootRange*(1/Math.abs(sy1 - (x) + 0.0*width)*width), 200);
				sy2 = sy1 + Math.cos(sv) * shootRange;
				sd2 = Math.random() * 360 - 180;
				shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
			}
			//Smoke
			for (var i = 0; i < Math.ceil(width / 13 + 0.1); ++i) {
				sx1 = lr;
				sy1 = x - width/2 + Math.random()*width;
				sd1 = Math.random() * 20 - 10;
				sv = getNumberInNormalDistribution(1.5, 1)*Math.PI;
				sx2 = sx1 + Math.sin(sv) * shootRange;
				sy2 = sy1 - Math.cos(sv) * shootRange;
				sd2 = Math.random() * 360 - 180;
				shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
			}
		}
		return;
	}
	if (CMap.m_rightRegion == "MIXER" && place == 2) {
		if (type == 1) {
			barTargetR = x;
			mixerRT = 24;
			var stype = 0;
			var sx1, sy1, sd1, sx2, sy2, sd2;
			var shootRange = 270;
			var shootFrame = 24;
			width = 234;
			for (var i = 0; i < Math.ceil(width / 30+0.1); ++i) {
				//Jmak w/ Special Guest - Particles Revamp
				//Purple
				sx1 = windowWidth - lr;
				sy1 = x - width/2 + Math.random()*width;
				sd1 = Math.random() * 360;
				//sv = jb((Math.random() + 1)*Math.PI, Math.PI, Math.PI*2);
				sv = 0;
				//sx2 = sx1 + (Math.sin(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				//sy2 = sy1 - 0;
				sy2 = sy1 + (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				sx2 = sx1 - 0;
				sd2 = Math.random() * 360 - 180;
				shootParticle(shootFrame, 0, sx1, sy1, sd1, sx2, sy2, sd2);
				sy2 = sy1 - (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				shootParticle(shootFrame, 0, sx1, sy1, sd1, sx2, sy2, sd2);
			}
			shootRange = 6;
			//White
			var shootFrame = 6;
			for (var i = 0; i < Math.ceil(width / 13 + 0.1); ++i) {
				sx1 = windowWidth - lr;
				sy1 = jb(x - width*getNumberInNormalDistribution(0.0, 0.25), x - width/2, x + width/2);
				sd1 = Math.random() * 360;
				sv = jb((Math.random() + 1)*Math.PI, Math.PI, Math.PI*2);
				sx2 = sx1 - Math.min(Math.random() * shootRange*(1/Math.abs(sy1 - (x) + 0.0*width)*width), 200);
				sy2 = sy1 + Math.cos(sv) * shootRange;
				sd2 = Math.random() * 360 - 180;
				shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
			}
			//Smoke
			for (var i = 0; i < Math.ceil(width / 13 + 0.1); ++i) {
				sx1 = windowWidth - lr;
				sy1 = x - width/2 + Math.random()*width;
				sd1 = Math.random() * 20 - 10;
				sv = getNumberInNormalDistribution(1.5, 1)*Math.PI;
				sx2 = sx1 + Math.sin(sv) * shootRange;
				sy2 = sy1 - Math.cos(sv) * shootRange;
				sd2 = Math.random() * 360 - 180;
				shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
			}
		}
		return;
	}
	hitAnimeList.push([24, place, width, x, 24, type]);
	var stype = 0;
	var sx1, sy1, sd1, sx2, sy2, sd2;
	var shootRange = 270;
	//case 0 1 2 Bottom Left Right
	switch (place) {
		case 0:
			//Jmak w/ Special Guest - Particles Revamp
			//Bottom
			//Purple
			var shootFrame = 20;
			for (var i = 4; i < Math.ceil(width / 30 + 0.1); ++i) {
				//sx1 = x - width/2 + Math.random()*width;
				sx1 = x;
				sy1 = windowHeight - ud;
				sd1 = Math.random() * 360;
				//sv = jb((Math.random() + 1)*Math.PI, Math.PI, Math.PI*2);
				sv = 0;
				sx2 = sx1 + (Math.cos(sv) * shootRange * (Math.random() * 2.7 + 0.6));
				sy2 = sy1 - 0;
				sd2 = Math.random() * 360 - 180;
				shootParticle(shootFrame, 0, sx1, sy1, sd1, sx2, sy2, sd2);
				sx2 = sx1 - (Math.cos(sv) * shootRange * (Math.random() * 2.7 + 0.6));
				shootParticle(shootFrame, 0, sx1, sy1, sd1, sx2, sy2, sd2);
			}
			shootRange = 4;
			//White
			var shootFrame = 6;
			for (var i = 0; i < Math.ceil(width / 13 + 0.1); ++i) {
				sx1 = jb(x + width*getNumberInNormalDistribution(0.2, 0.25), x - width/2, x + width/2);
				sy1 = windowHeight - ud;
				sd1 = Math.random() * 360;
				sv = jb((Math.random() + 1)*Math.PI, Math.PI, Math.PI*2);
				sx2 = sx1 + Math.cos(sv) * 10;
				sy2 = sy1 - Math.min(Math.random() * shootRange*(1/Math.abs(sx1 - x - 0.2*width)*width), 200);
				sd2 = Math.random() * 360 - 180;
				//shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
			}
			//Smoke
			for (var i = 0; i < Math.ceil(width / 13 + 0.1); ++i) {
				sx1 = x + (Math.random() - 0.5)*width;
				sy1 = windowHeight - ud;
				sd1 = Math.random() * 20 - 100;
				sv = 0;
				sx2 = sx1 + (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				sy2 = sy1 - 0;
				sd2 = Math.random() * 360 - 180;
				shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
				sx2 = sx1 - (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
			}
			break;
		case 1:
			//Left
			var shootFrame = 18;
			for (var i = 0; i < Math.ceil(width / 30 +0.1); ++i) {
			//Jmak w/ Special Guest - Particles Revamp
			//Purple
				sx1 = lr;
				sy1 = x - width/2 + Math.random()*width;
				sd1 = Math.random() * 360;
				//sv = jb((Math.random() + 1)*Math.PI, Math.PI, Math.PI*2);
				sv = 0;
				//sx2 = sx1 + (Math.sin(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				//sy2 = sy1 - 0;
				sy2 = sy1 + (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				sx2 = sx1 - 0;
				sd2 = Math.random() * 360 - 180;
				shootParticle(shootFrame, 0, sx1, sy1, sd1, sx2, sy2, sd2);
				sy2 = sy1 - (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				shootParticle(shootFrame, 0, sx1, sy1, sd1, sx2, sy2, sd2);
			}
			shootRange = 4;
			//White
			var shootFrame = 6;
			for (var i = 0; i < Math.ceil(width / 13 + 0.1); ++i) {
				sx1 = lr;
				sy1 = jb(x - width*getNumberInNormalDistribution(0.0, 0.25), x - width/2, x + width/2);
				sd1 = Math.random() * 360;
				sv = jb((Math.random() + 1)*Math.PI, Math.PI, Math.PI*2);
				sx2 = sx1 - Math.min(Math.random() * shootRange*(1/Math.abs(sy1 - (x) + 0.0*width)*width), 200);
				sy2 = sy1 + Math.cos(sv) * shootRange;
				sd2 = Math.random() * 360 - 180;
				//shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
			}
			//Smoke
			for (var i = 0; i < Math.ceil(width / 13 + 0.1); ++i) {
				sx1 = lr;
				sy1 = x - width/2 + Math.random()*width;
				sd1 = Math.random() * 20 - 10;
				sv = getNumberInNormalDistribution(1.5, 1)*Math.PI;
				sx2 = sx1 + Math.sin(sv) * shootRange;
				sy2 = sy1 - Math.cos(sv) * shootRange;
				sd2 = Math.random() * 360 - 180;
				//shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
				//
				sv = 0;
				//sx2 = sx1 + (Math.sin(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				//sy2 = sy1 - 0;
				sy2 = sy1 + (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				sx2 = sx1 - 0;
				sd2 = Math.random() * 360 - 180;
				shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
				sy2 = sy1 - (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
			}
			break;
		case 2:
			//Jmak w/ Special Guest - Particles Revamp
			//Right
			//Purple
			var shootFrame = 18;
			for (var i = 0; i < Math.ceil(width / 30+0.1); ++i) {
			//Purple
				sx1 = windowWidth - lr;
				sy1 = x - width/2 + Math.random()*width;
				sd1 = Math.random() * 360;
				//sv = jb((Math.random() + 1)*Math.PI, Math.PI, Math.PI*2);
				sv = 0;
				//sx2 = sx1 + (Math.sin(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				//sy2 = sy1 - 0;
				sy2 = sy1 + (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				sx2 = sx1 - 0;
				sd2 = Math.random() * 360 - 180;
				shootParticle(shootFrame, 0, sx1, sy1, sd1, sx2, sy2, sd2);
				sy2 = sy1 - (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				shootParticle(shootFrame, 0, sx1, sy1, sd1, sx2, sy2, sd2);	
			}
			shootRange = 4;	
			//White
			var shootFrame = 6;
			for (var i = 0; i < Math.ceil(width / 13 + 0.1); ++i) {
				sx1 = windowWidth - lr;
				sy1 = jb(x - width*getNumberInNormalDistribution(0.0, 0.25), x - width/2, x + width/2);
				sd1 = Math.random() * 360;
				sv = jb((Math.random() + 1)*Math.PI, Math.PI, Math.PI*2);
				sx2 = sx1 - Math.min(Math.random() * shootRange*(1/Math.abs(sy1 - (x) + 0.0*width)*width), 200);
				sy2 = sy1 + Math.cos(sv) * shootRange;
				sd2 = Math.random() * 360 - 180;
				//shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
			}
			//Smoke
			for (var i = 0; i < Math.ceil(width / 13 + 0.1); ++i) {
				sx1 = windowWidth - lr;
				sy1 = x - width/2 + Math.random()*width;
				sd1 = Math.random() * 20 - 10;
				sv = getNumberInNormalDistribution(1.5, 1)*Math.PI;
				sx2 = sx1 + Math.sin(sv) * shootRange;
				sy2 = sy1 - Math.cos(sv) * shootRange;
				sd2 = Math.random() * 360 - 180;
				//shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
				sv = 0;
				//sx2 = sx1 + (Math.sin(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				//sy2 = sy1 - 0;
				sy2 = sy1 + (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				sx2 = sx1 - 0;
				sd2 = Math.random() * 360 - 180;
				shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
				sy2 = sy1 - (Math.cos(sv) * shootRange * (Math.random() * 1.5 + 0.25));
				shootParticle(shootFrame + Math.floor(Math.random()*4), 2, sx1, sy1, sd1, sx2, sy2, sd2);
			}
			break;
	}

}

function drawTextInBox(c, mes, x, y, w, h, alpha) {
	var startX = x + 8;
	var startY = y + 8;
	var temp = 0;
	var width = w - 16;
	var height = h - 16;
	var left = mes;
	var line = "";
	c.fillStyle = "rgba(255,255,255," + alpha + ")";
	c.font = "14px consolas";
	c.textAlign = "left";
	c.textBaseline = "top";
	while (left != "") {
		line = "";
		while (c.measureText(line).width <= width && left != "") {
			line = line + left.charAt(0);
			left = left.substring(1);
		}
		if (c.measureText(line).width > width) {
			left = line.charAt(line.length - 1) + left;
			line = line.substring(0, line.length - 1);
		}
		c.fillText(line, startX, startY + temp*16);
		++temp;
	}
}

function audioLoad(src, callback) {
	if (! src) return;
	var audio = isVideo ? document.createElement("video") : document.createElement("audio");
	audio.oncanplay = callback(audio);
	audio.src = src;
	audio.style.crossOrigin = "anonymous";
}

function comparer_old(x, y) {
	return y[0] - x[0];
}
function comparer(x, y) {
	return x.m_id - y.m_id;
}
function getNumberInNormalDistribution(mean,std_dev){
	return mean+(uniform2NormalDistribution()*std_dev);
}

function uniform2NormalDistribution(){
	var sum=0.0;
	for(var i=0; i<6; i++){
		sum=sum+Math.random();
	}
	return sum-3.0;
}


/**
 * Gets the segment of a second that a frame is in if a second is split into 60 segments.
 * @param currTime the time that the frame occurs (in seconds).
 * @returns {number} the segment number of the frame.
 */
function getFrameNumberOutOf60FromSongTime(currTime) {
	let timeFrac = currTime - Math.floor(currTime);
	return Math.floor(timeFrac * 60);
}


/**
 * Gets the segment of a second that a certain millisecond is in if a second is split into 60 segments.
 * @param currMs the millisecond that the frame is occurring in.
 * @returns {number} the segment number that the millisecond is in.
 */
function getFrameNumberOutOf60FromMs(currMs) {
	return Math.floor((currMs / 1000) * 60);
}









