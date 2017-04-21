let mongoose = require('../../libs/mongoose');
let Schema = mongoose.Schema;

const ADMIN = 1;

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
    },
    stripeId : {
        type : String
        // require : true
    },
    stripeSource : {
        type: String
    },
    isAdmin : {
        type : Number,
        enum : [0,1],
        default : 1
    },
    planId : {
        type: String
    },
    buildId : {
        type : String
    },
    coupon : {
        type: Object
    }


});

schema.methods = {
    /**
     * Update customer data stripeAPI
     * @param {Object} customer
     * @param {Object} coupon
     * */
    updateStripeCustomer : function(customer,coupon) {
        return this.update({$set: {
            stripeId:customer.id,
            stripeSource:customer.default_source,
            coupon: coupon
        }});
    }
};

schema.static('findAdminByEmail', function (email,callback) {
    return this.findOne({email : email, isAdmin : ADMIN}, callback);
});
// schema.statics = {
//     findAdminByEmail : function() {
//          return this.findOne({email : email, isAdmin : ADMIN}, callback);   
//     }
// };

module.exports = mongoose.model('User', schema);
