const express = require("express");
const router = express.Router();

const getPostController = require("../controllers/getPost.controller.js");
const authMiddileware = require('../middleware/auth.middleware.js');

router.get("/allposts", getPostController.getAllPosts);
router.get("/search", getPostController.searchPosts);
router.get("/drafts", authMiddileware.authMiddlewareCheckUser, getPostController.getDrafts);
router.get("/post/:slug", getPostController.postBySlug);
router.get("/postByTag/:tag", getPostController.postByTag);
router.get("/pendingAprovalPosts", authMiddileware.authMiddlewareCheckAdmin ,getPostController.pendingAprovalPosts);

module.exports = router;
