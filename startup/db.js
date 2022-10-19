const winston = require('winston');
const sqlite3 = require('sqlite3').verbose();

module.exports = function() {
    let db = new sqlite3.Database('./db.sqlite3', (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Connected to the test database.');
    });

    return db;
}