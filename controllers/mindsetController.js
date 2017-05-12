const mongoose = require('./../libs/mongoose');
const SlapMindset = mongoose.model('slapMindset');

class MindsetController {
    
    static getMindsetUserAllData(req) {
        return SlapMindset.load({userId: req.decoded._doc._id});
    }

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
        return SlapMindset.UpdateOrCreate({userId: req.decoded._doc._id, privilegeAndResponsibility:req.body});
    }
    
    static startDateDataSave(req) {
        return new Promise((resolve,reject) => {
            resolve({status: 'ok'});
        })
    }
    
    static yourStatementDataSave(req) {
        return SlapMindset.UpdateOrCreate({userId: req.decoded._doc._id, yourStatement:req.body});
    }
    
    static whoAreYouIdealClientDataSave(req) {
        return SlapMindset.UpdateOrCreate({userId: req.decoded._doc._id, whoAreYouIdealClient:req.body});
    }
}

module.exports = MindsetController;