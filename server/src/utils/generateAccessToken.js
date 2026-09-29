import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '10m', // Default to 10 minutes if not set
    }
  );
};

export default generateAccessToken;