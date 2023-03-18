const express = require("express");
const http = require("http");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const { menu, command } = require("./utils/menu");
const formatmessage = require("./utils/messages");
require("dotenv").config();

const { config } = require("./config/config");
const Port = config.PORT;

const Helper = require("./utils/helper");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cors());

const sessionSecret = config.SESSION_SECRET;
const sessionMiddleWare = session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
});

app.use(sessionMiddleWare);
io.use((socket, next) => {
  return sessionMiddleWare(socket.request, socket.request.res, next);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  const botName = config.BOTNAME;
  const orders = [];
  let switchExecuted = false;

  const botMessage = (message) => {
    socket.emit("bot-message", formatmessage(botName, message));
  };

  botMessage(`Hello there!, Welcome to ${botName}.'What is you Name?`);

  socket.request.session.currentOrder = [];
  let username = "";
  let menuOption = "";
  let formats = Helper.format(command);

  socket.on("chat-message", (msg) => {
    if (!username) {
      username = msg;
      io.emit("bot-message", formatmessage(username, msg));
      botMessage(`welcome ${username}`);
      botMessage(formats);
    } else {
      io.emit("bot-message", formatmessage(username, msg));
      switch (msg) {
        case "1":
          const option = Helper.formatMenu(menu);
          botMessage("Select from the following");
          botMessage(option);
          switchExecuted = true;
          break;
        case "2":
        case "3":
        case "4":
        case "5":
          if (switchExecuted === false) {
            botMessage("Press 1 to see menu options.");
          } else {
            const userInput = Number(msg);
            const options = menu.find((item) => item.number === userInput);
            if (options) {
              socket.request.session.currentOrder.push(options);
              botMessage(
                `${options.food} has been put in your shopping cart..Do you wish to add to your shopping cart? Press 1 to make a new Order ,press 98 to checkout Order,Press 9 to see mainmenu`
              );
              botMessage(Helper.formatMenu(menu));
            } else {
              botMessage("Invalid Input.");
            }
          }
          break;
        case "9": {
          const option = Helper.formatMenu(menu);
          botMessage(option);
          break;
        }
        case "97":
          if (socket.request.session.currentOrder.length === 0) {
            botMessage("Cart is empty. Please place an order in the cart.");
          } else {
            const currentOrder = socket.request.session.currentOrder
              .map((item) => item.food)
              .join(", ");
            botMessage(`Your current order(s):${currentOrder}`);
          }
          break;
        case "98":
          if (!orders.length) {
            botMessage(
              "Your order history is empty . Kindly place an order now..."
            );
          } else {
            const orderHistory = orders
              .map(
                (order, index) =>
                  `Order ${index + 1}: ${order.food} ${order.price}`
              )
              .join("\n");
            botMessage(`Your order history:` + orderHistory);
            console.log(orderHistory);
          }
          break;
        case "99":
          if (socket.request.session.currentOrder.length === 0) {
            botMessage(
              "Orders cannot be placed with an empty cart . Press 1 to see the mainmenu"
            );
          } else {
            orders.push(...socket.request.session.currentOrder);
            botMessage("Order placed");
            socket.request.session.currentOrder = [];
          }
          break;
        case "0":
          if (socket.request.session.currentOrder.length === 0) {
            botMessage(" Cart empty! No order to cancel.");
          } else {
            socket.request.session.currentOrder = [];
            botMessage(
              "Order cancelled! You can still place an order.Press 1 to see menu"
            );
          }
          break;
        default:
          botMessage("Invalid selection. Please try again ");
          botMessage(formats);
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
