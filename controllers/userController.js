const jwt = require('jsonwebtoken');

var User = require('../models/user');

var Index = require('../models/index');

var appData = {};

/* exports.register = function(req,res) {
    appData['name'] = req.body.name;
    appData['email'] = req.body.email;
    appData['password'] = req.body.password;

    res.status(201).json(appData);
}; */


exports.register = (req, res) => {
    return Index.User.count({ where: {email: req.body.email} })
        .then(count => {
            if (count != 0) {
                appData["error"] = 1;
                appData["data"] = "Taken Email";
                res.status(409).json(appData);
            }else {
                Index.User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
              })
              .then(user => {
                appData["error"] = 1;
                appData["data"] = "User Registered";
                res.status(201).json(appData);
              })
              .catch(error => {
                console.log('This error Occured', error);
              });
            }
        });
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