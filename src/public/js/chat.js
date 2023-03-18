var socket = io();
var messages = document.getElementById("messages");
const chat = document.getElementById("form");
const inputField = document.getElementById("message");

socket.on("bot-message", (data) => {
  let li = document.createElement("li");
  let span = document.createElement("span");
  let h1 = document.createElement('h1')
  var messages = document.getElementById("messages");
  if (Array.isArray(data.text)) {
    data.text.forEach((items) => {
      var x = document.createElement("LI");
      var t = document.createTextNode(items);
      x.appendChild(t);
      messages.appendChild(x);
    });
    return
  }
  messages.appendChild(li).append(data.text)
  console.log(data);
  
  messages.appendChild(span).append(`By ${data.username} at ${data.time}`);
});

chat.addEventListener("submit", (e) => {
  e.preventDefault();

  let Msg = e.target.elements.message.value;

  let message = Msg.trim();

  if (!message) {
    alert("Input shouldn't be empty");
    return;
  }

  if (message !== "") {
    socket.emit("chat-message", message);

    e.target.elements.message.value = "";
    e.target.elements.message.focus();
  }
});
