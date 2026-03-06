const postModel = require("../models/post.model");
const mongoose = require("mongoose");

async function approvePost(req, res, next) {

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Post ID format" });
        }
        
        const post = await postModel.findByIdAndUpdate(
            req.params.id,
            { approvalStatus: "approved" },
            { returnDocument: "after" }
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json({
            message: "Post approved",
            post
        });

    } catch (error) {
        next(error);
    }

}

module.exports = approvePost;