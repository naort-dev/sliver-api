const User = require('../../models/user');

class AuthAdminController {

    static signinAdmin(req)
    {
        return User.signinAdmin(req.body.email, req.body.password);
    }
}

module.exports = AuthAdminController;