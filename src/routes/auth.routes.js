const express = require('express');
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const { registerValidation, loginValidation } = require('../validators/auth.validator');
const validateRequest = require('../middleware/validateRequest.middleware');


const router = express.Router();


router.post('/register', authLimiter, registerValidation, validateRequest, authController.registerUser);
router.post('/login', authLimiter, loginValidation, validateRequest, authController.loginUser);

module.exports = router;
