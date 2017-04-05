const mongoose = require('../../libs/mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    userId : {
        type: String,
        require: true
    },
    productIds : {
        type: Array,
        // require: true
    },
    createdAt : {
        type: Date,
        default : Date.now()
    },
    expiration_date : {
        type: Date
    },
    payment_date : {
        type: Date
    },
    next_payment : {
        type: Date  
    },
    status : {
        type: Number,
        enum: [0,1],
        default: 1 
    }
});

schema.statics = {
    /**
     * Calculate payments
     * 
     * @param {array} payments
     * @return {object} payment
     * */
    calculatePayments : function(payments) {
        let payment = {
            productIds:[],
            amount : null
        };
        payments.forEach((item) => {
            payment.amount += item.amount;
            payment.productIds.push(item.id);
        });
        return payment;
    }
};

module.exports = mongoose.model('Payments',schema);