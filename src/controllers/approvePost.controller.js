const postModel = require("../models/post.model");

async function approvePost(req, res) {

    try {
        const post = await postModel.findByIdAndUpdate(
            req.params.id,
            { approvalStatus: "approved" },
            { returnDocument: "after" }
        );

        res.json({
            message: "Post approved",
            post
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

}

module.exports = approvePost;