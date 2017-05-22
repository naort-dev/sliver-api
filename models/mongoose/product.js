const mongoose = require('../../libs/mongoose');
const Schema = mongoose.Schema;

const Product = require('./class/Product');

let schema = new Schema({
    productName : {
        type : String,
        required : true
    },
    productDescription : {
        type : String,
        required : true
    },
    costProduct : {
        type : Number,
        require : true
    },
    billingFrequency : {
        type : Number,
        require : true
    },
    expertHours : {
        type : Number,
        require : true,
        default : 0
    },
    amountFirstPayment : {
        type: Number,
        require : true,
        default : 0
    },
    costMonth : {
        type : Number
    },
    createdAt : {
        type: Date,
        default: Date.now()
    },
    typeProduct : {
        type: Number
    },
    status : {
      type: Number  
    },
    buildType : {
        type: Number
    }
});

schema.loadClass(Product);

module.exports = mongoose.model('Product', schema);
