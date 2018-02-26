var socket = new WebSocket("ws://"+location.host+":8000")

var sendButton = document.getElementById('send'),
	input = document.getElementById('text-to-send'),
	screen = document.getElementById('chat-screen')

sendButton.addEventListener('click',function() {
	socket.send(input.value)
	let node = document.createElement('p'),
		container = document.createElement('div')

	node.classList.add('own')
	node.innerText = input.value
	container.appendChild(node)
	screen.appendChild(container)
})

socket.onmessage = function (event) {
	let data = event.data
	let node = document.createElement('p'),
		container = document.createElement('div')

	node.innerText = data
	container.appendChild(node)
	screen.appendChild(container)
}