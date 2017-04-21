let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const moment = require('moment');
const CustomError = require('../../libs/error/CustomError');

let schema = new Schema({
    name: {
        type: String
    },
    code: {
        type: String
    },
    typeCoupon: {
        type: Number
    },
    amount: {
        type: Number
    },
    plan: {
        type: Object,
        default: null,
    },
    redemption: {
        type: Number
    },
    dateFrom: {
        type: Date
    },
    dateUntil: {
        type: Date
    },
    duration: {
        type: Number
    },
    durationLimited: {
        type: Number
    }
});

schema.method = {

};

schema.statics = {
    /**
     * Find Product by id
     *
     * @param {ObjectId} id
     * @api private
     */
    load: function (_id) {
        return this.findOne({_id})
            .exec();
    },
    /**
     * List Products
     *
     * @param {Object} options
     * @api private
     */
    list: function (options) {
        options = options || {};
        const criteria = options.criteria || {};
        const field = options.field || {};
        const page = options.page || 0;
        const limit = options.limit || 30;
        return this.find(criteria)
            .limit(limit)
            .select(field)
            .skip(limit * page)
            .exec();
    },

    getCouponByCode: function(code) {
        return this.findOne({code:code});
            
    },

    validate: function(code,planId) {
        let coupon = null;
        return this.findOne({code: code})
            .then((result) => {
                if(!result)  throw new CustomError('Code is NULL', 'BAD_DATA');

                coupon = result;

                const todayMoment = new moment();
                return todayMoment.isBetween(result.dateFrom, result.dateUntil);
            })
            .then((res) => {
                if(!res) throw new CustomError('Code expired', 'BAD_DATA');

                if(coupon.plan && coupon.plan._id == planId) {
                    return coupon;
                }

                throw new CustomError('The code does not match the selected plan','BAD_DATA');
            })
            .catch((err) => {
                return err;
            });
    }

};

module.exports = mongoose.model('Coupon', schema);