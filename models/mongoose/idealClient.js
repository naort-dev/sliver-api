const mongoose = require('./../../libs/mongoose');
const Schema = mongoose.Schema;

const IdealClient = require('./class/IdealClient');

const schema = new Schema({
    
});

schema.loadClass(IdealClient);

module.exports = mongoose.model('IdealClient',schema);