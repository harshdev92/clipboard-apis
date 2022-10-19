const express = require('express');
const winston = require('winston');
const { validate } = require('../validations/employee');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();   

router.post('/', async (req, res) => {  
    const { error } = validate(req.body); // result.error
    if (error) return res.status(400).send(error.details[0].message);

    let db = new sqlite3.Database('./employees.sqlite3', (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Connected to the employee database.');
    });

    
    db.run(`CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, salary TEXT, currency TEXT, department TEXT, sub_department TEXT, on_contract TEXT )`, (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Created table employees');
    });


    let sql = `INSERT INTO employees(name, salary, currency, department, on_contract, sub_department) VALUES(?,?,?,?,?,?)`;
    
    db.run(sql, [req.body.name, req.body.salary, req.body.currency, req.body.department, req.body.on_contract, req.body.sub_department], function(err) {
        if (err) {
            return winston.error(err.message);
        }
        // get the last insert id
        res.send(`A row has been inserted with rowid ${this.lastID}`);
        winston.info(`A row has been inserted with rowid ${this.lastID}`);
    });
    

    // close the database connection
    db.close((err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Close the database connection.');
    });
});


router.get('/', async (req, res) => {
    let db = new sqlite3.Database('./employees.sqlite3', (err) => {
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

     // close the database connection
    db.close((err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Close the database connection.');
    });
});


    
module.exports = router;



