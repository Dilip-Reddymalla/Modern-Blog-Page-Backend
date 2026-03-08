const { body } = require('express-validator');

const registerValidation = [
    // Username: allow letters, numbers, underscores, hyphens, and dots
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username can only contain letters, numbers, underscores, hyphens, and dots')
        .escape(),
    
    // Email: provide standard validation
    body('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(), 
    
    // Password: at least 6 characters
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    // Bio: optional, with max length and escaping
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters')
        .escape()
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
