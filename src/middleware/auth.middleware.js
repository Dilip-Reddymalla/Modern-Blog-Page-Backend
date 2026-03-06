const jwt = require("jsonwebtoken");

const authMiddlewareCheckUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;

  next();
};
const authMiddlewareCheckAdmin = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    if (decoded.role === "admin") {
      return next();
    }

    return res.status(403).json({
      message: "Admin access required",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = { authMiddlewareCheckUser, authMiddlewareCheckAdmin };
