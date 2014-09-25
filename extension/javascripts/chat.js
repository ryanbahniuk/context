var loadChat = function() {
	var $sidebar = $('#context-sidebar');
  // Get references to elements on the page.
  var $form = $sidebar.find('#message-form');
  var $messageInput = $sidebar.find('#message');
  var $messages = $sidebar.find('#messages');
  var $socketStatus = $sidebar.find('#status');

  var socket = new WebSocket('ws://104.131.117.55:8080');

  socket.onopen = function(event) {
	  $socketStatus.html("");
	  $socketStatus.addClass('open');
	};

	$form.on("submit", function(e) {
	  e.preventDefault();

	  // Retrieve the message from the textarea.
	  var message = $messageInput.val();
	  // Send the message through the WebSocket.
	  socket.send(message);

	  // Add the message to the messages list.
	  $messages.append('<li class="sent"><span>Sent:</span>' + message + '</li>');

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
}