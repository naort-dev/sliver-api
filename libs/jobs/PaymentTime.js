const mongoose = require('mongoose');
const User = mongoose.model('User');
const Product = mongoose.model('Product');
const Payment = mongoose.model('Payment');
const Coupon = mongoose.model('Coupon');
const moment = require('moment');
const stripe = require('../../services/stripe');
const StripeService = stripe.service;


class PaymentTime {

    static payment() {
        console.log('Cron run');
        let days = this.checkMonthDay();

        return User.list()
            .then((users) => {
                users.forEach((user) => { //TODO: limit on users
                    let productsToPay = this.checkUserPaymentDay(user, days);

                    if (productsToPay.length < 0) return;

                    const productsToCharge = [];
                    Product.find({_id: {$in: productsToPay}})
                        .then((products) => {
                            return Promise
                                .all(products.map((product) => {
                                    return Payment.find({$and: [{userId: user._id}, {"products.productId": product._id}]})
                                        .then((payments) => {
                                            if (payments.length < product.billingFrequency || !payments) {
                                                productsToCharge.push(product);
                                                return product;
                                            }
                            
                                            return user.disactiveProduct(product)
                                        })
                                }));
                        })
                        .then(() => {
                            if (productsToCharge.length == 0) return;

                            let Pay = new Payment();

                            return Promise
                                .all(
                                    productsToCharge.map((product) => {
                                        if (product.typeProduct == 1 && user.couponId) {
                                            let coupon = null;
                                            
                                            return Coupon.load({_id: user.couponId})
                                                .then((res) => {
                                                    coupon = res;
                                                    if (!coupon.validationBeforeCharge(product)) {
                                                        return;
                                                    }
                                                    
                                                    if (!coupon.durationLimited) {
                                                        return Pay.products.push(Pay.createPlanPayment(product, coupon));
                                                    }
                                                    
                                                    return Payment.count({"couponId": coupon._id});
                                                })
                                                .then((count) => {
                                                    if (count < coupon.durationLimited) {
                                                        return Pay.products.push(Pay.createPlanPayment(product, coupon));
                                                    }
                                                    
                                                    return Pay.products.push(Pay.createPlanPayment(product));                                                   
                                                })
                                                .catch((err) => {
                                                    console.log(err); // TODO: winston logger add;
                                                });
                                        }
                                        return Pay.products.push(Pay.createBuildPayment(product));
                                    })
                                )
                                .then(() => {
                                    return StripeService.createCharges(user, Pay.calculate());
                                })
                                .then((charges) => {
                                    Pay.userId = user._id;
                                    Pay.status = charges.status == 'succeeded' ? 1 : 0;
                                    Pay.paymentDate = charges.created * 1000;
                                    Pay.amountCharges = charges.amount;
                                    return StripeService.getCustomerById(user.stripeId);
                                })
                                .then((customer) => {
                                    Pay.amountSaved = customer.account_balance;
                                    Pay.save();
                                })
                                .then(() => {
                                    return;
                                })
                                .catch((err) => {
                                    console.log(err); // TODO: winston logger add;
                                });
                        })
                        .catch(err => {
                            return new Error('error payment', err);
                        });
                })
            });
    }

    static checkUserPaymentDay(user, days) {
        const productsToPay = [];

        if (days.indexOf(moment(user.plan_date).format('D')) != -1) {
            productsToPay.push(user.planId);
        }

        if (days.indexOf(moment(user.build_date).format('D')) != -1) {
            productsToPay.push(user.buildId);
        }

        return productsToPay;
    }

    /**
     * Check the date on the last day of the month
     * @returns {Array}
     */
    static checkMonthDay() {
        let days = [];
        let now = moment();

        if (now.format('D') === moment().endOf('month').format('D')) {
            switch (now.format('D')) {
                case '28' :
                    days.push('28', '29', '30', '31');
                    break;
                case '29' :
                    days.push('29', '30', '31');
                    break;
                case '30' :
                    days.push('30', '31');
                    break;
                case '31' :
                    days.push('31');
                    break;
            }
        } else {
            days.push(now.format('D'));
        }

        return days;
    }
}

module.exports = PaymentTime;