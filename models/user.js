const MongooseUser = require('../models/mongoose/user');
const MongoosePayments = require('../models/mongoose/payments');
const MongooseProduct = require('../models/mongoose/product');
const MongooseCoupon = require('../models/mongoose/coupon');
const hashPass = require('../libs/class/HashPass');
const CustomError = require('../libs/error/CustomError');
const async = require('async');
const nodemailer = require('nodemailer');
const ses =require('nodemailer-ses-transport');
const config = require('../config');
const stripe = require('../services/stripe');
const StripeService = stripe.service;
const StripeError = require('../services/stripe/errors/StripeError');
const Product = require('../models/product');

class User {

    /**
     * Before create user hash password
     * @param {object} userData
     *
     * @return {Promise}
     * */
    static create(userData) {
        userData.password = hashPass.createHash(userData.password);
        return new MongooseUser(userData).save();
    }
    
    /**
     * @param {object} user
     * @param {String} candidatePassword
     * */
    static comparePassword(user, candidatePassword){
         return new Promise((resolve, reject) => {
             if(hashPass.validateHash(user.password,candidatePassword)) {
                return resolve({
                    token : user.id
                });
             }
             return reject(new CustomError('Password miss match.', 'UNAUTH'));
             
        });
    }

    /**
     * @param userData
     * @returns {Promise}
     */
    static signUp(userData) {
        return new Promise((resolve,reject) => {
            let self = this;
            let mongo = {payments: []};

            self.create(userData)
                .then((user) => {
                    mongo.user = user;
                    return MongooseProduct.findOne({_id : userData.planId});
                })
                .then((plan) => {
                    mongo.plan = plan;
                    if(userData.code) {
                        return MongooseCoupon.validate(userData.code,plan._id)
                            .then((coupon) => {
                                return coupon;
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                })
                .then((coupon) => {
                    if(coupon) {
                        mongo.coupon = coupon;
                    }
                    return mongo.plan.createPlanPayment(coupon);
                })
                .then((payment) => {
                    mongo.payments.push(payment);
                    if(userData.buildId) {
                        return MongooseProduct.findOne({_id : userData.buildId});
                    }
                })
                .then((build) => {
                    if(build) {
                        // mongo.build = build;
                        return build.createBuildPayment(Product.BUILD_INSTALLMENTS);
                    }
                })
                .then((payment) => {
                    if(payment) {
                        mongo.payments.push(payment);
                    }

                    return StripeService.createCustomer(userData);
                })
                .then((customer) => {
                    mongo.customer = customer;
                    return mongo.user.updateStripeCustomer(customer);
                })
                .then(() => {
                    return MongoosePayments.calculatePayments(mongo.payments);
                })
                .then((payment) => {
                    mongo.payment = payment;
                    return StripeService.createCharges(mongo.customer,payment);
                })
                .then((charges) => {
                    return MongoosePayments({
                        userId : mongo.user._id,
                        productIds : mongo.payment.productIds,
                        paymentDate : new Date(charges.created * 1000),
                        status : charges.status == 'succeeded' ? 1 : 0
                    }).save();
                })
                .then(() => {
                    resolve(mongo.user);
                })
                .catch((err) => {
                    if(err instanceof StripeError){
                        self.delete(mongo.user);
                    }

                    reject(err);
                });
        });
    }

    /**
     * @param email
     * @param password
     * @returns {Promise}
     */
    static signIn(email, password) {
        return new Promise((resolve, reject) => {
            let mongooseUser;

            MongooseUser.findOne({email : email})
                .then((user) => {
                    if(!user) reject(new CustomError('User not found to DB', 'NOT_FOUND'));
                    return mongooseUser = user;
                })
                .then(() => User.comparePassword(mongooseUser, password))
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Checks the token
     * @param id
     * @returns {Promise}
     */
    static authToken(id) {
        return new Promise((resolve,reject) => {
            MongooseUser.findOne({_id : id})
                .then((user) => {
                    if(!user) reject(new CustomError('User not found to DB', 'NOT_FOUND'));
                    return user;
                })
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Send token to email to reset password
     * @param email
     * @returns {Promise}
     */
    static sendToken(email) {
        return new Promise( (resolve,reject) => {
            async.waterfall([createToken,findUser,sendToken], (err,result) => {
                if(err) reject( new CustomError('Not send mail!', 'SERVICE_UNAVAILABLE', {orig : err}));
                resolve(new CustomError('Letter email was sent! Run to your inbox to check it out', 'OK', {orig : result}));
                // resolve(result);
            });
        });

        function createToken (callback) {
            let token = hashPass.createHash(email);
            callback(null,token);
        }

        function findUser(token,callback) {
            MongooseUser.findOne({email : email})
                .then( (user) => {
                    if(!user) {
                        callback('User not found');
                        return;
                    }

                    user.token = token;
                    user.expirationDate = Date.now() + 360000;
                    user.save()
                        .then( (user) => {
                            callback(null,token,user);
                            return;
                        })
                        .catch( (err) => {
                            callback(err);
                            return;
                        });
                })
                .catch( (err) => {
                    callback(err);
                    return;
                });
        }

        function sendToken(token,user,callback) { 
            let transporter = nodemailer.createTransport(ses(config.mailer));
            
            transporter.sendMail({
                    from: config.emailAddress,
                    to: user.email,
                    subject: 'SLAPCenter Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' 
                    + config.host + '#/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                },
                (err,result) => {
                    if(err) {
                        callback(err);
                        return;
                    }
                    callback(null,result);
                    return;
                });          
            transporter.close();
        }
    }

    /**
     * 
     * @param token
     * @param password
     * @returns {Promise}
     */
    static resetPassword(token,password) {
        return new Promise( (resolve,reject) => {
            MongooseUser.findOne({token : token, expirationDate : {$gt : Date.now()} })
                .then( (user) => {
                    if(!user) {
                        return reject( new CustomError(400,'Password reset token is invalid or has expired.')); 
                    }
                    
                    user.token = '';
                    user.expirationDate = '';
                    user.password = hashPass.createHash(password);
                    
                    user.save()
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }
    
    static delete(user) {
        return new Promise( (resolve,reject) => {
            return MongooseUser.findByIdAndRemove({_id : user._id}, (err,result) => {
                return err ? reject(err) : resolve(result);
            });
        });
    }

    /**
     * 
     * @param stripeId
     * @param userId
     * @returns {Promise}
     */
    static update(stripeId,userId) {
        return new Promise( (resolve,reject) => {
            MongooseUser.update({_id : userId}, {$set : {stripeId : stripeId}}, (err,result) => {
                if(err) return reject(err);
                
                return resolve(result);
            });
        });
    }

    /**
     * 
     * @param email
     * @param password
     * @returns {Promise}
     */
    static signinAdmin(email,password) {
        return new Promise((resolve, reject) => {
            let mongooseUser;

            MongooseUser.findAdminByEmail(email)
                .then((user) => {
                    if(!user) reject(new CustomError('User not found to DB', 'NOT_FOUND'));
                    return mongooseUser = user;
                })
                .then(() => User.comparePassword(mongooseUser, password))
                .then(resolve)
                .catch(reject);
        });
    }
}

module.exports = User;

