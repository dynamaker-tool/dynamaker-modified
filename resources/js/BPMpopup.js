//Vertrak was here! ᵁʷᵁ
//BPM change popup function
function bpmPopup()
{
	//make sure popup doesn't already exist for some reason
	if(document.getElementById("JMAK") != null)
		return;
		
	//add stylized div to body element
	var box = document.createElement("DIV");
	box.id = "JMAK";
	box.style.position = "fixed";
	box.style.top = "50%";
	box.style.left = "50%";
	box.style.transform = "translate(-50%, -50%)";
	box.style.backgroundColor = "#191919";
	box.style.boxShadow = "inset 0px 0px 10px 10px #0FF";
	box.style.padding = "18px";
	box.display = "block";
	document.body.appendChild(box);
	
	//add stylized field label to box
	var tex = document.createElement("LABEL");
	tex.id = "LEARN";
	tex.innerHTML = "BPM:";
	tex.style.color = "#0FF";
	tex.style.width = "fit-content";
	tex.style.fontSize = ".75cm";
	box.appendChild(tex);
	
	//add stylized text field to box
	var num = document.createElement("INPUT");
	num.id = "TO";
	num.type = "text";
	num.inputMode = "decimal";
	num.maxLength = "9";
	num.size = "12";
	num.value = bpm;
	num.style.fontFamily = "Dynamix";
	num.style.fontSize = ".75cm";
	num.style.color = "#FFF";
	num.style.backgroundColor = "#191919";
	box.appendChild(num);
	
	//push buttons below text field
	box.appendChild(document.createElement("BR"));	
	
	//add stylized set BPM button to box
	var cha = document.createElement("BUTTON");
	cha.id = "CODE";
	cha.innerHTML = "Set BPM";
	cha.style.fontFamily = "Dynamix";
	cha.style.fontSize = ".75cm";
	cha.style.color = "#0FF";
	cha.style.backgroundColor = "#191919";
	cha.style.borderColor = "#0FF";
	cha.onclick =
		//NO VERTRAK I'M NOT A CODER
		//delete popup box on valid input
		function YEETUS_DELETUS()
		{
			var box = document.getElementById("JMAK");
			var num = document.getElementById("TO");
			//check for invalid BPM
			if(isNaN(num.value))
			{
				//add invalid input message if not already present
				if(!document.getElementById("HEY_STOP_THAT"))
				{
					var fuk = document.createElement("P");
					fuk.id = "HEY_STOP_THAT";
					fuk.innerHTML = "<br>Invalid BPM";
					fuk.style.color = "#F00";
					fuk.style.margin = "0";
					fuk.style.textAlign = "center";
					box.appendChild(fuk);
				}
				return;
			}
			AddBPMChange(coverTime1, parseInt(num.value));
			box.remove();
		};
	box.appendChild(cha);
	
	//add stylized cancel button to box
	var can = document.createElement("BUTTON");
	can.id = "LOL";
	can.innerHTML = "Cancel";
	can.style.float = "right";
	can.style.fontFamily = "Dynamix";
	can.style.fontSize = ".75cm";
	can.style.color = "#0FF";
	can.style.backgroundColor = "#191919";
	can.style.borderColor = "#0FF";
	can.onclick =
		//delete popup box ignoring input
		function YEETUS_DELETUS()
		{
			var box = document.getElementById("JMAK");
			box.remove();
		};
	box.appendChild(can);
}