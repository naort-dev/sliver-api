let User = require('../models/user').User;

class AuthController {
    static signin(req,res) {
        let password = req.body.password;

        User.findOne({name : req.body.name}, (err,user) => {
            if(err) throw err;

            user.comparePassword(password, (err) => {
                if (err) throw err;
                res.send(user);
            });
        });
    }

    static signup(req,res) {
        let user = new User(req.body.user);
        
        let promise = user.save();
        promise
            .then((response) => {
                console.log(response, 123);
            })
            .catch((error) => {
                console.log(error,321123);
            });
        res.send(user);
    }
}

module.exports = AuthController;