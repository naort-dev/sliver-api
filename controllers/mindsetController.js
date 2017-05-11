const mongoose = require('./../libs/mongoose');
const SlapMindset = mongoose.model('slapMindset');

class MindsetController {

    static userCommitmentDataSave(req) {
        let sliders = [];

        req.body.forEach((item, i) => {
            sliders[i] = item.value;
        });

        return SlapMindset.UpdateOrCreate({userId: req.decoded._doc._id, youCommitmentSliders: sliders});
    }

    static areYouStuckDataSave(req) {
        let sliders = [];

        req.body.forEach((item, i) => {
            sliders[i] = item.value;
        });

        return SlapMindset.UpdateOrCreate({userId: req.decoded._doc._id, areYouStuckSliders: sliders});
    }
    
    static privilegeAndResponsibilityDataSave(req) {
        return Promise((resolve,reject) => {
            resolve({status: 'ok'});
        })
    }
    
    static startDateDataSave(req) {
        return Promise((resolve,reject) => {
            resolve({status: 'ok'});
        })
    }
}

module.exports = MindsetController;