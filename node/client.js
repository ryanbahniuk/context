var socket = new WebSocket('ws://localhost:8080');

$(document).ready(function(){
	var $sidebar = $('#page-wrapper');
	var $form = $sidebar.find('#message-form');
  var $messageInput = $sidebar.find('#message');
  var $messages = $sidebar.find('#messages');
  var $socketStatus = $sidebar.find('#status');

	socket.onopen = function(event) {
	  $socketStatus.html("");
		$socketStatus.addClass('open');
	};

	$form.on("submit", function(e) {
	  e.preventDefault();
	  var message = $messageInput.val();
	  socket.send(message);

	  $messages.append('<li class="sent"><span>Sent:</span>' + message + '</li>');

	  $messageInput.val("");
	});

	socket.onmessage = function(event) {
	  var message = event.data;
	  $messages.append('<li class="received"><span>Received:</span>' + message + '</li>');
	};

	socket.onclose = function(event) {
	  $socketStatus.html('Connection Closed');
	  $socketStatus.removeClass('open');
	  $socketStatus.addClass('closed');
	};
});
