var socket = io("ws://localhost:5750");
var messages = document.getElementById("messages");
const chat = document.getElementById('form');
const inputField = document.getElementById('message');


socket.on("bot-message", data => {
  console.log(data,'this is data')
  let li = document.createElement("li");
  let span = document.createElement("span");
  var messages = document.getElementById("messages");
  messages.appendChild(li).append(data);
  console.log(messages)
  messages.appendChild(span).append(`By ${data.username} at ${data.time}`);
});


chat.addEventListener('submit', (e) => {
  e.preventDefault();

  let Msg = e.target.elements.inputMessage.value;

  let message = Msg.trim();

  if (!message) {
        alert('Input shouldnt be empty');
        return;
  }

  if (message !== '') {
        
        socket.emit('chat-message', message);
      
        e.target.elements.inputMessage.value = '';
        e.target.elements.inputMessage.focus();
  }
});



