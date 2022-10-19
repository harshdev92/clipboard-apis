const winston = require('winston');
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();   



require('./startup/logging')();
require('./startup/routes')(app);
// require('./startup/db')();




const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;


// sqlite3.verbose();
// const db = new sqlite3.Database('./db.sqlite3', (err) => {
//     if (err) {
//         winston.error(err.message);
//     }
//     winston.info('Connected to the employee database.');
// }
// );

// db.serialize(() => {
//     db.run(`CREATE TABLE IF NOT EXISTS employees (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         salary INTEGER NOT NULL,
//         currency TEXT NOT NULL,
//         department TEXT NOT NULL,
//         on_contract BOOLEAN NOT NULL,
//         sub_department TEXT NOT NULL
//     )`, (err) => {
//         if (err) {
//             winston.error(err.message);
//         }
//         winston.info('Created table employees');
//     });
// });

// let sql = `INSERT INTO employees(name, salary, currency, department, on_contract, sub_department) VALUES(?,?,?,?,?,?)`;

