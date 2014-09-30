$(document).ready(function() {

var socket = new Websocket('ws://104.131.117.55:8080');
var data = [];

socket.onopen = function() {
  var msg = {vis: true};
  socket.send(JSON.stringify(msg));
}

socket.onmessage = function(e) {
  $("div#coords").
}

});