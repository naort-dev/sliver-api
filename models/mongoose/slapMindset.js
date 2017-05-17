const mongoose = require('./../../libs/mongoose');

let Schema = mongoose.Schema;

const Mindset = require('./class/Mindset');

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
    startDate: {
        type: Object
    }
});

schema.loadClass(Mindset);

module.exports = mongoose.model('slapMindset', schema);