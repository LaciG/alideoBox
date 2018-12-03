let Models = require('../../models/index');
let jwt = require('jsonwebtoken');
let cookieParser = require('cookie-parser');

module.exports = (req, res, next) => {
    try {
        let verifiedCookie = jwt.verify(req.cookies.access_token, process.env.SECRET_KEY, {ignoreExpiration: true});
        let userID = verifiedCookie.user_id;
        Models.User.findOne({where: {id: userID}})
        .then(user => { 
            //if (user.enabled == 1) {
            if(user != null) {
                next();
            } else {
                res.redirect('/register');
            }
        })
        .catch(error => { res.status(500).send(); })

    } catch (error) {
        res.redirect('/');
    }
}