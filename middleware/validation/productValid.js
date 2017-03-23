module.exports = (req,res,next) => {
    req.assert('product_name')
        .notEmpty().withMessage('Product name is not empty')
        .isLength({min : 4}).withMessage('Product name is min 4 letters');

    req.assert('product_description')
        .notEmpty().withMessage('Product description is not empty');

    req.assert('build_fee')
        .isInt().withMessage('Build fee is only number');

    req.assert('of_build_month')
        .isInt().withMessage('Build month is require');

    req.assert('execute_fee')
        .isInt().withMessage('Execute fee is require');
    
    req.assert('of_execute_fee')
        .isInt().withMessage('Of Execute month is require');

    req.assert('billing_period')
        .isInt().withMessage('Execute fee is require');

    req.assert('plan_type')
        .isInt().withMessage('Plan type is require');
    
    req.assert('product_display_order')
        .notEmpty().withMessage('Product display order is require');

    req.assert('product_status')
        .notEmpty().withMessage('Product status order is require');
    
    req.assert('product_type')
        .notEmpty().withMessage('Product status order is require')
        .isArray().withMessage('Product status is not array');

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