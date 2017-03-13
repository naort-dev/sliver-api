const User = require('../models/user');
const url = require('url');

class AuthController {
    static signin(req) {
        return User.signIn(req.body.email, req.body.password);
    }

    static signup(req) {
        return User.signUp(req.body);
    }

    static forgot(req) {
        return User.forgot(req.body.email);
    }
    
    static auth(req) {
        return User.authToken(req.query['access-token']);
    }

}

module.exports = AuthController;