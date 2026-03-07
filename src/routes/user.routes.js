const express = require("express");
const router = express.Router();


const authMiddleware = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

router.get("/profile/:id",authMiddleware.authMiddlewareCheckUser,userController.getUserById);
router.put("/profile",authMiddleware.authMiddlewareCheckUser,userController.updateUserProfile);
router.get("/posts",authMiddleware.authMiddlewareCheckUser,userController.getAllUserPosts);


module.exports = router;