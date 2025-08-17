const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid token. User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: "Account is deactivated.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired.",
      });
    }

    console.error("Auth middleware error:", error);
    res.status(500).json({
      error: "Internal server error during authentication.",
    });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {});

    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const mechanicMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {});

    if (!["admin", "mechanic"].includes(req.user.role)) {
      return res.status(403).json({
        error: "Access denied. Mechanic or admin privileges required.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  mechanicMiddleware,
};
