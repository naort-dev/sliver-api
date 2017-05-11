const mongoose = require('./../../libs/mongoose');

let Schema = mongoose.Schema;

let schema = new Schema({
    userId: {
        type:String
    },
    youCommitmentSliders: {
        type: Array
    },
    areYouStuckSliders: {
        type:Array
    }
});

schema.statics = {
    UpdateOrCreate: function(obj) {
        return this.update({userId: obj.userId}, obj, {upsert: true,setDefaultsOnInsert: true});
    }
};

module.exports = mongoose.model('slapMindset', schema);