// Copyright 2017 Google Inc. All Rights Reserved.
// You may study, modify, and use this example for any purpose.
// Note that this example is provided "as is", WITHOUT WARRANTY
// of any kind either expressed or implied.

var adsController;
var showAd = false;

/**
 * Initialize the Outstream SDK.
 */
 (function(){
window.loadAds = function () {
    var outstreamContainer = document.getElementById('outstreamContainer');
    if (!outstreamContainer) {
        outstreamContainer = document.createElement('DIV');
        outstreamContainer.id = 'outstreamContainer';
    }
	showAd = true;
    adsController = new google.outstream.AdsController(
            outstreamContainer,
            window.onAdLoaded,
            window.onDone);
            
	//window.requestAds(true);    
};


/**
 * Request ad. Must be invoked by a user action for mobile devices.
 */
window.requestAds = function (show) {
    try{
		showAd = show;	
		adsController.initialize();

		// Request ads
		var adTagUrl ='http://googleads.g.doubleclick.net/pagead/ads?ad_type=video_text_image&client=ca-games-pub-4377015788249591&description_url=http%3A%2F%2Fm.blackmoondev.com%2FFveggirabbit%2F&channel=7034738610&videoad_start_delay=0&hl=pl&max_ad_duration=15000';
		adTagUrl = window.afgID;
		adsController.requestAds(adTagUrl);
	}catch(e){
		window.showingAd = 0;
		window.hideAd();
		window.secondsLeft = 0;
		window.afgError=1;
	}
};

/**
 * Allow resizing of the current ad.
 */
window.resizeAd = function(newWidth, newHeight) {
	try{
		adsController.resize(newWidth, newHeight);
	}catch(e){
		window.showingAd = 0;
		window.hideAd();
		window.secondsLeft = 0;	
		window.afgError=1;			
	}
};

/*
 * Callback for when ad has completed loading.
 */
window.onAdLoaded = function() {
    // Play ad
    //document.getElementById('playAd').disabled = false;
    //console.log("onAdLoaded");
	if (showAd) {
        window.playAd();
    }
	
};

/*
 * Callback for when ad has completed playback.
 */
window.onDone = function() {
    // Show content
	//console.log("onDone");
	window.afgError=0;
	if(window.secondsLeft>8){
	
		//iosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;			
		iosDevice = false;			
			//iOS = true;
		if(iosDevice){
		 // some code..
		
			var Appnext = {
				  android_id: 'a3ddf53d-4ec7-43f7-8f18-835b78f20f91',
				  ios_id: '2709436f-1b3a-4512-8a31-04660906f778',
				   cat: '',
				   pbk: '',
				   b_title: '',
				   b_color: '',
				   mute: '',
				   timeout: '7',
				   times_to_show: '',
				   times_to_show_reset: '',
				   creative:'static', 
				   subid: '',
				   ad_server:'false'
				 };
				 
				Appnext.android_id = window.apnID1;
				Appnext.ios_id = window.apnID2;
				
				window.showAppnextAd('static');
				window.secondsLeft=6;
		}else
			window.hideAd();
	}else
		window.hideAd();
};

/*
 * Playback video ad
 */
window.playAd = function() {
    adsController.showAd();
    showAd = false;
	window.afgError=-1;
};

})();
