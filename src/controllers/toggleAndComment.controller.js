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

async function deleteComment(req, res, next) {
  try {
    const postId = req.params.postid;
    const commentId = req.params.commentId;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID format" });
    }

    const userId = req.user.id;
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.user.toString() === userId || req.user.role === "admin") {
      comment.deleteOne();

      await post.save();

      res.json({
        message: "Comment deleted successfully",
        comments: post.comments,
      });
    }

    return res.status(403).json({
      message: "Admin or author access required",
    });
  } catch (error) {
    next(error);
  }
}

async function editComment(req, res, next) {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid Post or Comment ID format" });
    }

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const userId = req.user.id;
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only the author of the comment can edit it
    if (comment.user.toString() !== userId) {
       return res.status(403).json({ message: "You can only edit your own comments" });
    }

    comment.text = text;
    await post.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment: comment
    });

  } catch (error) {
    next(error);
  }
}

async function getCommentByPostId(req, res, next) {
  try {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Fectched the comments for the post",
      comments: post.comments,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { toggleLike, addComment, deleteComment, editComment, getCommentByPostId};
