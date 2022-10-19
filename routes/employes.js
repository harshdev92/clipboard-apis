const express = require('express');
const { validate } = require('../validations/employee');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();


router.post('/', async (req, res) => {  
    // const { error } = validate(req.body); // result.error
    // if (error) return res.status(400).send(error.details[0].message);

    let db = new sqlite3.Database('./db.sqlite3', (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log('Connected to the test database.');
    });

    
    db.run(`CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`, (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log('Created table test');
    });


    let sql = `INSERT INTO employees (name) VALUES(?)`;
    db.run(sql, [req.body.name], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });

    db.all(`SELECT * FROM employees`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row);
        });
    });


    // close the database connection
    db.close();


    res.send(req.body);

});


    
module.exports = router;



