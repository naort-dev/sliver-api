let expressValidator = require('express-validator');

module.exports = (req,res,next) => {

    console.log(req.checkBody('postparam'),123);

};