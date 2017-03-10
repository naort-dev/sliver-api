const MongooseUser = require('../models/mongoose/user');
const async = require('async');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const config = require('../config');

class User {
    static signUp(userData) {
        return new MongooseUser(userData).save();
    }
    
    static comparePassword(user, candidatePassword){
         return new Promise((resolve, reject) => {
            bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
                if (err) reject(err);
                resolve(isMatch);
            });
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
                .then((isMatch) => {
                    if(!isMatch) {
                        // const err = new Error();
                        // err.status = 400;
                        // console.log(err);
                        return reject({msg : "Password miss match"});
                    }
                    
                    return mongooseUser.id;
                })
                .then(resolve)
                .catch(reject);
        });
    }
    
    static forgot(email) {
        // return new Promise( (resolve,reject) => {
        //     async.waterfall([createToken,findUser,sendToken], (err,result) => {
        //         if(err) reject(err)
        //     });
        // });
        //
        //
        //
        // function createToken (callback) {
        //     let token = bcrypt.genSaltSync(10);
        //     callback(null,token);
        // }
        //
        // function findUser(token,callback) {
        //     MongooseUser.findOne({email : email})
        //         .then(user => {
        //             if(!user) callback('User not found in db');
        //             user.token = token;
        //             user.expirationDate = Date.now() + 360000;
        //             user.save()
        //                 .then(user => callback(null,token,user))
        //                 .catch(reject);
        //         });
        //     // MongooseUser.findOne({email : email}, (err,user) => {
        //     //     if(err) callback(err);
        //     //
        //     //     if(!user) {
        //     //         callback('User not found');
        //     //     }
        //     //     //
        //     //     user.token = token;
        //     //     user.expirationDate = Date.now() + 360000;
        //     //
        //     //     user.save()
        //     //         .then((user) => {
        //     //             callback(null,token,user);
        //     //         })
        //     //         .catch( (err) => {
        //     //             callback(err);
        //     //         });
        //     // };
        // }
        //
        // function sendToken(token,user,callback) {
        //     console.log(token,123,user);
        // //     let transport = nodemailer.createTransport(config.mailer);
        // //
        // //     let mailOptions = {
        // //         to: user.email,
        // //         from: 'passwordreset@demo.com',
        // //         subject: 'Node.js Password Reset',
        // //         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        // //         'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        // //         'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        // //         'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        // //     };
        // //
        // //     transport.sendMail(mailOptions, (err, result) => {
        // //         callback(err,result);
        // //     });
        // //
        // }
    }
}

module.exports = User;

