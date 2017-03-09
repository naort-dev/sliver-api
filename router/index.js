let express = require('express');
let router = express.Router();

let signinValid = require('../middleware/signinValid');
let signupValid = require('../middleware/signupValid');
let authController = require('../controllers/authController');
 
router.post('/v1/auth/signin', signinValid, authController.signin);
router.post('/v1/auth/signup', signupValid, authController.signup);

module.exports = router;