module.exports = (req,res,next) => {
    req.assert('name')
        .notEmpty().withMessage('name empty')
        .isLength({min : 4, max : 20}).withMessage('name length 4 <= and >= 20');

    req.assert('password')
        .notEmpty().withMessage('password empty')
        .isLength({min : 6}).withMessage('password length < 6');

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