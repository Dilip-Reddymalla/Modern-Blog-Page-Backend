const postModel = require("../models/post.model");
async function getAllPosts(req, res) {
  try {
    const posts = await postModel
      .find()
      .populate("author", "username email")
      .populate("likes", "username email")
      .populate("comments.user", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json({
      count: posts.length,
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching posts",
      error: error.message,
    });
  }
}

module.exports = { getAllPosts };
