let bcrypt = require('bcrypt');
let mongoose = require('../../libs/mongoose');
let Schema = mongoose.Schema;

const salt_factor = 10;

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
    creditCard : {
        type : Number,
        unique :true,
        required : true
    },
    token : {
        type : String
    },
    expirationDate : {
        type : Date
    },
    securityCode : {
        type : Number,
        required : true
    },
    billingAddress : {
        type : String,
        required : true
    }
});

schema.pre('save', function(next) {
    let user = this;
    
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(salt_factor, (err, salt) => {
        if (err) return next(err);
        
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', schema);
