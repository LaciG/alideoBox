const jwt = require('jsonwebtoken');
var Models = require('../models/index');
const cookieParser = require('cookie-parser');

var session = require('express-session');
var flash = require('req-flash');

var appData = {};

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
        password: req.body.password,
        confirm_password: req.body.confirm_password
    }

    console.log(req.body.email);

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
            req.flash('success_msg', 'You are registered and can now login');
            res.redirect('/');
        })
    }
};

exports.login = (req, res) => {
    Index.User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if(user !== null){
                res.send('Logged In!!!<br> But not checking the password!!!<bR>Authenticate HERE!!!');
            }
        })
};