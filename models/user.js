const MongooseUser = require('../models/mongoose/user');
const password = require('../libs/password');
const async = require('async');
const nodemailer = require('nodemailer');
const ses =require('nodemailer-ses-transport');
const config = require('../config');

class User {
    static signUp(userData) {
        userData.password = password.hash(userData.password);
        return new MongooseUser(userData).save();
    }
    
    static comparePassword(user, candidatePassword){
         return new Promise((resolve, reject) => {
             if(password.validate(user.password,candidatePassword)) {
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
    
    static resetPassword(email) {
        return new Promise( (resolve,reject) => {
            async.waterfall([createToken,findUser,sendToken], (err,result) => {
                console.log(123,err);
            });
        });



        function createToken (callback) {
            let token = password.hash(email);
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
                    from: 'admin@silverlininglimited.com',
                    to: 'pedchenko07@gmail.com',
                    subject: 'dbuysuy',
                    text: 'Hello AWS'
                },
                (err,info) => {
                    // if(err){
                    //     res.send('error');
                    // } else {
                    //     res.send('sent');
                    // }
                    console.log(info);
                    console.log(err);

                });          
            
            //
            // let mailOptions = {
            //     to: 'pedchenko07@gmail.com',
            //     from: 'admin@silverlininglimited.com',
            //     subject: 'Node.js Password Reset',
            //     text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            //     'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            //     'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            //     'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            // };
            //
            // transport.sendMail(mailOptions, (err, result) => {
            //     callback(err,result);
            // });

        }
    }
}

module.exports = User;

