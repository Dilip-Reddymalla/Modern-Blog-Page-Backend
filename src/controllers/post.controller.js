const postModel = require("../models/post.model.js");
const uploadFile = require("../services/imagekit.service.js");
const slugify = require("slugify");
const {nanoid} = require("nanoid");
const mongoose = require("mongoose");

async function createPost(req, res, next) {
  try {
    const { title, content, tags } = req.body;
    console.log(req.user);
    if(req.user.status ===  "banned"){
      return res.status(403).json({
        message: "You are banned from creating posts",
      });
    }

    let imageUrl = null;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const slug = `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;

    if (req.file) {
      imageUrl = await uploadFile(req.file);
    }
    const newPost = await postModel.create({
      title: title,
      slug: slug,
      content: content,
      tags: tags || [],
      coverImage: imageUrl,
      author: req.user.id,
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
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

    if (post.author.toString() === userId || req.user.role === "admin") {
      await post.deleteOne();

      return res.status(200).json({
        message: "Post deleted successfully",
      });
    }

    return res.status(403).json({
      message: "Admin or author access required",
    });
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, res, next) {
  try {
    const postId = req.params.id;
    const { title, content, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
       return res.status(400).json({ message: "Invalid Post ID format" });
    }

    const userId = req.user.id;
    const post = await postModel.findById(postId);

    if (!post) {
       return res.status(404).json({ message: "Post not found" });
    }

    // Only the author can update the post
    if (post.author.toString() !== userId) {
       return res.status(403).json({ message: "You can only edit your own posts" });
    }

    // Prepare update data
    const updateData = {};
    if (title) {
        updateData.title = title;
        updateData.slug = `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;
    }
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags;
    
    // Check if new image is uploaded
    if (req.file) {
        updateData.coverImage = await uploadFile(req.file);
    }

    const updatedPost = await postModel.findByIdAndUpdate(
        postId,
        updateData,
        { new: true, runValidators: true }
    );

    res.status(200).json({
       message: "Post updated successfully",
       post: updatedPost
    });

  } catch (error) {
    next(error);
  }
}

module.exports = { createPost, deletePost, updatePost };
