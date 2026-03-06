const express = require('express');
const createPostController = require('../controllers/createPost.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require("../middleware/upload.middleware.js");

const router = express.Router();

router.post('/post', authMiddleware.authMiddlewareCheckUser,upload.single("image"), createPostController.createPost);

module.exports = router;