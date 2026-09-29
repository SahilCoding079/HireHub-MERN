import express from "express";
import { appliedJob, applyJob } from "../controllers/application.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const applicationRouter = express.Router();
applicationRouter.use(verifyJwt);
applicationRouter.use(authorizeRoles("user"));


applicationRouter.post("/:jobId", applyJob);
applicationRouter.get("/me", appliedJob);

export default applicationRouter;