const dotenv = require('dotenv');
dotenv.config();


exports.config = {
    
    PORT:process.env.PORT,
    SESSION_SECRET:process.env.SESSION_SECRET,
    BOTNAME : process.env.BOTNAME
}
