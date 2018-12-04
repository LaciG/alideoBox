var bodyParser = require('body-parser');
var express = require('express');
require('dotenv').config();

var router = express.Router();

var apiRouter = require('./api');

let authenticateUserCookie = require('./middlewares/authenticateUserCookie');


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

  app.get('/dashboard', authenticateUserCookie, userController.showDashBoard);

  app.get('/logout', userController.logout);

  app.get('/forgotpassword', userController.showForgotPassword);
  app.post('/resetpassword', userController.resetPassword);
  app.get('/resetpassword', userController.showNewPassword);
  app.post('/updatepassword', userController.updatePassword);

  app.post('/register', userController.register);
  app.post('/login', userController.login);
}
