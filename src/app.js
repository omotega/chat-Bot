const express = require("express");
const http = require("http");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { menu,command } = require("./utils/menu");
const formatmessage  = require("./utils/messages");
require("dotenv").config();

const  { config } = require("./config/config");
const Port = config.PORT;

const Helper = require('./utils/helper')



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
    `Hello there!, Welcome to ${botName}.. What is you Name?`
  );

  socket.request.session.currentOrder = [];
  let username = "";
  let menuOption = "";
  let formats = Helper.format(command);

  socket.on("chat-message", (msg) => {
    console.log(msg);
    if (!username) {
      username = msg;
      io.emit("bot-message", formatmessage(username, msg));
      botMessage(`welcome ${username}`);
      botMessage(formats);
    } else {
      io.emit("bot-message", formatmessage(username, msg));
      switch (msg) {
        case "1":
          const options = Helper.formatMenu(menu)

          botMessage(options);
          
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
            const options = menu.find((item) => item.number === userInput);
            if (options) {
              socket.request.session.currentOrder.push(options);
              botMessage(
                `${options.food}</b> has been put in your shopping cart..Do you wish to add to your shopping cart? if so, please respond with the corresponding number. <ul>${menuOption}</ul> <br /><br />If not, <b>hit 97</b> to view the items in your cart or <b>99</b> to check out your order.`
              );
            } else {
              botMessage("Invalid Input.");
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
              `Your current order(s):${currentOrderText}`
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
