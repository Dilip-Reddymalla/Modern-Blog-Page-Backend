const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: {
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limiter specifically for authentication routes (login/register) to prevent brute-force attacks
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 100, // Increased to 100 to prevent blocking during development/testing
    message: {
        message: 'Too many accounts created or login attempts from this IP, please try again after an hour'
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

module.exports = { globalLimiter, authLimiter };
