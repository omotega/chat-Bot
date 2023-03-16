const dotenv = require('dotenv');
dotenv.config();


exports.config = {
    MONGO_URI:process.env.MONGO_URI,
    PORT:process.env.PORT,
    SESSION_SECRET:process.env.SESSION_SECRET,
    BOTNAME : process.env.BOTNAME
}
