const postModel = require("../models/post.model");
const mongoose = require("mongoose");

async function toggleLike(req, res, next) {
  try {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }
    const userId = req.user.id;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: "Like updated",
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
}

async function addComment(req, res, next) {
  try {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }

    const userId = req.user.id;
    const msg = req.body.message;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyCommented = post.comments.some(
      (comment) => comment.userId.toString() === userId,
    );

    if (alreadyCommented) {
      return res.status(403).json({
        message: "Comment already exits",
      });
    } else {
      post.comments.push({
        user: userId,
        text: msg,
      });
    }

    await post.save();

    res.json({
      message: "Comments Updated",
      commentsCount: post.comments.length,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { toggleLike, addComment };
