window.onload = function() {

  // Get references to elements on the page.
  var form = document.getElementById('message-form');
  var messageField = document.getElementById('message');
  var messagesList = document.getElementById('messages');
  var socketStatus = document.getElementById('status');
  var closeBtn = document.getElementById('close');

  var socket = new WebSocket('ws://localhost:8080');
  // var socket = new WebSocket('ws://104.131.117.55:8080');

  socket.onopen = function(event) {
	  socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.UdRL;
	  socketStatus.className = 'open';
	};

	form.onsubmit = function(e) {
	  e.preventDefault();

	  // Retrieve the message from the textarea.
	  var message = messageField.value;
	  // Send the message through the WebSocket.
	  socket.send(message);

	  // Add the message to the messages list.
	  messagesList.innerHTML += '<li class="sent"><span>Sent:</span>' + message +
	                            '</li>';

	  // Clear out the message field.
	  messageField.value = '';

	  return false;
	};

	socket.onmessage = function(event) {
	  var message = event.data;
	  messagesList.innerHTML += '<li class="received"><span>Received:</span>' +
	                             message + '</li>';
	};

	// Show a disconnected message when the WebSocket is closed.
	socket.onclose = function(event) {
	  socketStatus.innerHTML = 'Disconnected from WebSocket.';
	  socketStatus.className = 'closed';
	};

	// Close the WebSocket connection when the close button is clicked.
	closeBtn.onclick = function(e) {
	  e.preventDefault();

	  // Close the WebSocket.
	  socket.close();

	  return false;
	};

};