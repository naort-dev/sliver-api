const mongoose = require('../../libs/mongoose');
const Schema = mongoose.Schema;

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

schema.methods = {
    /**
     * Coupon application if available
     * 
     * @param coupon
     * @returns {number}
     */
    applyCoupon(coupon) {
        return this.amount = coupon.typeCoupon ? this.costProduct - (this.costProduct * coupon.amount) / 100 : this.costProduct - coupon.amount; //TODO: const typeCoupon
    }
};

schema.statics = {       
    /**
     * List Products
     *
     * @param {Object} options
     * @api private
     */
    list: function (options) {
        options = options || {};
        const criteria = options.criteria || {};
        const page = options.page || 0;
        const limit = options.limit || 30;
        return this.find(criteria)
            .limit(limit)
            .skip(limit * page)
            .exec();
    },

    /**
     * Find one product by criteria
     * @param criteria
     * @returns {Promise} 
     */
    load(criteria) {
        return this.findOne(criteria).exec();
    }
    
};


module.exports = mongoose.model('Product', schema);
