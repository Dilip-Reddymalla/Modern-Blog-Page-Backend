const { validationResult } = require('express-validator');

// This middleware checks if any of the express-validator rules failed.
// If there are errors, it immediately returns a 400 response with the error details.
// If no errors, it calls next() to pass the request to your controller.
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: "Validation failed",
            errors: errors.array() 
        });
    }
    next();
};

module.exports = validateRequest;
