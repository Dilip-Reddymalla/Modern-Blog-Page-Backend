const postModel = require("../models/post.model");

async function toggleLike(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await postModel.findById(postId);

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
    res.status(500).json({ error: error.message });
  }
}

module.exports = { toggleLike };
