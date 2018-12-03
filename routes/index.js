var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var apiRouter = require('./api');

const userController = require('../controllers/userController');

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: true}));
  app.use('/api', apiRouter);
  
  app.get('/', function(req, res) {
    res.render('index', {layout: 'layouts/layout.hbs', title: 'Login'});
  });
  
  app.get('/register', function(req, res) {
    res.render('register', {layout: 'layouts/layout.hbs', title: 'Register'});
  });

  app.get('/dashboard', function(req, res) {
    res.render('admin/dashboard', {layout: 'layouts/admin.hbs', title: 'Admin Dashboard'});
  });

  app.get('/logout', userController.logout);

  app.post('/register', userController.register);
  app.post('/login', userController.login);
}
