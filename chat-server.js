var net = require('net'),
	crypto = require('crypto')

var sockets = []//socket-list

var server = net.Server(function(socket) {
	sockets.push(socket)//push socket to the socket-list
	console.log('new socket')
	socket.firstTime = true

	socket.on('data',function(data) {
		if (socket.firstTime) {
			//extract the client´s key from the headers
			let key = data.toString().split('Sec-WebSocket-Key: ')[1].split('\r\n')[0]
			
			//create the hash based on the client´s key
			var sha1 = crypto.createHash('sha1')
			sha1.update( key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11' )
			var acceptKey = sha1.digest('base64')
			
			//create the response headers
			var response = 'HTTP/1.1 101 Switching Protocols\r\n' +
						   'Upgrade: websocket\r\n' +
						   'Connection: Upgrade\r\n' +
						   'Sec-WebSocket-Accept: ' + acceptKey + '\r\n\r\n'
			
			//write the response headers
			socket.write(response,'ascii',function(error) {
				if (error) {
					console.log(error)
				}
			})

			socket.firstTime = false
			return
		}

		//write message to all the other connected sockets
		for (var i = 0; i < sockets.length; i++) {
			//exclude the current socket
			if (sockets[i] !== socket){
				sockets[i].write(data)
			}
		}
	})

	socket.on('end',function() {
		//delete this socket from the socket list
		let index = sockets.indexOf(socket)
		sockets[index] = sockets[ sockets.length - 1 ]
		sockets[ sockets.length - 1 ] = null
		delete sockets[ sockets.length - 1 ]
		sockets.length--
	})
})

server.listen(8000,function() {
	console.log('server open')
})