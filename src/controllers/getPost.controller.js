const postModel = require("../models/post.model");
const mongoose = require("mongoose");
async function getAllPosts(req, res, next) {
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
    next(error);
  }
}

async function pendingAprovalPosts(req, res, next) {
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
    next(error);
  }
}

async function postById(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Post ID format" });
    }
    const post = await postModel.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.json({
      message: "Post fetched",
      post,
    });
  } catch (error) {
    next(error);
  }
}

async function postByTag(req, res, next){
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
    next(error);
  }
}

module.exports = { getAllPosts, pendingAprovalPosts, postById, postByTag };
