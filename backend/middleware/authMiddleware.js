const jwt = require("jsonwebtoken"); 

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("❌ No token found in cookies");
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified, decoded user:", decoded);
    req.user = decoded;
    console.log('Decoded user info in auth middleware:', req.user);
    next();
  } catch (error) {
    console.error("❌ Invalid token", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;