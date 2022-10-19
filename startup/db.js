const winston = require('winston');
const sqlite3 = require('sqlite3').verbose();

module.exports = function() {    
    let db = new sqlite3.Database('./employees.sqlite3', (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Connected to the employee database.');
    });

    return db;
}