const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const toggleAndCommentController = require("../controllers/toggleAndComment.controller");

router.patch(
  "/toggleLike/:id",
  authMiddleware.authMiddlewareCheckUser,
  toggleAndCommentController.toggleLike,
);
router.patch(
  "/addComment/:id",
  authMiddleware.authMiddlewareCheckUser,
  toggleAndCommentController.addComment,
);

module.exports = router;
