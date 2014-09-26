var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

wss.on('connection', function(ws) {
	console.log("connection opened");
  ws.send('Welcome!');
	
  ws.on('message', function(message) {
    console.log('received: %s', message);
  	ws.send(message);
  });
});