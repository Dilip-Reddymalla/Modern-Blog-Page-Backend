const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res, next) {
  try {
    const { username, email, password, bio = " ", role = "user" } = req.body;
    const isUserAlreadyExist = await userModel.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (isUserAlreadyExist) {
      const field = isUserAlreadyExist.username === username ? "Username" : "Email";
      return res.status(409).json({
        message: `${field} is already taken`,
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
      bio,
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        status: user.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000 // 1 days 
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (!user) {
      return res.status(401).json({
        message: "Invaid Credentials",
      });
    }

    const isPasswordVaild = await bcrypt.compare(password, user.password);

    if (!isPasswordVaild) {
      return res.status(401).json({
        message: "Invaid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        status: user.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000 // 1d
    });

    res.status(200).json({
      message: "User logged in Succesfully",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await userModel.find({}, "-password");
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}

async function makeAdmin(req, res, next) {
  try {
    const userId  = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = "admin";
    await user.save();
    res.status(200).json({
      message: "User promoted to admin successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function removeAdmin(req, res, next) {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "owner") {
      return res.status(403).json({ message: "Cannot modify owner role" });
    }
    user.role = "user";
    await user.save();
    res.status(200).json({
      message: "Admin access removed successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { registerUser, loginUser, getAllUsers, makeAdmin, removeAdmin };
