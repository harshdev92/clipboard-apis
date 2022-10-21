const request = require('supertest');
const jsonwebtoken = require('jsonwebtoken');
const config = require('config');
const sqlite3 = require('sqlite3').verbose();
const winston = require('winston');

async function clean () {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database('./employees.sqlite3', (err) => {
      if (err) {
          winston.error(err.message);
          reject(err)
          
      }
      winston.info('new Connected to the employee database.');
    });

    db.run(`DELETE FROM employees WHERE id=(SELECT max(id) FROM employees);    `, [], function(err) {
      if (err) {  
           winston.error(err.message);
          reject(err)
      }
      winston.info(`new Row(s) deleted ${this.changes}`);

      db.close((err) => {
        if (err) {
            winston.error(err.message);
            reject(err)
        }
        winston.info('new Close the database connection.');
        resolve()
    });
  });

  });
}


describe('auth middleware', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await server.close(); 
  });


  let token; 

  const exec = () => {
    return request(server)
      .post('/api/employees')
      .set('x-auth-token', token)
      .send({ name: 'victornew', salary: '1234', currency: 'test', department: 'test', sub_department: 'test' });
  }

  beforeEach(() => {
    const user = { 
        id: 1
      };
  
     token = jsonwebtoken.sign(user, config.get('jwtPrivateKey'));
  });

  it('should return 401 if no token is provided', async () => {
    token = ''; 

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a'; 

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
    return clean();
  });
});