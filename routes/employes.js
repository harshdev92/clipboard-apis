const express = require('express');
const winston = require('winston');
const { validate } = require('../validations/employee');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncMiddleWare = require('../middleware/async');
const sqlite3 = require('sqlite3').verbose();   


router.post('/',auth, asyncMiddleWare(async (req, res) => {  
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
}));


router.get('/', auth, asyncMiddleWare(async (req, res) => {
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
}));


router.delete('/:id', auth, asyncMiddleWare(async (req, res) => {
    let db = new sqlite3.Database('./employees.sqlite3', (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Connected to the employee database.');
    });

    db.run(`DELETE FROM employees WHERE id = ?`, [req.params.id], function(err) {
        if (err) {
            return winston.error(err.message);
        }
        res.send(`Row(s) deleted ${this.changes}`);
    });

    // close the database connection
    db.close((err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Close the database connection.');
    });
}));


router.get('/salaries',auth, asyncMiddleWare(async (req, res) => {
    let db = new sqlite3.Database('./employees.sqlite3', (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Connected to the employee database.');
    });

    db.all(`SELECT AVG(salary) AS mean, MAX(salary) AS max, MIN(salary) AS min FROM employees`, [], (err, rows) => {
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
}));


router.get('/salaries/:department',auth, asyncMiddleWare(async (req, res) => {
    let db = new sqlite3.Database('./employees.sqlite3', (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Connected to the employee database.');
    });

    db.all(`SELECT AVG(salary) AS mean, MAX(salary) AS max, MIN(salary) AS min FROM employees WHERE department = ?`, [req.params.department], (err, rows) => {
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

}));


router.get('/contractsalaries',auth, asyncMiddleWare(async (req, res) => {
    let db = new sqlite3.Database('./employees.sqlite3', (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Connected to the employee database.');
    });

  db.all(`SELECT AVG(salary) AS mean, MAX(salary) AS max, MIN(salary) AS min FROM employees WHERE on_contract = 'true'`, [], (err, rows) => {
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

}));


router.get('/salaries/:department/:subdepartment', auth,asyncMiddleWare(async (req, res) => {
    let db = new sqlite3.Database('./employees.sqlite3', (err) => {
        if (err) {
            winston.error(err.message);
        }
        winston.info('Connected to the employee database.');
    });

    db.all(`SELECT AVG(salary) AS mean, MAX(salary) AS max, MIN(salary) AS min FROM employees WHERE department = ? AND sub_department = ?`, [req.params.department, req.params.subdepartment], (err, rows) => {
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

}));
    
module.exports = router;



