import ApiError from "../utils/ApiError.js";

export const authorizeRoles = (...role) => {
  return (req, res, next) => {
    if (!req.user) return next(new ApiError(401, "Unauthorized."));
    if (!role.includes(req.user.role))
      return next(
        new ApiError(403, "You are not authorized to perform this action."),
      );
    next();
  };
};
