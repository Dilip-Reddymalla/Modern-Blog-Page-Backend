const express = require("express");
const router = express.Router();

const getPostController = require("../controllers/getPost.controller.js");

router.get("/allposts", getPostController.getAllPosts);

module.exports = router;
