function result()
{
	let correct=0;
	let poz;
	let quest1=document.kviz.question1.value;
	let quest2=document.kviz.question2.value;
	let quest3=document.kviz.question3.value;
	let quest4=document.kviz.question4.value;
	let quest5=document.kviz.question5.value;
	let quest6=document.kviz.question6.value;
	if (quest1=="Mikasa Ackermann")
		correct++;
	if (quest2=="Bertholdt Hoover")
		correct++;
	if (quest3=="Reiner Braun")
		correct++;
	if (quest4=="25")
		correct++;
	if (quest5=="Colossal Titan,Armored Titan")
		correct++;
	if (quest6=="Levi")
		correct++;
	let niz=["[Odlično ste rješili ovaj kviz!!!]","Sasvim okej :)))))","[Jesi li ti možda Titan?]"];
	let slike=["./img/svetocnokviz.gif","./img/okay.gif","./img/193m.gif"]
	if(correct<=2)
		poz=2;
	if(correct==3 || correct==4)
		poz=1;
	if(correct==5 || correct==6)
		poz=0;
		
	document.getElementById("message").innerHTML=niz[poz];
	document.getElementById("correct").innerHTML="Imate "+correct+"/6 "+"Odgovora!";
	document.getElementById("slike").src=slike[poz];
	document.getElementById("btn-nestani").innerHTML = "";
	

}