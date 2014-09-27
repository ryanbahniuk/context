$(document).ready(function() {
	var $context = $(this).find('#context');

  // Get references to elements on the page.
  var $form = $context.find('#message-form');
  var $messageInput = $context.find('#message');
  var $messages = $context.find('#messages');
  var $socketStatus = $context.find('#status');

  // var socket = new WebSocket('ws://104.131.117.55:8080');
  var socket = new WebSocket('ws://localhost:8080');
  socket.onopen = function(event) {
	  $socketStatus.html("");
	  $socketStatus.addClass('open');
	};

	$form.on("submit", function(e) {
	  e.preventDefault();
	  var url = document.URL.split("?")[1].replace(/url=/,"");
	  // Retrieve the message from the textarea.
	  var message = $messageInput.val();

	  var msg = {};
	  msg.url = url;
	  msg.message = message;
	  // Send the message through the WebSocket.
	  socket.send(JSON.stringify(msg));

	  // Clear out the message field.
	  $messageInput.val("");

	  return false;
	});

	socket.onmessage = function(event) {
	  var message = event.data;
	  $messages.append('<li class="received"><span>Received:</span>' + message + '</li>');
	};

	// Show a disconnected message when the WebSocket is closed.
	socket.onclose = function(event) {
	  $socketStatus.html('Connection Closed');
	  $socketStatus.removeClass('open');
	  $socketStatus.addClass('closed');
	};
});