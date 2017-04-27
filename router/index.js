let express = require('express');
let router = express.Router();
const schedule = require('../libs/class/Scheduler');

schedule.run();

//Validators
let signinValid = require('../middleware/validation/signinValid');
let signupValid = require('../middleware/validation/signupValid');
let productValid = require('../middleware/validation/productValid');

//Middleware
const isAdmin = require('../middleware/isAdmin');

//Controllers
let authController = require('../controllers/authController');
let couponController = require('../controllers/couponController');
let productController = require('../controllers/admin/productController');
let financialTrackerController = require('../controllers/financialTrackerController');

const runAction =  (action, req, res) => {
    action(req, res)
        .then( (data) => {
            console.log("Data : " + data);
            res.status(200).send(data);
            return;
        })
        .catch((err) => {
            console.log('Router: ' + err);
            res.status(err.status || 400).send(err);
            return;
        });
};

//Auth
router.get('/v1/auth/', (req, res) => runAction(authController.authToken, req, res));
router.post('/v1/auth/', signinValid, (req, res) => runAction(authController.signin, req, res));
router.post('/v1/auth/signup', signupValid, (req, res) => runAction(authController.signup, req, res));

router.post('/createProduct', productValid, (req,res) => runAction(productController.create,req,res));

//Dashboard buy
router.get('/v1/products/plans', (req,res) => runAction(productController.getPlans, req,res));
router.get('/v1/products/builds', (req,res) => runAction(productController.getBuilds, req,res));

//Dashboard buy couponValid
router.get('/v1/coupon/:code/:planId', (req,res) => runAction(couponController.isValidCode, req,res));

//AuthAdmin
router.get('/v1/auth/reset', (req, res) => runAction(authController.sendToken, req, res));
router.post('/v1/auth/check-password', (req,res) => runAction(authController.checkPassword,req,res));

//Admin
router.get('/admin/auth/', (req, res) => runAction(authController.authToken, req, res));
router.post('/admin/auth', signinValid, (req,res) => runAction(authController.signinAdmin,req,res));


//Manage Products
router.post('/admin/products', isAdmin, productValid, (req, res) => runAction(productController.create, req, res));
router.get('/admin/products', isAdmin, (req, res) => runAction(productController.getProducts, req, res));
router.get('/admin/products/:id', isAdmin, (req, res) => runAction(productController.getProduct, req, res));
router.put('/admin/products/:id', isAdmin, (req, res) => runAction(productController.updateProduct, req, res));
router.post('/admin/products/:id', isAdmin, (req, res) => runAction(productController.deleteProduct, req, res));
router.get('/admin/plans', isAdmin, (req,res) => runAction(productController.getPlans, req, res));

//Manage Coupons
router.post('/admin/coupon', isAdmin, (req,res) => runAction(couponController.create, req,res));
router.get('/admin/coupon', isAdmin, (req,res) => runAction(couponController.getCoupons, req,res));
router.get('/admin/coupon/:id', isAdmin, (req,res) => runAction(couponController.getCoupon, req,res));
router.put('/admin/coupon/:id', isAdmin, (req, res) => runAction(couponController.update, req, res));
router.delete('/admin/coupon', isAdmin, (req,res) => runAction(couponController.remove,req,res));

//Reports Financial Tracker
router.get('/admin/financialTracker', isAdmin, (req,res) => runAction(financialTrackerController.getPayments,req,res));


module.exports = router;