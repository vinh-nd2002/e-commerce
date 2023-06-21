const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const generateAccessToken = (uid, role) => {
  return jwt.sign({ uid, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const generateRefreshToken = (uid) => {
  return jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
      if (error)
        return res.status(401).json({
          success: false,
          mes: "Invalid Access Token",
        });

      req.user = decode;
      next();
    });
  } else {
    res.status(401).json({
      success: false,
      mes: "Please login",
    });
  }
});

const isAdmin = asyncHandler((req, res, next) => {
  const { role } = req.user;
  if (!role || role !== "Admin"){
    return res.status(403).json({
      success: false,
      mes: "Require admin role",
    });
  }
  next();
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  isAdmin,
};
