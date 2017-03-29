let express = require('express');
let router = express.Router();

//Validators
let signinValid = require('../middleware/validation/signinValid');
let signupValid = require('../middleware/validation/signupValid');
let productValid = require('../middleware/validation/productValid');

//Middleware
const isAdmin = require('../middleware/isAdmin');

//Controllers
let authController = require('../controllers/authController');
let productController = require('../controllers/admin/productController');
let authAdminController = require('../controllers/admin/authAdminController');

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
router.get('/v1/auth/', (req, res) => runAction(authController.auth, req, res));
router.post('/v1/auth/', signinValid, (req, res) => runAction(authController.signin, req, res));
router.post('/v1/auth/signup', signupValid, (req, res) => runAction(authController.signup, req, res));

router.post('/createProduct', productValid, (req,res) => runAction(productController.create,req,res));

//AuthAdmin
router.get('/v1/auth/reset', (req, res) => runAction(authController.sendToken, req, res));
router.post('/v1/auth/check-password', (req,res) => runAction(authController.checkPassword,req,res));

//Admin
router.get('/admin/auth/', (req, res) => runAction(authController.auth, req, res));
router.post('/admin/auth', signinValid, (req,res) => runAction(authAdminController.signinAdmin,req,res));


//Manage
router.post('/admin/products', isAdmin, productValid, (req, res) => runAction(productController.create, req, res));
router.get('/admin/products', isAdmin, (req, res) => runAction(productController.getProducts, req, res));
router.get('/admin/products/:id', isAdmin, (req, res) => runAction(productController.getProduct, req, res));
router.put('/admin/products/:id', isAdmin, (req, res) => runAction(productController.updateProduct, req, res));
router.post('/admin/products/:id', isAdmin, (req, res) => runAction(productController.deleteProduct, req, res));

module.exports = router;