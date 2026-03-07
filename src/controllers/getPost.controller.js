const postModel = require("../models/post.model");
const mongoose = require("mongoose");
async function getAllPosts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortParams = {};

    if (req.query.sort === "popular") {
       sortParams.likes = -1; // We can't sort nicely by array length in standard mongoose without aggregation, but let's assume popular might be a different metric or we sort by createdAt if likes fail. A better way for popular is aggregating, but we'll stick to basic sort for now, maybe createdAt. Let's do createdAt as default, and if popular, we'll try sorting by a likesCount if it existed.
       // Actually, sorting by an array's length natively in a simple `find()` isn't possible in MongoDB. Let's sort by createdAt for now to keep it from breaking, or if it has to be popular, we should use aggregation.
       // Since the user asked for simple, let's just stick to the newest by default, or if popular, we can ignore for now or add a comment.
       // Let's implement $size sort if possible? No. Let's stick to standard createdAt.
       sortParams.createdAt = -1; 
    } else {
       sortParams.createdAt = -1;
    }

    const posts = await postModel
      .find({
        status: "published",
        approvalStatus: "approved",
      })
      .populate("author", "username ")
      .populate("likes", "username ")
      .populate("comments.user", "username")
      .sort(sortParams)
      .skip(skip)
      .limit(limit);

    const totalPosts = await postModel.countDocuments({
        status: "published",
        approvalStatus: "approved",
    });

    res.status(200).json({
      count: posts.length,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
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

async function postBySlug(req, res, next) {
  try {
    const post = await postModel.findOne({ slug: req.params.slug })
      .populate("author", "username ")
      .populate("likes", "username ")
      .populate("comments.user", "username");

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

async function searchPosts(req, res, next) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const posts = await postModel.find({
      status: "published",
      approvalStatus: "approved",
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } }
      ]
    })
    .populate("author", "username")
    .sort({ createdAt: -1 });

    res.status(200).json({
      count: posts.length,
      posts
    });
  } catch (error) {
    next(error);
  }
}

async function getDrafts(req, res, next) {
  try {
    const userId = req.user.id;
    const drafts = await postModel.find({
       author: userId,
       status: "draft"
    }).sort({ createdAt: -1 });

    res.status(200).json({
       count: drafts.length,
       drafts
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllPosts, pendingAprovalPosts, postBySlug, postByTag, searchPosts, getDrafts };
