const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const authRouter = require('./routes/auth.routes');
const createPostRouter = require('./routes/createPost.routes');



const app = express();
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/create/', createPostRouter);



module.exports = app;
