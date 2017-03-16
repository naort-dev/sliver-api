let express = require('express');
let router = express.Router();

let signinValid = require('../middleware/signinValid');
let signupValid = require('../middleware/signupValid');
let authController = require('../controllers/authController');

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

router.get('/v1/auth/', (req, res) => runAction(authController.auth, req, res));
router.post('/v1/auth/', signinValid, (req, res) => runAction(authController.signin, req, res));
router.post('/v1/auth/signup', signupValid, (req, res) => runAction(authController.signup, req, res));

router.get('/v1/auth/reset', (req, res) => runAction(authController.sendToken, req, res));
router.post('/v1/auth/check-password', (req,res) => runAction(authController.checkPassword,req,res));

module.exports = router;