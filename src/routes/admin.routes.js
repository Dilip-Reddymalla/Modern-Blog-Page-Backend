const express = require('express');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.patch('/approve/:id', authMiddleware.authMiddlewareCheckAdmin, adminController.approvePost);
router.delete('/post/:id', authMiddleware.authMiddlewareCheckAdmin, adminController.forceDeletePost);
router.put('/user/:id/ban', authMiddleware.authMiddlewareCheckAdmin, adminController.banUser);
router.get('/stats', authMiddleware.authMiddlewareCheckAdmin, adminController.getSystemStats);

module.exports = router;