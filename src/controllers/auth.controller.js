const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  const { username, email, password, bio = " ", role = "user" } = req.body;
  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: "User already exists",
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
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
  });

  res.status(201).json({
    message: "User registered successfully",
  });
}

async function loginUser(req, res) {
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
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
  });

  res.status(200).json({
    message: "User logged in Succesfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

module.exports = { registerUser, loginUser };
