const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const multer = require('multer');

const authRouter = require('./routes/auth.routes');
const createPostRouter = require('./routes/createPost.routes');
const getPostsRouter = require('./routes/getPosts.routes');
const interactionRouter = require('./routes/interaction.routes');
const adminRouter = require('./routes/admin.routes');

const app = express();
app.use(express.json());
app.use(cookieParser());

const upload = multer({storage: multer.memoryStorage()});


app.use('/api/auth', authRouter);
app.use('/api/create', createPostRouter);
app.use('/api/get',getPostsRouter);
app.use('/api/interaction',interactionRouter);
app.use('/api/admin',adminRouter);



module.exports = app;
