const { body } = require('express-validator');

const registerValidation = [
    // Username must be at least 3 chars long
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage('Username must be strictly between 3 and 30 characters')
        .isAlphanumeric().withMessage('Username must only contain letters and numbers'),
    
    // Email must be a valid email format
    body('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(), // Converts uppercase to lowercase, removes dots in gmail etc.
    
    // Password must be at least 6 chars
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    // Bio is optional, but if provided, it shouldn't exceed a certain length
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters')
];

const loginValidation = [
    // Login allows either username or email in the 'username' field based on your controller logic,
    // so we just check it's not empty string
    body('username')
        .trim()
        .notEmpty().withMessage('Username or Email is required'),
        
    body('password')
        .notEmpty().withMessage('Password is required')
];

module.exports = { registerValidation, loginValidation };
