const jwt = require('jsonwebtoken');
var Models = require('../models/index');
const cookieParser = require('cookie-parser');
let bcrypt = require('bcrypt-nodejs');
let sha256 = require('sha256');
var nodemailer = require('nodemailer');
var mailerHelper = require('../helpers/nodemailer');
var hbs = require('nodemailer-express-handlebars');

var session = require('express-session');
var flash = require('req-flash');
/**
 * Need to get in a file
 */
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
    viewPath: 'views/email',
    extName: '.hbs'
  }));


require('dotenv').config();
//MAIL SENDING
let sendMailForUser = (result, subject) => {
    mailer.sendMail({
        from: process.env.MAILER_AUTH_USER,
        to: result.email,
        subject: subject,
        template: 'register',
        context: {
            first_name: result.first_name,
            last_name: result.last_name,
            username: result.username,
            email: result.email
        }
    }, function(err, res, response) {
        if(err) {
            console.log(err);
        }
        console.log(err);
});
}

let insertUser = (insertUserObject) => {
    return Models.User.create({
        first_name: insertUserObject.first_name,
        last_name: insertUserObject.last_name,
        username: insertUserObject.username,
        email:  insertUserObject.email,
        password: insertUserObject.password,
    })
}


exports.register = (req, res) => {
    let insertUserObject = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        password: sha256(req.body.password),
        confirm_password: req.body.confirm_password
    }


    req.checkBody('first_name', 'First Name is required').notEmpty();
    req.checkBody('last_name', 'Last Name is required').notEmpty();
    req.checkBody('email', 'E-Mail is required').notEmpty();
    req.checkBody('email', 'E-Mail is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm_password', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if(errors){
        res.render('register', {
            layout: 'layouts/layout.hbs',
            errors:errors
        });
    } else {
        insertUser(insertUserObject)
        .then(result => {
            if(req.body.remember) {
                sendMailForUser(result, 'Registration data');
            } 
            req.flash('success_msg', 'You are registered and can now login');
            res.redirect('/');
        })
    }
};

exports.login = (req, res) => {
    Models.User.findOne({where: {email: req.body.email}})
    .then(user => {
        if(user == null) {
            req.flash('error_msg', 'User not found');
            res.redirect('/');
        } else {
            if(sha256(req.body.password) !== user.password) {
                req.flash('error_msg', 'Password does not match');
                res.redirect('/');
            } else {
                var token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY);
                res.cookie('access_token', token);
                res.redirect('/dashboard');
            }
        }
    })
};

exports.logout = (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/');
}

exports.showDashBoard = (req, res) => {
    res.render('admin/dashboard', {layout: 'layouts/admin.hbs', title: 'Admin Dashboard'});
}

exports.showForgotPassword = (req, res) => {
    res.render('forgot_password', {layout: 'layouts/layout.hbs', title: 'Forgot password'});
}