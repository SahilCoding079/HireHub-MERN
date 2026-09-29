import express from "express";
import {verifyJwt} from "../middleware/auth.middleware.js"
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getRecruiterDashboard, getUserDashboard } from "../controllers/dashboard.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/user", verifyJwt, authorizeRoles("user"), getUserDashboard);
dashboardRouter.get("/recruiter", verifyJwt, authorizeRoles("recruiter"), getRecruiterDashboard);
export default dashboardRouter;