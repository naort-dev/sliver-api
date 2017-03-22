let express = require('express');
let router = express.Router();

let signinValid = require('../middleware/validation/signinValid');
let signupValid = require('../middleware/validation/signupValid');
let productValid = require('../middleware/validation/productValid');

//Controllers
let authController = require('../controllers/authController');
let productController = require('../controllers/productController');
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
router.post('/admin/auth', signinValid, (req,res) => runAction(authAdminController.signinAdmin,req,res));


module.exports = router;