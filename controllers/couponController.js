const mongoose = require('mongoose');
const Coupon = mongoose.model('Coupon');
const CustomError = require('../libs/error/CustomError');

class CouponController {
    
    static create(req) {
        let coupon = req.body;
        if(coupon.dateFrom) {
            coupon.dateFrom = new Date(coupon.dateFrom);
        }
        
        if(coupon.dateUntil) {
            coupon.dateUntil = new Date(coupon.dateUntil);
        }
        
        return (new Coupon(coupon)).save();
    }

    static getCoupons() {
        return Coupon.list();
    }

    static getCoupon(req) {
       return Coupon.load(req.params.id);
    }

    static update(req) {
       return Coupon.findOneAndUpdate({_id: req.params.id}, req.body);
    }

    static remove(req) {
        return Coupon.findOneAndRemove({_id: req.body._id});
    }
    
    static validCode(req) {
        return Coupon.validate(req.params.code,req.params.planId);
    }
}

module.exports = CouponController;