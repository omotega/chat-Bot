const express = require("express");
const http = require("http");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { menu } = require("./utils/menu");
const formatmessage  = require("./utils/messages");
require("dotenv").config();

const  { config } = require("./config/config");
const Port = config.PORT;


// initializing app and socket.io
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "https://localhost:5750",
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

// session-middleware
const sessionMiddleWare = session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
});

app.use(sessionMiddleWare);
io.use((socket, next) => {
  return sessionMiddleWare(socket.request, socket.request.res, next);
});

// run when client connect
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const botName = config.BOTNAME;
  const orders = [];
  let switchExecuted = false;

  const botMessage = (message) => {
    socket.emit("bot-message", formatmessage(botName, message));
  };

  botMessage(
    `Hello there!, <br> Welcome to ${botName}..<br> What is you Name?`
  );

  socket.request.session.currentOrder = [];
  let username = "";
  let menuOption = "";

  socket.on("chat-message", (msg) => {
    if (!username) {
      username = msg;
      io.emit("bot-message", formatmessage(username, msg));
      botMessage(
        `Welcome,<b>${username}</b>. <br /><br />
         <b>press 1</b> To place an order,
        <br />To see your current order, <b> press 97</b>. 
        <br />To see your order history, <b>press 98</b>. 
        <br />To checkout your order, <b>press 99</b>. 
        <br /><b>Press 0</b> to cancel.`
      );
    } else {
      io.emit("bot-message", formatmessage(username, msg));
      switch (msg) {
        case "1":
          menuOption = menu
            .map(
              (item) =>
                `<li> Select<b> ${item.number}</b> for <b>${item.food}</b></li>`
            )
            .join("\n");

          botMessage(
            ` The following is a list of the available items.: <ul>${menuOption}</ul>`
          );
          console.log(menuOption)
          switchExecuted = true;
          break;
        case "2":
        case "3":
        case "4":
        case "5":
          if (switchExecuted === false) {
            botMessage("<b>Press 1 to see menu options.</b>");
          } else {
            const userInput = Number(msg);
            const menu = menu.find((item) => item.id === userInput);
            if (menu) {
              socket.request.session.currentOrder.push(menu);
              botMessage(
                `<b>${menu.food}</b> has been put in your shopping cart.. <br /><br />Do you wish to add to your shopping cart? if so, please respond with the corresponding number. <ul>${menuOption}</ul> <br /><br />If not, <b>hit 97</b> to view the items in your cart or <b>99</b> to check out your order.`
              );
            } else {
              botMessage("<b>Invalid Input.</b>");
            }
          }
          break;
        case "97":
          if (socket.request.session.currentOrder.length === 0) {
            botMessage(
              "Oops!! Cart is empty. Please place an order in the cart."
            );
          } else {
            const currentOrderText = socket.request.session.currentOrder
              .map((item) => item.food)
              .join(", ");
            botMessage(
              `Your current order(s):<br/><br/> <b>${currentOrderText}</b>`
            );
          }
          break;
        case "98":
          if (!orders.length) {
            botMessage(
              "Your order history is empty . Kindly place an order now..."
            );
          } else {
            const orderHistoryText = orders
              .map((order, index) => `Order ${index + 1}: ${order.food}<br/>`)
              .join("\n");

            botMessage(`Your order history: <br/><br/>${orderHistoryText}`);
          }
          break;
        case "99":
          if (socket.request.session.currentOrder.length === 0) {
            botMessage(
              "Oops!!! Orders cannot be placed with an empty cart . Please add to your shopping basket."
            );
          } else {
            orderHistory.push(...socket.request.session.currentOrder);
            botMessage("Order placed!!");
            socket.request.session.currentOrder = [];
          }
          break;
        case "0":
          if (socket.request.session.currentOrder.length === 0) {
            botMessage(" Cart empty! No order to cancel");
          } else {
            socket.request.session.currentOrder = [];
            botMessage(
              "Order cancelled! You can still place an order.<br /><br /> <b> Press 1</b> to see menu \u{1F60A}"
            );
          }
          break;
        default:
          botMessage(
            "Invalid selection. Please try again "
          );
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(Port, () => {
  console.log(`Server listening on port ${Port}`);
});
