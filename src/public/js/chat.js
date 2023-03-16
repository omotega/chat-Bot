var socket = io("ws://localhost:5750");
var messages = document.getElementById("messages");
const chat = document.getElementById('form');
const inputField = document.getElementById('message');

socket.on('bot-message', function (msg) {
  // console.log(msg);
  handleMessage(msg);
  message.scrollTop = message.scrollHeight;
});

const handleMessage = (msg) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
<p class="user">${msg.user} <span>${msg.time}</span></p>
<p class="text">${msg.message}</p>
`;
  //append the div to the messages div
  message.appendChild(div);
};

// Message submit
chat.addEventListener('submit', (e) => {
  e.preventDefault();

  let Msg = e.target.elements.inputMessage.value;

  let message = Msg.trim();

  if (!message) {
        alert('Input shouldnt be empty');
        return;
  }

  if (message !== '') {
        //sending Message to the Server
        socket.emit('chat-message', message);
        // Clear input
        e.target.elements.inputMessage.value = '';
        e.target.elements.inputMessage.focus();
  }
});



