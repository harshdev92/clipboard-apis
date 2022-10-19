const express = require('express');
const winston = require('winston');
const { validate } = require('../validations/employee');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();   

router.post('/', async (req, res) => {  
    const { error } = validate(req.body); // result.error
    if (error) return res.status(400).send(error.details[0].message);

    let db = new sqlite3.Database('./db.sqlite3', (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Connected to the employee database.');
    });

    
    db.run(`CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`, (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Created table employees');
    });


    let sql = `INSERT INTO employees (name) VALUES(?)`;
    db.run(sql, [req.body.name], function(err) {
        if (err) {
            return winston.error(err.message);
        }
        winston.info(`A row has been inserted with rowid ${this.lastID}`);
    });

    db.close();
    res.send(req.body);

});


router.get('/', async (req, res) => {
    let db = new sqlite3.Database('./db.sqlite3', (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Connected to the employee database.');
    });

    db.all(`SELECT * FROM employees`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });

    db.close();
});


    
module.exports = router;



