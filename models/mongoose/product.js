let mongoose = require('../../libs/mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    product_name : {
        type : String,
        required : true
    },
    product_description : {
        type : String,
        required : true
    },
    build_fee : {
        type : Number,
        require: true
    },
    of_build_month : {
        type : Number,
        require: true
    },
    execute_fee : {
        type : Number,
        require : true
    },
    of_execute_month : {
        type : Number,
        require : true
    },
    billing_period : {
        type : Number,
        require : true
    },
    plan_type : {
        type : Number,
        require : true
    },
    product_display_order : {
        type : Number,
        require : true
    },
    product_status : {
        type : Number,
        require : true
    },
    product_type : {
        type : Array,
        require : true
    },
    date_created : {
        type : Date,
        require : true,
        default : Date.now()
    },
    who : {
        type : String
    }
});

module.exports = mongoose.model('Product', schema);
