/*Handle requests from background*/
function handleRequest(request, sender, sendResponse) {
	if (request.callFunction == "toggleSidebar") {
		toggleSidebar();
	}
}
chrome.extension.onRequest.addListener(handleRequest);

function toggleSidebar() {
	var id = 'context-sidebar';

	if ($('body').find('#' + id).length === 0) {
		var iframeSource = chrome.extension.getURL('index.html') + "?url=" + document.URL;
		var $sidebar = $('<iframe id="' + id + '" src="' + iframeSource + '"></iframe>');

		adjustBodyPosition('open');
		$('body').prepend($sidebar);
	} else {
		adjustBodyPosition('close');
		$('#' + id).remove();
	}
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
			$body.css("margin-right", "0");
		}
	}
}