const config = require("./config.js");
module.exports = {
    database: `mongodb://${config.DB_HOST}/${config.DB_NAME}`
};
