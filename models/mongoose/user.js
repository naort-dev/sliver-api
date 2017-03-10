let crypto = require('crypto');
let mongoose = require('../../libs/mongoose');
let Schema = mongoose.Schema;

const saltLength = 10;

let schema = new Schema({
     name : {
         type : String,
         required : true
     },
    lastName : {
        type : String,
        required : true
    },
    businessName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    phone : {
        type : Number,
        unique : true,
        required : true
    },
    password : {
        type : String,
        require : true
    },    
    token : {
        type : String
    },
    expirationDate : {
        type : Date
    },    
    billingAddress : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('User', schema);
