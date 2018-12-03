var express = require('express');
var router = express.Router();

var users = require('./api/users');

router.use('/user', users);

module.exports = router;