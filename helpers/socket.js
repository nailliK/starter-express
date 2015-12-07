module.exports = function(server){
	var io = require('socket.io')(server),
		coords = {},
		clients = [];
		
	io.on('connection', function(conn) {
		// add client to clients array
		clients.push(conn);
		
		// set initial coordinates for client
		coords[conn.id] = { x : 0, y : 0, t : Date.now() };

		// receive information
		conn.on('coords', function(n) {
			// remove old coordinates
			for (var c in coords) {
				if ( coords[c].t + 5000 < Date.now() ) {
					delete coords[c];
				}
			}
			
			// set new coordinates for client
			coords[conn.id] = n;

			// loop through connected clients
			for (var c in clients) {
				if (clients[c] !== undefined) {
					// broadcast to client
					clients[c].emit('coords', coords);
				} else {
					// garbage collection
					delete clients[c];
				}
			}
		});
	});
	
	// disconnect
	io.on('disconnect', function(conn) {
		// delete client coordinates
		delete coords[conn.id];
		
		// delete client from array
		delete clients[conn];
	});

	io.on('error', function(err){
		throw err;
	});

	return io;
};