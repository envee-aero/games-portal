(function(){
window.showingAd = 1;
window.adShowCount = 0;
window.callTimesPerAdShow=5;
window.afgError=0;
window.updateTimeLeftText = function() {
	window.secondsLeft = Math.max(-3,window.secondsLeft - 1);			
	/*var t = "<b>Advertisement ends in "+window.secondsLeft.toString()+"...</b>";
	document.getElementById("timeMsg").innerHTML = t;
	*/
	if(secondsLeft<=0){
		/*t = "<b>Click to continue</b>";
		document.getElementById("timeMsg").innerHTML = t;
		//$("#timeMsg").disable(false);
		document.getElementById("timeMsg").removeAttribute("disabled");
		//hideAd();*/
	}if(secondsLeft<=-3){
		if(window.afgError!=-1){
			clearInterval(window.intervalID);
			console.log("hideAd0");	
			window.hideAd();
		}
	}
};
window.showAd2 = function(){
		//$('#ad2').css({'margin-top':'-150px'});	
		var w = jQuery(window).width();	
		var h = jQuery(window).height();
		console.log("showAd3");		
		console.log("h: " +h.toString());		
		var left = (w/2) - (320/2);	
		var top = 80;	
		window.resizeAd(w,h*0.9);		
		/*$('#ad').css({'display':'none'});

		$('#ad2').css({'margin-top':h/2-150+'px', 'top': '0px', 'left': '0px', 'align':'center'});	*/
};

window.hideAd = function(){		
	//window.showingAd = 0;
	
	window.showingAd=0;
	/*$('#ad2').css({'display':'none'});
	$('#timeMsg').css({'display':'none'});*/
	$('#outstreamContainer').css({'display':'none'});
	$('#c2canvasdiv').css({'display':''});
};

window.showAd3 = function(){
	/*console.log("showAd1");	
	$('#ad').css({'display':'inline-block'});		
	var ad = $("#ad").html()
	var buttonCont = document.getElementById("buttonCont");   // Get the <ul> element with id="myList"
	var adElement = document.getElementById("ad");   // Get the <ul> element with id="myList"
	$("#ad2").html(ad);				
	if(buttonCont != null)
		adElement.removeChild(buttonCont); 
	*/
	$('#outstreamContainer').css({'display':''});
	window.requestAds(true);
	console.log("showAd2");		
};

window.showNewAd = function(){

	console.log("showNewAd1");		
	if(window.adShowCount>0 && ((window.adShowCount%window.callTimesPerAdShow)!=0)){
		window.adShowCount++;

		return;
	}
	
	window.adShowCount++;
	console.log("showNewAd2");
	console.log("afgID: " + window.afgID);
	console.log("apnID1: " + window.apnID1);
	console.log("apnID2: " + window.apnID2);
	
	
	window.secondsLeft = 15;
	window.showingAd = 1;
	//var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	//var iOS = true;
	if(iosDevice)
		window.secondsLeft = 9;
	if(window.addsCount===0){
		console.log("showNewAd3");	
		/*var ad2Div = document.getElementById("ad2");   // Get the <ul> element with id="myList"
		if(ad2Div != null)
			document.body.removeChild(ad2Div); 
		var adn = document.createElement("div");				
		var att = document.createAttribute("id");       // Create a "class" attribute
		att.value = "ad2";                           // Set the value of the class attribute
		adn.setAttributeNode(att); 
		att = document.createAttribute("align");       // Create a "class" attribute
		att.value = "center";                           // Set the value of the class attribute
		adn.setAttributeNode(att); 
		document.body.appendChild(adn);	*/
		if(!iosDevice)
			window.showAd3();	
	}else{		
		console.log("showNewAd4");	
		/*$('#ad2').css({'display':'block'});	
		var t = "<b>Advertisement ends in "+window.secondsLeft.toString()+"...</b>";
		document.getElementById("timeMsg").innerHTML = t;
		var dis = document.createAttribute("disabled");
		document.getElementById("timeMsg").setAttributeNode(dis);		
		//$("#timeMsg").disable(true);*/
		if(!iosDevice)
			window.showAd3();
	}
	if(!iosDevice)
		showAd2();
	else{
	
		
	}
	
	console.log("showNewAd5");	
	clearInterval(window.intervalID);
	window.intervalID = setInterval(function(){ window.updateTimeLeftText() }, 1000);					
	
	$('#c2canvasdiv').css({'display':'none'});
	//document.getElementById("timeMsg").removeAttribute("display");
	//$('#timeMsg').css({'display':'block'});
	//$('#timeMsg').css({'display':'inline','margin-top':'50','text-align':'center','align':'center'});
	window.addsCount+=1;
};
})();