const postModel = require("../models/post.model");
async function getAllPosts(req, res) {
  try {
    const posts = await postModel
      .find({
        status: "published",
        approvalStatus: "approved",
      })
      .populate("author", "username ")
      .populate("likes", "username ")
      .populate("comments.user", "username")
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

async function pendingAprovalPosts(req, res) {
  try {
    const posts = await postModel
      .find({
        status: "published",
        approvalStatus: "pending",
      })
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

async function postById(req, res) {
  try {
    const post = await postModel.findById(req.params.id);
    res.json({
      message: "Post fetched",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching posts",
      error: error.message,
    });
  }
}

async function postByTag(req, res){
  try{
    const posts = await postModel.find({
      status:"published",
      approvalStatus: "approved",
      tags: { $in: [req.params.tag] }
    })
    res.status(200).json({
      message:"Fetched posts with the tag",
      posts,
    })
  }catch(error){
    res.status(500).json({
      message: "Error fetching posts",
      error: error.message,
    });
  }
}

module.exports = { getAllPosts, pendingAprovalPosts, postById, postByTag };
