const User = require('../models/user');
const StripeError = require('../services/stripe/errors/StripeError');

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
    
    static checkPassword(req) {
        let token = req.body['access-token'];
        let password = req.body['new_password'];
        
        return User.resetPassword(token,password);
    }

}

module.exports = AuthController;