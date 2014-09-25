/*Handle requests from background*/
function handleRequest(request, sender, sendResponse) {
	if (request.callFunction == "toggleSidebar") {
		toggleSidebar();
		loadChat();
	}
}
chrome.extension.onRequest.addListener(handleRequest);

function toggleSidebar() {
	var id = 'context-sidebar';

	if ($('body').find('#' + id).length === 0) {
		var $sidebar = $('<div id="' + id + '"></div>');

		var $chat = $('<h1>Context</h1><div id="status">Connecting...</div><ul id="messages"></ul><form id="message-form" action="#" method="post"><textarea id="message" placeholder="Write your message here..." required></textarea><button type="submit">Send Message</button></form>');
		$sidebar.html($chat);
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