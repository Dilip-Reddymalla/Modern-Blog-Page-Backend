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
  "/:id/addComment",
  authMiddleware.authMiddlewareCheckUser,
  toggleAndCommentController.addComment,
);
router.patch(
  "/:postid/deleteComment/:commentId",
  authMiddleware.authMiddlewareCheckUser,
  toggleAndCommentController.deleteComment,
); 
router.get("/:id/comments",toggleAndCommentController.getCommentByPostId);

module.exports = router;
