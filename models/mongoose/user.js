const mongoose = require('../../libs/mongoose');
const Product = mongoose.model('Product');
const HashPass = require('../../libs/class/HashPass');
const moment = require('moment');

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
    admin : {
        type : Number,
        enum : [0,1],
        default : 1
    },
    planId : {
        type: String
    },
    plan_date: {
        type: Date,
        default: null
    },
    buildId : {
        type : String
    },
    build_date: {
        type: Date,
        default: null
    },
    couponId : {
        type: String,
        default:null
    },
    createdAt : {
        type: Date,
        default: new Date()
    },
    finishedSteps: {
        type: Array,
        default: []
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
            couponId: coupon ? coupon._id : null
        }});
    },

    /**
     * Checks compare password user
     * @param {string} password
     * @returns {boolean}
     */
    comparePassword(password) {
        return HashPass.validateHash(this.password,password);
    },

    /**
     * Create token and save user
     * @returns {Promise|*}
     */
    createToken() {
        this.token = HashPass.createHash(this.email);
        this.expirationDate = new Date() + 360000;
        return this.save();
    },

    /**
     * Date verification
     * @returns {*}
     */
    expDate() {
        let now = new moment();
        return now.isSameOrBefore(new Date(),'minute');
    },

    /**
     * Reset password and nullable token and date
     * @param password
     * @returns {Promise|*}
     */
    resetPassword(password) {
        this.password = HashPass.createHash(password);
        this.token = null;
        this.expirationDate = null;
        return this.save();
    },
    
    isAdmin() {
        return this.admin === ADMIN;
    },

    /**
     * Disactive profuct wich frequency finished
     * @param product
     * @returns {Promise|*}
     */
    disactiveProduct(product) {
        if(product.typeProduct == 1) {
            this.planId = null;
            this.plan_date = null;
            return this.save();
        }
        this.buildId = null;
        this.build_date = null;
        return this.save();
    }
};

schema.statics = {
    /**
     * Find one user by criteria
     * 
     * @param criteria
     * @returns {Promise}
     */
    load(criteria,select) {
        return this.findOne(criteria).select(select).exec();
    },

    /**
     * List Users
     *
     * @param {Object} options
     * @api private
     */
    list: function (options) {
        options = options || {};
        const criteria = options.criteria || {};
        const page = options.page || 0;
        const limit = options.limit || {};
        return this.find(criteria)
            // .limit(limit)
            // .skip(limit * page)
            .exec();
    },

    UpdateOrCreate: function(obj) {
        return this.update({_id: obj.userId}, obj, {upsert: true, setDefaultsOnInsert: true});
    }

    // findAdminByEmail : function() {
    //      return this.findOne({email : email, isAdmin : ADMIN}, callback);
    // }
};

/**
 * Before saving hash password
 */
schema.pre('save', function(next) {
    this.password = HashPass.createHash(this.password);
    return next();
});

    

module.exports = mongoose.model('User', schema);
