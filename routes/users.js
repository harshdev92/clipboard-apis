const express = require('express');
const winston = require('winston');
const bcrypt = require('bcrypt');
const { validate } = require('../validations/user');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();   


router.post('/', async (req, res) => {  
    const { error } = validate(req.body); // result.error
    if (error) return res.status(400).send(error.details[0].message);

    let db = new sqlite3.Database('./users.sqlite3', (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Connected to the user database.');
    });

   db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT, isAdmin TEXT )`, (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Created table users');
    });

    //check user exist
    db.get(`SELECT * FROM users WHERE email = ?`, [req.body.email], (err, row) => {
        if (err) {
            throw err;
        }
        if (row) {
            return res.status(400).send('User already registered.');
        } else {
            let sql = `INSERT INTO users(name, email, password, isAdmin) VALUES(?,?,?,?)`;
            const salt = bcrypt.genSalt(10);
            let passwrod = bcrypt.hash(req.body.password, salt);
            db.run(sql, [req.body.name, req.body.email, passwrod, req.body.isAdmin], function(err) {
                if (err) {
                    return winston.error(err.message);
                }
                // get the last insert id
                res.send(`A row has been inserted with rowid ${this.lastID}`);
                winston.info(`A row has been inserted with rowid ${this.lastID}`);
            }
            );
        }
    });

 

    // close the database connection
    db.close((err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Close the database connection.');
    }
    );  
});


module.exports = router;

