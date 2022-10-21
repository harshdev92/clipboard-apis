const express = require('express');
const winston = require('winston');
const bcrypt = require('bcrypt');
const Joi = require('joi');
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
        if (!row) {
            return res.status(400).send('Invalid email or password.');
        } else {
            bcrypt.compare(req.body.password, row.password, function(err, result) {
                if (err) {
                    return winston.error(err.message);
                }
                if (result) {
                    res.send('Login successful');
                } else {
                    res.send('Login failed');
                }
            });
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


function validate(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(user);
}

module.exports = router;

