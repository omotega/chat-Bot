const moment = require("moment");

function formatmessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm:a"),
  };
}
function formatArray() {
  
}

module.exports = formatmessage;