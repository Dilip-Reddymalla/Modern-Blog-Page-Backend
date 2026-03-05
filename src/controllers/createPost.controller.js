const postModel = require('../models/post.model');

async function createPost(req, res) {

    try {

        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const newPost = await postModel.create({
            title: title,
            content: content,
            tags: tags || [],
            author: req.user.id
        });

        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });

    } catch (error) {

        res.status(500).json({
            message: "Error creating post",
            error: error.message
        });

    }
}

module.exports = { createPost };