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
	var id = 'iframe-wrapper-436f6e74657874';

	if ($('body').find('#' + id).length === 0) {
		var iframeSource = chrome.extension.getURL('index.html') + "?url=" + document.URL;
		var sidebar = '<iframe id="sidebar-436f6e74657874" src="' + iframeSource + '"></iframe>';
		var minimizeImage = '<img src="' + chrome.extension.getURL('icons/right.png') + '">'
		var $wrapper = $('<div id="iframe-wrapper-436f6e74657874"><div id="minimize-button-436f6e74657874">' + minimizeImage + '</div>' + sidebar + '</div>');
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

$(document).on("click", "#minimize-button-436f6e74657874", function() {
	if(open === true) {
		$(this).find('img').attr("src", chrome.extension.getURL('icons/left.png'));
		$(this).parent().css("width", "0px");
		open = false;
		adjustBodyPosition("close");
	}
	else {
		$(this).find('img').attr("src", chrome.extension.getURL('icons/right.png'));
		$(this).parent().css("width", "350px");
		open = true;
		adjustBodyPosition("open");
	}
});
