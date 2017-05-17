const mongoose = require('mongoose');
const Statement = mongoose.model('Statement');


class StatementController {

    static setYourStatement(req) {
        return Statement.UpdateOrCreate({userId: req.decoded._doc._id, yourStatement: req.body});
    }

    static getYourStatement(req) {
        let options = {
            userId:req.decoded._doc._id,
            select: 'yourStatement'
        };

        return Statement.load(options);
    }
}

module.exports = StatementController;