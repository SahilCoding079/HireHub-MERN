import express from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { getAllPublicJobs, getPublicJobByID, searchJobs } from "../controllers/publicJob.controller.js";

const publicJobRoute = express.Router();
publicJobRoute.get("/", getAllPublicJobs);
publicJobRoute.get("/search", verifyJwt, searchJobs);
publicJobRoute.get("/:id", getPublicJobByID);

export default publicJobRoute;
