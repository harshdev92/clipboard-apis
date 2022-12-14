const express = require('express');
const winston = require('winston');
const bcrypt = require('bcrypt');
const { validate } = require('../validations/user');
const router = express.Router();
const jsonwebtoken = require('jsonwebtoken');
const config = require('config');
const sqlite3 = require('sqlite3').verbose();   
const asyncMiddleWare = require('../middleware/async');


router.get('/me', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');
    try {
        const decoded = jsonwebtoken.verify(token, config.get('jwtPrivateKey'));
        const db = new sqlite3.Database('./users.sqlite3');
        db.get('SELECT * FROM users WHERE id = ?', decoded.id, (err, row) => {
            if (err) {
                winston.error(err.message);
                return res.status(500).send('Internal Server Error');
            }
            if (!row) return res.status(400).send('Invalid token.');
            res.send(row);
        });
        db.close();
    }
    catch (ex) {
        res.status(400).send('Invalid token.');
    }
});



router.post('/', asyncMiddleWare(async (req, res) => {  
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
            return res.status(500).send('Internal Server Error');
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
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            db.run(sql, [req.body.name, req.body.email, hash, req.body.isAdmin], function(err) {
                if (err) {
                    winston.error(err.message);
                    return res.status(500).send('Internal Server Error');
                }
                const token = jsonwebtoken.sign({id: this.lastID, isAdmin: req.body.isAdmin}, config.get('jwtPrivateKey'));

                res.header('x-auth-token', token).send({id: this.lastID, name: req.body.name, email: req.body.email, isAdmin: req.body.isAdmin});
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
}));


module.exports = router;

