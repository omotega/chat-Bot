const command = [
	{ number: 1, text: "Place An Order" },
	{ number: 99, text: "Checkout Order" },
	{ number: 98, text: "Check Order History" },
	{ number: 97, text: "Check Current Order" },
	{ number: 0, text: "Cancel Order" },
]

const menu = [
  { number: 2, food: "Sausage", price: 'N400' },
  { number: 3, food: "Ice-Cream", price: 'N600' },
  { number: 4, food: "Jollof-Rice and beef", price: 'N1700' },
  { number: 5, food: " Bottle-Water", price: 'N800' },
];

module.exports = {
  menu,
  command,
};
