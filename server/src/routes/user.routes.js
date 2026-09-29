import express from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { deleteProfilePhoto, deleteResume, getUserProfile, updateProfile, updateProfilePhoto, uploadResume } from "../controllers/user.controller.js";
import upload from "../middleware/upload.middleware.js";
import resumeUpload from "../middleware/uploadResume.middleware.js";

const userRouter = express.Router();
userRouter.use(verifyJwt);
userRouter.use(authorizeRoles("user"));

userRouter.get("/profile",getUserProfile);
userRouter.patch("/profile",updateProfile);
userRouter.patch("/profile/photo",upload.single("profilePhoto"), updateProfilePhoto);
userRouter.delete("/profile/photo", deleteProfilePhoto);
userRouter.post("/profile/resume",resumeUpload.single("resume"), uploadResume);
userRouter.delete("/profile/resume", deleteResume);
export default userRouter;