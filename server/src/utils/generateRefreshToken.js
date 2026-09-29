import jwt from "jsonwebtoken";

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      tokenType: "refresh",
    },
    process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    },
  );
};

export default generateRefreshToken;