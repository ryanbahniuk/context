/*Handle requests from background*/
function handleRequest(request, sender, sendResponse) {
	if (request.callFunction == "toggleSidebar") toggleSidebar();
}
chrome.extension.onRequest.addListener(handleRequest);

function toggleSidebar() {
	var id = 'context-sidebar';

	if ($('body').find('#' + id).length === 0) {
		var $sidebar = $('<div id="' + id + '"></div>');
		$sidebar.html("<h1>Hello World</h1>");
		$('body').css("margin-right", "350px");
		$('body').prepend($sidebar);
	} else {
		$('body').css("margin-right", "0");
		$('#' + id).remove();
	}
}