import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import {
  accessTokenCookieOptions,
  clearCookieOptions,
  refreshCookieOptions,
} from "../utils/cookieOptions.js";

import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendPasswordResetEmail from "../utils/sendPasswordResetEmail.js";

export const registerUser = async (req, res, next) => {
  const { fullName, email, password, role } = req.body;
  if (!fullName || !email || !password || !role)
    return next(new ApiError(400, "All fields are required."));
  try {
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser)
      return next(new ApiError(409, "User already exists with this email."));
    
    let profilePhoto = "";
    let profilePhotoPublicId = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "hirehub/profile-photos",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      profilePhoto = result.secure_url;
      profilePhotoPublicId = result.public_id;
    }

    const newUser = new User({
      fullName,
      email,
      password,
      role,
      profilePhoto,
      profilePhotoPublicId
    });
    await newUser.save();
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        profilePhoto: newUser.profilePhoto
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ApiError(400, "Email and password are required."));
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ApiError(401, "Invalid email or password."));
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new ApiError(401, "Invalid email or password."));

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    return next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  const email = req.body.email?.trim().toLowerCase();
  if (!email) return next(new ApiError(400, "Email is required."));
  try {
    const user = await User.findOne({ email }).select("+passwordResetToken +passwordResetExpires");
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
      await user.save({ validateBeforeSave: false });
      const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/change-password?token=${resetToken}`;
      await sendPasswordResetEmail(email, resetUrl);
    }

    return res.status(200).json({
      success: true,
      message: "If an account exists for that email, a password reset link has been sent.",
    });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const email = req.body.email?.trim().toLowerCase();
  const { token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return next(new ApiError(400, "Email, reset token, and new password are required."));
  }
  if (newPassword.length < 6) {
    return next(new ApiError(400, "New password must be at least 6 characters long."));
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      email,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");
    if (!user) return next(new ApiError(400, "This password reset link is invalid or expired."));

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.clearCookie("accessToken", clearCookieOptions);
    res.clearCookie("refreshToken", clearCookieOptions);
    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please log in with your new password.",
    });
  } catch (error) {
    return next(error);
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("accessToken", clearCookieOptions);
  res.clearCookie("refreshToken", clearCookieOptions);
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new ApiError(401, "Refresh token is required."));
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_SECRET_KEY,
    );

    if (decoded.tokenType !== "refresh") {
      return next(new ApiError(401, "Invalid refresh token."));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError(401, "User not found."));
    }

    const nextAccessToken = generateAccessToken(user);
    const nextRefreshToken = generateRefreshToken(user);
    res.cookie("accessToken", nextAccessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", nextRefreshToken, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired refresh token."));
  }
};
