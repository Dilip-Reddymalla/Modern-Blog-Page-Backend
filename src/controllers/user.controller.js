const postModel = require("../models/post.model");
const userModel = require("../models/user.model");

async function getUserById(req, res, next) {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        message: "invalid user id",
      });
    }
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }
    res.status(200).json({
      message: "User Fetched",
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllUserPosts(req, res, next) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    const posts = await postModel
      .find({ author: userId })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(404).json({
        message: "User has no posts",
      });
    }

    res.status(200).json({
      message: "Fetched all posts from user",
      count: posts.length,
      posts,
    });
  } catch (error) {
    next(error);
  }
}

async function updateUserProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { username, bio } = req.body;

    // Build the update object dynamically
    const updateData = {};
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio; // Allow empty string for bio 

    if (Object.keys(updateData).length === 0) {
       return res.status(400).json({ message: "No fields provided to update" });
    }

    // Check if the new username is already taken by someone else
    if (username) {
        const existingUser = await userModel.findOne({ username, _id: { $ne: userId } });
        if (existingUser) {
             return res.status(409).json({ message: "Username is already taken" });
        }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
       userId,
       updateData,
       { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
       message: "Profile updated successfully",
       user: updatedUser
    });

  } catch (error) {
     next(error);
  }
}

module.exports = { getUserById, getAllUserPosts, updateUserProfile };
