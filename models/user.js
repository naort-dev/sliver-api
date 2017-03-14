const MongooseUser = require('../models/mongoose/user');
const hashPass = require('../libs/password');
const async = require('async');
const nodemailer = require('nodemailer');
const ses =require('nodemailer-ses-transport');
const config = require('../config');

class User {
    static signUp(userData) {
        userData.password = hashPass.hash(userData.password);
        return new MongooseUser(userData).save();
    }
    
    static comparePassword(user, candidatePassword){
         return new Promise((resolve, reject) => {
             if(hashPass.validate(user.password,candidatePassword)) {
                return resolve({
                    token : user.id
                });
             }
             return reject({msg : "Password miss match"});
             
        });
    }

    static signIn(email, password) {
        return new Promise((resolve, reject) => {
            let mongooseUser;

            MongooseUser.findOne({email : email})
                .then((user) => {
                    if(!user) reject({msg : 'User not found to DB'});
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
                    if(!user) reject({msg : 'User not found to DB'});
                    return user;
                })
                .then(resolve)
                .catch(reject);
        });
    }
    
    static sendToken(email) {
        return new Promise( (resolve,reject) => {
            async.waterfall([createToken,findUser,sendToken], (err,result) => {
                if(err) reject(err);
                resolve({ msg : 'mail sended!'});
            });
        });

        function createToken (callback) {
            let token = hashPass.hash(email);
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
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + config.host + '/reset/' + token + '\n\n' +
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
                        return resolve({msg : 'Password reset token is invalid or has expired.'}); // TODO: errorhandler
                    }
                    
                    user.token = '';
                    user.expirationDate = '';
                    user.password = hashPass.hash(password);
                    
                    user.save()
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }
}

module.exports = User;

