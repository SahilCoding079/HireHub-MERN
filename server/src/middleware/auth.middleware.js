import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const verifyJwt = async(req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided."
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. User not found."
      });
    }
    req.user = user; // Attach the decoded user information to the request object
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token."
    });
  }
};