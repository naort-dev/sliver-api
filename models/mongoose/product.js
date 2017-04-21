let mongoose = require('../../libs/mongoose');
let Schema = mongoose.Schema;

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
     * Create plan payment
     * @return {object} 
     * */
    createPlanPayment : function(coupon) {
        if(!coupon) {
            return {
                id : this._id,
                amount : this.costProduct
            }
        }
        
        return {
            id : this._id,
            amount : coupon.typeCoupon ? this.costProduct - (this.costProduct * coupon.amount) / 100 : this.costProduct - coupon.amount
        }
    },
    
    /**
     * Create build  first payment
     * @return {object}
     * */
    createBuildPayment : function(type) {
        return {
            id : this._id,
            amount : this.buildType.id == type ? this.amountFirstPayment : this.costProduct
        }
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
    }
    
};


module.exports = mongoose.model('Product', schema);
