let mongoose = require('../../libs/mongoose');
let Schema = mongoose.Schema;
const moment = require('moment');
const CustomError = require('../../libs/error/CustomError');

let schema = new Schema({
    name: {
        type: String,
        required: 'Name is not empty',
        minlength: [4, 'Name is min {MINLENGTH} letters']
    },
    code: {
        type: String,
        required: 'Code is not empty'
    },
    typeCoupon: {
        type: Number
    },
    amount: {
        type: Number,
        required: 'Amount promo code is not empty'
    },
    plan: {
        type: Object,
        default: null
    },
    redemption: {
        type: Number,
        default: null,
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

schema.methods = {
    /**
     * Checks Expiration date
     *
     * @returns {boolean}
     */
    expirationDate: function () {
        const todayMoment = new moment();
        return todayMoment.isBetween(this.dateFrom, this.dateUntil);
    },

    /**
     * Check applied to plan
     *
     * @param {string} planId
     * @returns {boolean}
     */
    isCheckPlan: function (productId) {
        return this.plan._id == productId;
    },

    isDurationOneTime() {
        return this.duration == 1;
    },

    /**
     * Coupon can be redeemed
     *
     * @returns {boolean}
     */
    isRedemption: function () {
        return this.redemption > 0;
    },

    /**
     * Validation coupon at the time of register user
     *
     * @param planId
     * @returns {Array}
     */
    validateSignUp: function (planId) {
        let errors = [];

        if (!this.expirationDate()) {
            errors.push(new CustomError('The promo code is already expired', 'BAD_DATA'));
        }

        if (this.plan && !this.isCheckPlan(planId)) {
            errors.push(new CustomError('This promo code can\'t be applied for this plan', 'BAD_DATA'));
        }

        if (this.redemption != null && !this.isRedemption()) {
            errors.push(new CustomError('The promo code is invalid', 'BAD_DATA'));
        }


        return errors;
    },

    /**
     * Validation coupon before charges product payments
     * @param product
     * @returns {boolean}
     */
    validationBeforeCharge(product) {
        if (this.plan && !this.isCheckPlan(product._id) || this.isDurationOneTime()) {
            return false;
        }

        return true;
    },

    /**
     * Reduces redemption coupon at 1
     *
     * @returns {Promise|*}
     */
    minusRedemption() {
        if (this.redemption == null) {
            return;
        }

        this.redemption += -1;
        return this.save();
    }
};

schema.statics = {
    /**
     * Find Product by id
     *
     * @param {ObjectId} _id
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

    /**
     * Find coupon by code
     *
     * @param {string} code
     * @returns {Promise}
     */
    getCouponByCode: function (code) {
        return this.findOne({code: code});
    },

    isValidCode: function (code, planId) {
        return this.getCouponByCode(code)
            .then((coupon) => {
                if (!coupon) {
                    return Promise.reject(new CustomError('The promo code is invalid', 'BAD_DATA'));
                }

                const errors = coupon.validateSignUp(planId);
                if (errors.length === 0) {
                    return coupon;
                }
                return Promise.reject(errors[0]);
            })
    }
};

module.exports = mongoose.model('Coupon', schema);