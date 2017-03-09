let express = require('express');
let router = express.Router();
let authValid = require('../middleware/authValid');
let authController = require('../controllers/authController');
 
router.post('/v1/auth/signin', authValid, authController.signin);
router.post('/v1/auth/signup', authController.signup);

module.exports = router;