/*Handle requests from background*/
function handleRequest(request, sender, sendResponse) {
	if (request.callFunction == "toggleSidebar") {
		toggleSidebar();
	}
}
chrome.extension.onRequest.addListener(handleRequest);

var open = false;
var windowWidth = $(window).width();

$(window).resize(function(){
	windowWidth = $(window).width();
	if (open === true) {
		adjustBodyPosition('open');
	} else {
		adjustBodyPosition('close');
	}
});

function toggleSidebar() {
	var id = 'iframe-wrapper';
  navigator.geolocation.getCurrentPosition(function(position) {
  	var lat = position.coords.latitude;
  	var lon = position.coords.longitude;
  	chrome.storage.sync.set({msgLat: lat, msgLon: lon, coords: [lat, lon]});
  	console.log(lat);
  	console.log(lon);
  });

	if ($('body').find('#' + id).length === 0) {
		var iframeSource = chrome.extension.getURL('index.html') + "?url=" + document.URL;
		var sidebar = '<iframe id="context-sidebar" src="' + iframeSource + '"></iframe>';
		var minimizeImage = '<img src="' + chrome.extension.getURL('icons/19x19.png') + '">'
		var $wrapper = $('<div id="iframe-wrapper"><div id="minimize-button">' + minimizeImage + '</div>' + sidebar + '</div>');
		adjustBodyPosition('open');
		$('body').prepend($wrapper);
		open = true;
	} else {
		adjustBodyPosition('close');
		$('#' + id).remove();
		open = false;
	};
}

function adjustBodyPosition(command) {
	var $html = $('html');
	var $body = $('body');

	if (command === 'open') {
		$html.css("width", windowWidth - 350 + "px");
	} else if (command === 'close') {
		$html.css("width", windowWidth);
	}
}

$(document).on("click", "#minimize-button", function() {
	if(open === true) {
		$(this).parent().css("width", "0px");
		open = false;
		adjustBodyPosition("close");
	}
	else {
		$(this).parent().css("width", "350px");
		open = true;
		adjustBodyPosition("open");
	}
});
