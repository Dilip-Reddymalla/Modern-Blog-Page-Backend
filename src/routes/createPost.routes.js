const express = require('express');
const createPostController = require('../controllers/createPost.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/post', authMiddleware, createPostController.createPost);

module.exports = router;