'use strict';
const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');


var mailer = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    //secure: true,
    auth: {
      user: process.env.MAILER_AUTH_USER,
      pass: process.env.MAILER_AUTH_PASSWORD
    }
  });
  
  mailer.use('compile',hbs({
    viewPath: '../views/email',
    extName: '.hbs'
  }));

return mailer;