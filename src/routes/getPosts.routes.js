const express = require("express");
const router = express.Router();

const getPostController = require("../controllers/getPost.controller.js");
const authMiddileware = require('../middleware/auth.middleware');

router.get("/allposts", getPostController.getAllPosts);
router.get("/post/:id", getPostController.postById);
router.get("/postByTag/:tag", getPostController.postByTag);
router.get("/pendingAprovalPosts", authMiddileware.authMiddlewareCheckAdmin ,getPostController.pendingAprovalPosts);

module.exports = router;
