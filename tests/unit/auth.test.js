const jsonwebtoken = require('jsonwebtoken');
const config = require('config');

const auth = require('../../middleware/auth');

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = { 
      id: 1
    };

    const token = jsonwebtoken.sign(user, config.get('jwtPrivateKey'));
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const res = {};
    const next = jest.fn();
    
    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});