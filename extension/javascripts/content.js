/*Handle requests from background*/
function handleRequest(request, sender, sendResponse) {
	if (request.callFunction == "toggleSidebar") {
		toggleSidebar();
	}
}
chrome.extension.onRequest.addListener(handleRequest);

var open = false;

function toggleSidebar() {
	var id = 'iframe-wrapper';
  navigator.geolocation.getCurrentPosition(function(position) {
  	var lat = position.coords.latitude;
  	var lon = position.coords.longitude;

	if ($('body').find('#' + id).length === 0) {
		var iframeSource = chrome.extension.getURL('index.html') + "?url=" + document.URL + "&lat=" + lat + "&lon=" + lon;
		var sidebar = '<iframe id="context-sidebar" src="' + iframeSource + '"></iframe>';
		var minimizeImage = '<img src="' + chrome.extension.getURL('icons/19x19.png') + '">'
		var $wrapper = $('<div id="iframe-wrapper"><div id="minimize-button">' + minimizeImage + '</div>' + sidebar + '</div>');
		adjustBodyPosition('open');
		$('body').prepend($wrapper);
	} else {
		adjustBodyPosition('close');
		$('#' + id).remove();
	}
  });
}

function adjustBodyPosition(command) {
	var $body = $('body');

	if (command === 'open') {
		if($body.css("position") === "absolute") {
			$body.css("right", "350px");
		} else if($body.css("position") === "relative") {
			$body.css("right", "350px");
		} else if($body.css("width") === ($(window).width() + "px")){
			$body.css("margin-right", "350px");
			$body.css("width", "auto");
		} else {
			$body.css("margin-right", "350px");
		}
	} else if (command === 'close') {
		if($body.css("position") === "absolute") {
			$body.css("right", "0");
		} else if($body.css("position") === "relative") {
			$body.css("right", "0");
		} else if($body.css("width") === "auto"){
			$body.css("margin-right", "0");
			$body.css("width", "100%");
		} else {
			$body.css("margin-right", "auto");
		}
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
