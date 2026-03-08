const { validationResult } = require('express-validator');

// This middleware checks if any of the express-validator rules failed.
// If there are errors, it immediately returns a 400 response with the error details.
// If no errors, it calls next() to pass the request to your controller.
const validateRequest = (req, res, next) => {
    // Check if body exists and is not empty for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && (!req.body || Object.keys(req.body).length === 0)) {
        console.warn(`[Validation Warning]: Empty request body recieved for ${req.method} ${req.url}`);
        return res.status(400).json({
            message: "Validation failed: Request body is empty",
            errors: [{ msg: "Request body cannot be empty. Please ensure you are sending JSON and have the 'Content-Type: application/json' header set.", path: "body", location: "body" }]
        });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(`[Validation Error] ${req.method} ${req.url}:`, errors.array());
        return res.status(400).json({ 
            message: "Validation failed",
            errors: errors.array() 
        });
    }
    next();
};

module.exports = validateRequest;
