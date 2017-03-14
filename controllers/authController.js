const User = require('../models/user');
const url = require('url');

class AuthController {
    static signin(req) {
        return User.signIn(req.body.email, req.body.password);
    }

    static signup(req) {
        return User.signUp(req.body);
    }

    static sendToken(req) {
        return User.sendToken(req.query.email);
    }
    
    static auth(req) {
        return User.authToken(req.query['access-token']);
    }
    
    static resetPassword(req) {
        console.log(req.query.token);
    }

}

module.exports = AuthController;