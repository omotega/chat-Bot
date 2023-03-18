const { command,menu  } = require("./menu");

class Helper {
  
  static format(options) {
    let msg;
    msg = options.map((item) => {
      return `${item.number}:${item.text}`;
    })
    return msg
  }

  static formatMenu(options) {
    let msg = options.map((item) => {
      return `${item.number}:${item.food} ${item.price}`;
    });
    return msg;
  }

}



module.exports = Helper;
