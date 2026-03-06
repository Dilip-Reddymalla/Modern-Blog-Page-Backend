const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const toggleAndCommentController = require("../controllers/toggleAndComment.controller");

router.patch("/toggleLike/:id", authMiddleware.authMiddlewareCheckUser, toggleAndCommentController.toggleLike);

module.exports = router;
