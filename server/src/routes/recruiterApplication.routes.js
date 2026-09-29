import express from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getApplicantDetails, getApplicants, scheduleInterview, updateStatus } from "../controllers/application.controller.js";

const recruiterApplicationRouter = express.Router();

recruiterApplicationRouter.use(verifyJwt);
recruiterApplicationRouter.use(authorizeRoles("recruiter"));

recruiterApplicationRouter.get("/job/:jobId", getApplicants);
recruiterApplicationRouter.get("/:applicationId", getApplicantDetails);
recruiterApplicationRouter.patch("/:applicationId/status", updateStatus);
recruiterApplicationRouter.patch("/:applicationId/interview", scheduleInterview);
export default recruiterApplicationRouter;