export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: 'strict', // Adjust based on your requirements
};
export const accessTokenCookieOptions = {
  ...cookieOptions,
  maxAge: 10 * 60 * 1000, // 10 minutes in milliseconds
}
export const refreshCookieOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
}
export const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: 'strict', // Adjust based on your requirements
};