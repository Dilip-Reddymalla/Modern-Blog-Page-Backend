const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");

async function approvePost(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }

    const post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.approvalStatus === "approved") {
      return res.status(400).json({ message: "Post already approved" });
    }
    post.approvalStatus = "approved";
    await post.save();

    res.json({
      message: "Post approved",
      post,
    });
  } catch (error) {
    next(error);
  }
}

async function forceDeletePost(req, res, next) {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }

    // We already know it's an admin from the middleware
    const post = await postModel.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post forcibly deleted by admin",
      deletedPostId: post._id,
    });
  } catch (error) {
    next(error);
  }
}

async function banUser(req, res, next) {
  try {
    const userIdToBan = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userIdToBan)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    // Prevent admin from banning themselves
    if (req.user.id === userIdToBan) {
      return res.status(400).json({ message: "Admins cannot ban themselves" });
    }

    const user = await userModel.findById(userIdToBan);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle ban status
    const newStatus = user.status === "active" ? "banned" : "active";

    user.status = newStatus;
    await user.save();

    res.status(200).json({
      message: `User status successfully changed to ${newStatus}`,
      user: { _id: user._id, username: user.username, status: user.status },
    });
  } catch (error) {
    next(error);
  }
}

async function unbanUser(req, res, next) {
  try {
    const userIdToUnban = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userIdToUnban)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const user = await userModel.findById(userIdToUnban);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === "active") {
      return res.status(400).json({ message: "User is already active" });
    }

    user.status = "active";
    await user.save();

    res.status(200).json({
      message: "User unbanned successfully",
      user: { _id: user._id, username: user.username, status: user.status },
    });
  } catch (error) {
    next(error);
  }
}

async function getSystemStats(req, res, next) {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalPosts = await postModel.countDocuments();
    const pendingPosts = await postModel.countDocuments({
      approvalStatus: "pending",
    });

    // Count total comments across all posts using MongoDB Aggregation
    const commentStats = await postModel.aggregate([
      {
        $project: {
          numberOfComments: { $size: { $ifNull: ["$comments", []] } },
        },
      },
      { $group: { _id: null, totalComments: { $sum: "$numberOfComments" } } },
    ]);

    const totalComments =
      commentStats.length > 0 ? commentStats[0].totalComments : 0;

    res.status(200).json({
      message: "System stats retrieved successfully",
      stats: {
        totalUsers,
        totalPosts,
        pendingPosts,
        totalComments,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  approvePost,
  forceDeletePost,
  banUser,
  unbanUser,
  getSystemStats,
};
