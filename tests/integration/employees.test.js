const request = require('supertest');
const jsonwebtoken = require('jsonwebtoken');
const config = require('config');
const sqlite3 = require('sqlite3').verbose();
const winston = require('winston');

let server;
let token;
let name; 
let id; 



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

  const exec = async () => {
    return await request(server)
      .post('/api/employees')
      .set('x-auth-token', token)
      .send({ name: name, salary: '1234', currency: 'test', department: 'test', sub_department: 'test' });
  }


  const execDelete= async () => {
    return await request(server)
      .post('/api/employees'  + id)
      .set('x-auth-token', token)
      .send({ name: name, salary: '1234', currency: 'test', department: 'test', sub_department: 'test', on_contract: 'true' });
  }


describe('/api/employees', () => {
  beforeEach(() => {
    server = require('../../index'); 
    const user = { 
        id: 1
      };
  
     token = jsonwebtoken.sign(user, config.get('jwtPrivateKey'));
  });    

  afterEach(async () => { 
    await server.close(); 
    // return clean();
  });




  describe('GET /', () => {
    beforeEach(() => {
      name = 'test'; 
       const exec = async () => {
        return await request(server)
          .post('/api/employees')
          .set('x-auth-token', token)
          .send({ name: name, salary: '1234', currency: 'test', department: 'test', sub_department: 'test', on_contract: 'true' });
      }
  
      exec();
  
    });  

    afterEach(async () => { 
      return clean();
    });
  
  
    it('should return all employees', async () => {
      const res = await request(server).get('/api/employees').set('x-auth-token', token);
      expect(res.status).toBe(200);
    });

    it('should return all employees mean,max and min salaries', async () => {
        const res = await request(server).get('/api/employees/salaries').set('x-auth-token', token);
        expect(res.status).toBe(200);
      
      });
    
    it('should return all employees mean,max and min salaries according to department', async () => {
        const res = await request(server).get('/api/employees/salaries/test').set('x-auth-token', token);
        expect(res.status).toBe(200);
    });

    it('should return all contract employees mean,max and min salaries', async () => {
        const res = await request(server).get('/api/employees/contractsalaries').set('x-auth-token', token);
        expect(res.status).toBe(200);   
    });

    it('should return all employees mean,max and min salaries according to department and subdepartment', async () => {
        const res = await request(server).get('/api/employees/salaries/test/test').set('x-auth-token', token);
        expect(res.status).toBe(200); 
    });

  });


  describe('POST /', () => {

    beforeEach(() => {
      name = 'test'; 
    })

    afterEach(async () => { 
      return clean();
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''; 
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if employee is less than 3 characters', async () => {
      name = '12'; 
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if employee is more than 50 characters', async () => {
      name = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should save the employee if it is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
        // return clean();
    });

  });



  // describe('DELETE /:id', () => {
 

  //  afterEach(async () => { 
  //    return clean();
  //  });
 
  //   it('should return 401 if client is not logged in', async () => {
  //     token = ''; 

  //     const res = await execDelete();

  //     expect(res.status).toBe(401);
  //   });


  //   it('should return 400 if id is invalid', async () => {
  //     id = 'test'; 
      
  //     const res = await execDelete();

  //     expect(res.status).toBe(400);
  //   });

  //   // it('should return 404 if no employee with the given id was found', async () => {
  //   //   id = 1000;
  //   //   const res = await exec();

  //   //   expect(res.status).toBe(404);
  //   // });

  //   // it('should delete the genre if input is valid', async () => {
  //   //   await exec();

  //   //   const genreInDb = await Genre.findById(id);

  //   //   expect(genreInDb).toBeNull();
  //   // });

  //   // it('should return the removed genre', async () => {
  //   //   const res = await exec();

  //   //   expect(res.body).toHaveProperty('_id', genre._id.toHexString());
  //   //   expect(res.body).toHaveProperty('name', genre.name);
  //   // });
  // });  
   
});