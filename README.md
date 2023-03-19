# chat-Bot


## Getting Started

This is a chatbot for a restaurant that allows users to place an order, cancel order, check their order history(current or old), and saves their session and chat history. The chatbot is built using Node.js and Socket.IO


### Requirements
1. When a customer lands on the chatbot page, the bot should send these options to the customer:
a. Select 1 to Place an order
b. Select 99 to checkout order
c. Select 98 to see order history
d. Select 97 to see current order
e. Select 0 to cancel order
2. When a customer selects “1”, the bot should return a list of items from the restaurant. It is up to you to create the items in your restaurant for the customer. The order items can have multiple options but the customer should be able to select the preferred items from the list using this same number select system and place an order.
3.  When a customer selects “99” out an order, the bot should respond with “order placed” and if none the bot should respond with “No order to place”. Customer should also see an option to place a new order
4.  When a customer selects “98”, the bot should be able to return all placed order
5.  When a customer selects “97”, the bot should be able to return current order
6.  When a customer selects “0”, the bot should cancel the order if there is.

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   ```sh
   git clone https://github.com/omotega/chat-Bot.git 
   ```
2. Install NPM packages
   ```sh
   yarn install
   ```
3. Enter your API in `config.js`
   ```js
   const SESSION_SECRET = 'ENTER YOUR SESSION SECRET';
   const PORT = 'ENTER YOUR PORT NUMBER';
   const BOTNAME = 'ENTER YOUR BOTNAME';
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Live Link
 
 https://restaurant-chatbot-7qrn.onrender.com/
 
