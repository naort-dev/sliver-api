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
        type: Boolean
    },
    status : {
      type: Boolean  
    },
    buildType : {
        type: Object
    }
});

schema.methods = {
    
    /**
     * Create plan payment
     * @return {object} 
     * */
    createPlanPayment : function() {
        return {
            id : this._id,
            amount : this.costProduct
        }
    },
    
    /**
     * Create build  first payment
     * @return {object}
     * */
    createBuildPayment : function() {
        return {
            id : this._id,
            amount : this.buildType == 1 ? this.amountFirstPayment : this.costProduct
        }
    }
};

schema.statics = {
    calculateCostBuildMonth : function(product) {
        return (product.costProduct - product.amountFirstPayment) / product.billingFrequency;
    }
};


module.exports = mongoose.model('Product', schema);
