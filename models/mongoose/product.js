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
    createBuildPayment : function(type) {
        return {
            id : this._id,
            amount : this.buildType.id == type ? this.amountFirstPayment : this.costProduct
        }
    }
};

schema.statics = {       
    getPlans : function(criteria) {
        return this.find(criteria).limit(6).exec();   
    }
    
};


module.exports = mongoose.model('Product', schema);
