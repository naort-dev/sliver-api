const config = require('../../config');
const StripeError  = require('./errors/StripeError');
const stripe = require('stripe')(config.stripe_key);

class Stripe {

    static createCustomer(userData, cardData) {
        return new Promise( (resolve,reject) => {
            Stripe._createCard(cardData)
                .then(cardSource => Stripe._createCustomer(cardSource,userData))
                .then(resolve)
                .catch(reject);
        });
    }
    
    static _createCustomer(cardSource,userData) {
        return new Promise( (resolve,reject) => {
            let data = {
                source : cardSource.id,
                email : userData.email,
                metadata : {
                    customer_email : userData.email,
                    customer_name : userData.name
                }
            };
           stripe.customers.create(data, (err,customer) => {
              if(err) return reject(new StripeError('Failed create customer', 'BAD_DATA', {orig: err}));

               resolve(customer);
           });
        });
    }
    


    static _createCard(card) {
        return new Promise( (resolve,reject) => {
            stripe.tokens.create({card : card}, (err,token) => {
                if(err) return reject(new StripeError('Failed create card', 'BAD_DATA', {orig: err.stack}));
                
                resolve(token);
            });
        });
    }
}

module.exports = Stripe;