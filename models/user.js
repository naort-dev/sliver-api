const MongooseUser = require('../models/mongoose/user');
const hashPass = require('../libs/class/HashPass');
const AuthError = require('../libs/error/AuthError');
const async = require('async');
const nodemailer = require('nodemailer');
const ses =require('nodemailer-ses-transport');
const config = require('../config');

class User {

    static create(userData) {
        userData.password = hashPass.createHash(userData.password);
        return new MongooseUser(userData).save();
    }
    
    static comparePassword(user, candidatePassword){
         return new Promise((resolve, reject) => {
             if(hashPass.validateHash(user.password,candidatePassword)) {
                return resolve({
                    token : user.id
                });
             }
             return reject(new AuthError('Password miss match.', 'UNAUTH'));
             
        });
    }

    static signIn(email, password) {
        return new Promise((resolve, reject) => {
            let mongooseUser;

            MongooseUser.findOne({email : email})
                .then((user) => {
                    if(!user) reject(new AuthError('User not found to DB', 'NOT_FOUND'));
                    return mongooseUser = user;
                })
                .then(() => User.comparePassword(mongooseUser, password))
                .then(resolve)
                .catch(reject);
        });
    }

    static authToken(id){
        return new Promise((resolve,reject) => {
            MongooseUser.findOne({_id : id})
                .then((user) => {
                    if(!user) reject(new AuthError('User not found to DB', 'NOT_FOUND'));
                    return user;
                })
                .then(resolve)
                .catch(reject);
        });
    }
    
    static sendToken(email) {
        return new Promise( (resolve,reject) => {
            async.waterfall([createToken,findUser,sendToken], (err,result) => {
                if(err) reject( new AuthError('Not send mail!', 'SERVICE_UNAVAILABLE', {orig : err}));
                resolve(new AuthError('Letter email was sent! Run to your inbox to check it out', 'OK', {orig : result}));
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

    static resetPassword(token,password) {
        return new Promise( (resolve,reject) => {
            MongooseUser.findOne({token : token, expirationDate : {$gt : Date.now()} })
                .then( (user) => {
                    if(!user) {
                        return reject( new AuthError(400,'Password reset token is invalid or has expired.')); 
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
                if(err) return reject(err);
                
                return resolve(result);
            });
        });
    }
    
    static update(stripeId,userId) 
    {
        return new Promise( (resolve,reject) => {
            MongooseUser.update({_id : userId}, {$set : {stripeId : stripeId}}, (err,result) => {
                if(err) return reject(err);
                
                return resolve(result);
            });
        });
    }
}

module.exports = User;

