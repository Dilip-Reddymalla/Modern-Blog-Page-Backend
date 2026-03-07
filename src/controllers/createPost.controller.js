const postModel = require("../models/post.model");
const uploadFile = require("../services/imagekit.service.js");
const slugify = require("slugify");
const nanoid = require("nanoid");

async function createPost(req, res, next) {
  try {
    const { title, content, tags } = req.body;

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

module.exports = { createPost };
