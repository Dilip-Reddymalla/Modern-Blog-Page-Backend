const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const authRouter = require('./routes/auth.routes');
const createPostRouter = require('./routes/createPost.routes');
const getPostsRouter = require('./routes/getPosts.routes');
const interactionRouter = require('./routes/interaction.routes');

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/create', createPostRouter);
app.use('/api/get',getPostsRouter);
app.use('/api/interaction',interactionRouter);



module.exports = app;
