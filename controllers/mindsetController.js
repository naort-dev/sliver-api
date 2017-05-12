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
    
    static getYourStatementData(req) {
        return SlapMindset.findOne({userId: req.decoded._doc._id}).select('yourStatement').exec();
    }
    
    static whoAreYouIdealClientDataSave(req) {
        return SlapMindset.UpdateOrCreate({userId: req.decoded._doc._id, whoAreYouIdealClient:req.body});
    }
    
    static getWhoAreYouIdealClientData(req) {
        return SlapMindset.findOne({userId: req.decoded._doc._id}).select('whoAreYouIdealClient').exec();
    }
    
    static nameYourIdealClientDataSave(req) {
        return SlapMindset.UpdateOrCreate({userId: req.decoded._doc._id, nameYourIdealClient:req.body});
    }

    static getNameYourIdealClientData(req) {
        return SlapMindset.findOne({userId: req.decoded._doc._id}).select('nameYourIdealClient').exec();
    }
}

module.exports = MindsetController;