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
    createdAt : {
        type: Date,
        default: Date.now()
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
    createFirstBuildPayment : function() {
        return {
            id : this._id,
            amount : this.amountFirstPayment
        }
    }
};


module.exports = mongoose.model('Product', schema);
