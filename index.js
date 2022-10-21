const winston = require('winston');
const express = require('express');
const app = express();
const config = require('config');
if(!config.get("jwtPrivateKey")) {
    winston.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
}

require('./startup/logging')();
require('./startup/routes')(app);




const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;