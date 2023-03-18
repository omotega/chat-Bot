const command = [
	{ number: 1, text: "Place An Order" },
	{ number: 99, text: "Checkout Order" },
	{ number: 98, text: "Check Order History" },
	{ number: 97, text: "Check Current Order" },
	{ number: 0, text: "Cancel Order" },
]

const menu = [
  { number: 2, food: "sausage", price: 400 },
  { number: 3, food: "ice-cream", price: 600 },
  { number: 4, food: "jollof-rice and beef", price: 1700 },
  { number: 5, food: " bottle-water", price: 800 },
];

module.exports = {
  menu,
  command,
};
