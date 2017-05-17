const mongoose = require('./../libs/mongoose');
const IdealClient = mongoose.model('IdealClient');

class IdealClientController {

    static setNameIdealClient(req) {
        console.log(req.body);
    }

    static getNameIdealClient(req) {
        let options = {
            userId: req.decoded._doc._id,
            select: 'nameYouIdealClient'
        };

        return IdealClient.load(options);
    }

    static setWhoAreYouIdealClient(req) {
        return IdealClient.UpdateOrCreate({userId: req.decoded._doc._id, whoAreYouIdealClient:req.body});
    }

    static getWhoAreYouIdealClient(req) {
        let options = {
            userId: req.decoded._doc._id,
            select: 'whoAreYouIdealClient'
        };
        
        return IdealClient.load(options);
    }

}

module.exports = IdealClientController;