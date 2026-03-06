const express = require('express');
const approvePostsController = require('../controllers/approvePost.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.patch('/approve/:id', authMiddleware.authMiddlewareCheckAdmin, approvePostsController);

module.exports = router;