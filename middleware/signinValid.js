module.exports = (req,res,next) => {
    req.assert('email')
        .notEmpty().withMessage('email empty')
        .isEmail().withMessage('is not email');

    req.assert('password')
        .notEmpty().withMessage('password empty')
        .isLength({min : 6}).withMessage('password length < 6')
        .isInt().withMessage('password is not a number');

    req.getValidationResult()
        .then((result) => {
            if(!result.isEmpty()) {
                res.status(400).send(result.array());
                // res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
                return;
            }
            next();
        });
};