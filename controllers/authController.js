const User = require('../models/user');
const stripe = require('../services/stripe');
const StripeService = stripe.service;
const StripeError = require('../services/stripe/errors/StripeError');

class AuthController {
    static signin(req) {
        return User.signIn(req.body.email, req.body.password);
    }

    static signup(req) {
        let userData = {
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        };
        
        let cardData = req.body.card;
        let mongoUser;
        
        return new Promise( (resolve,reject) => {
            User.create(userData)
                .then( (user) => {
                    return mongoUser = user;
                })
                .then( () => {
                    return StripeService.createCustomer(userData,cardData);
                })
                .then( (customer) => {
                    return User.update(customer.id,mongoUser._id);
                })
                .then( () => {
                    resolve(mongoUser);
                })
                .catch((err) => {
                    if(err instanceof StripeError){
                        User.delete(mongoUser);
                    }
                    return reject(err);
                });
        });
    }

    static sendToken(req) {
        return User.sendToken(req.query.email);
    }
    
    static auth(req) {
        return User.authToken(req.query['access-token']);
    }
    
    static checkPassword(req) {
        let token = req.body['access-token'];
        let password = req.body['new_password'];
        
        return User.resetPassword(token,password);
    }

}

module.exports = AuthController;