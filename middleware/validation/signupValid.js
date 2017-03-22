module.exports = (req,res,next) => {
    req.assert('name')
        .notEmpty().withMessage('name empty')
        .isLength({min : 4, max : 20}).withMessage('name length 4 <= and >= 20');

    // req.assert('lastName')
    //     .notEmpty().withMessage('lastName empty')
    //     .isLength({min : 4, max : 20}).withMessage('lastName length 4 <= and >= 20');

    // req.assert('businessName')
    //     .notEmpty().withMessage('businessName empty')
    //     .isLength({min : 4, max : 20}).withMessage('businessName length 4 <= and >= 20');

    req.assert('email')
        .notEmpty().withMessage('email empty')
        .isEmail().withMessage('correct email');

    req.assert('password')
        .notEmpty().withMessage('password empty')
        .isLength({min : 6, max : 30}).withMessage('businessName length 4 <= and >= 20')
        .equals(req.body.confirmPassword).withMessage('password is invalid confirm');

    // req.assert('phone')
    //     .notEmpty().withMessage('phone empty')
    //     .isLength({min : 8, max : 15}).withMessage('phone length 4 <= and >= 20')
    //     .isInt().withMessage('phone not a number');

    // req.assert('creditCard')
    //     .notEmpty().withMessage('creditCard empty')
    //     .isLength({min : 16,max : 16}).withMessage('creditCard = 16')
    //     .isInt().withMessage('creditCard is not a number');

    // req.assert('securityCode')
    //     .notEmpty().withMessage('securityCode empty')
    //     .isLength({min : 3, max: 3}).withMessage('securityCode = min 3 ')
    //     .isInt().withMessage('securityCode is not a number');

    // req.assert('billingAddress')
    //     .notEmpty().withMessage('securityCode empty');

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