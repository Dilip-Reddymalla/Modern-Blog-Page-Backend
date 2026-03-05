const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const toggleAndCommentController = require("../controllers/toggleAndComment.controller");

router.post(
  "/toggleLike/:id",
  authMiddleware,
  toggleAndCommentController.toggleLike,
);

module.exports = router;
