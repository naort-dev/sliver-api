const mongoose = require('./../../libs/mongoose');

let Schema = mongoose.Schema;

let schema = new Schema({
    userId: {
        type: String
    },
    youCommitmentSliders: {
        type: Array
    },
    areYouStuckSliders: {
        type: Array
    },
    privilegeAndResponsibility: {
        type: Object
    },
    yourStatement: {
        type: Object
    },
    whoAreYouIdealClient: {
        type:Object
    }
});

schema.statics = {
    UpdateOrCreate: function (obj) {
        return this.update({userId: obj.userId}, obj, {upsert: true, setDefaultsOnInsert: true});
    },

    /**
     * Find one user by criteria
     *
     * @param criteria
     * @returns {Promise}
     */
    load(criteria) {
        return this.findOne(criteria).exec();
    },
};

module.exports = mongoose.model('slapMindset', schema);