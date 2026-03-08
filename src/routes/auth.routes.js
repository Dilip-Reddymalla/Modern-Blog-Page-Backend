const express = require('express');
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const { registerValidation, loginValidation } = require('../validators/auth.validator');
const validateRequest = require('../middleware/validateRequest.middleware');
const { authMiddlewareCheckAdmin, authMiddlewareCheckOwner } = require('../middleware/auth.middleware');


const router = express.Router();


router.post('/register', authLimiter, registerValidation, validateRequest, authController.registerUser);
router.post('/login', authLimiter, loginValidation, validateRequest, authController.loginUser);
router.get('/users',authLimiter,authMiddlewareCheckAdmin, authController.getAllUsers);
router.patch('/make-admin/:id',authLimiter, authMiddlewareCheckAdmin, authController.makeAdmin);
router.patch('/remove-admin/:id',authLimiter, authMiddlewareCheckOwner, authController.removeAdmin);

module.exports = router;
