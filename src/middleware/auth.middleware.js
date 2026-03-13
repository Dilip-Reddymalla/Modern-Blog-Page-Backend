const jwt = require("jsonwebtoken");

const getToken = (req) => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const authMiddlewareCheckUser = (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;

  next();
};
const authMiddlewareCheckAdmin = (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    if (decoded.role === "admin" || decoded.role === "owner") {
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

const authMiddlewareCheckOwner = (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    if (decoded.role === "owner") {
      return next();
    }

    return res.status(403).json({
      message: "Owner access required",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = { authMiddlewareCheckUser, authMiddlewareCheckAdmin, authMiddlewareCheckOwner };
