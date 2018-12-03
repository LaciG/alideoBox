var bodyParser = require('body-parser');

var apiRouter = require('./api');

const users = require('../controllers/userController');

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: true}));
  app.use('/api', apiRouter);
}


