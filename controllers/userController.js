const mongoose = require('./../libs/mongoose');
const User = mongoose.model('User');

class UserController {
    static getFinishedSteps(req) {
        let select = 'finishedSteps';
        return User.load({_id: req.decoded._doc._id},select);
    }
}

module.exports = UserController;