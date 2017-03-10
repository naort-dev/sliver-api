const User = require('../models/user');

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

}

module.exports = AuthController;