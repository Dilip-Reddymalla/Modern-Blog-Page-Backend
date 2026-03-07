const express = require('express');
const postController = require('../controllers/post.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');
const upload = require("../middleware/upload.middleware.js");

const router = express.Router();

router.post('/post', authMiddleware.authMiddlewareCheckUser,upload.single("image"), postController.createPost);
router.put('/post/:id', authMiddleware.authMiddlewareCheckUser, upload.single("image"), postController.updatePost);
router.delete("/post/:id",authMiddleware.authMiddlewareCheckUser,postController.deletePost);

module.exports = router;