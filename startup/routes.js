const express = require('express');
const employees = require('../routes/employes');
const error = require('../middleware/error');
const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/employees', employees);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error);
}