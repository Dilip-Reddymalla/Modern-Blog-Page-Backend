const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const multer = require("multer");
const cors = require("cors");
const helmet = require("helmet");

const authRouter = require("./routes/auth.routes");
const PostRouter = require("./routes/post.routes");
const getPostsRouter = require("./routes/getPosts.routes");
const interactionRouter = require("./routes/interaction.routes");
const adminRouter = require("./routes/admin.routes");
const userRouter = require("./routes/user.routes");
const errorHandler = require("./middleware/errorHandler");

const { globalLimiter } = require("./middleware/rateLimit.middleware");

const app = express();

app.set("trust proxy", 1);

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      callback(new Error("CORS not allowed"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter); // Apply global rate limiting to *all* requests

app.use("/api/auth", authRouter);
app.use("/api/create", PostRouter);
app.use("/api/get", getPostsRouter);
app.use("/api/interaction", interactionRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

// Global Error Handler should be the last middleware
app.use(errorHandler);

module.exports = app;
