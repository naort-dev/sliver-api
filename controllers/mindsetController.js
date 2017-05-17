const mongoose = require('./../libs/mongoose');
const SlapMindset = mongoose.model('slapMindset');
const User = mongoose.model('User');

class MindsetController {
    
    static getAllMindset(req) {
        return SlapMindset.load({userId: req.decoded._doc._id});
    }

    static setYourCommitment(req) {
        let finishedSteps = req.body.finishedSteps;
        let sliders = [];
        
        req.body.data.forEach((item, i) => {
            sliders[i] = item.value;
        });
        
        return SlapMindset.UpdateOrCreate({userId: req.decoded._doc._id, youCommitmentSliders: sliders})
            .then(() => {
                return User.UpdateOrCreate({userId: req.decoded._doc._id, finishedSteps: finishedSteps});
            });
    }

    static setAreYouStuck(req) {
        let sliders = [];
        let finishedSteps = req.body.finishedSteps;

        req.body.data.forEach((item, i) => {
            sliders[i] = item.value;
        });

        return SlapMindset.UpdateOrCreate({userId: req.decoded._doc._id, areYouStuckSliders: sliders})
            .then(() => {
                return User.UpdateOrCreate({userId: req.decoded._doc._id, finishedSteps: finishedSteps});
            });
    }
    
    static setPrivilegeAndResponsibility(req) {
        let finishedSteps = req.body.finishedSteps;

        return SlapMindset.UpdateOrCreate({userId: req.decoded._doc._id, privilegeAndResponsibility:req.body.data})
            .then(() => {
                return User.UpdateOrCreate({userId: req.decoded._doc._id, finishedSteps: finishedSteps});
            });
    }
    
    static setStartDate(req) {
        let finishedSteps = req.body.finishedSteps;

        return SlapMindset.UpdateOrCreate({userId: req.decoded._doc._id, startDate:req.body.data})
            .then(() => {
                return User.UpdateOrCreate({userId: req.decoded._doc._id, finishedSteps: finishedSteps});
            });
    }
}

module.exports = MindsetController;