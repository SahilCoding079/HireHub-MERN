import express from "express";
import { deleteSavedJob, getSavedJobs, saveJob } from "../controllers/savedJob.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const savedJobRouter = express.Router();
savedJobRouter.use(verifyJwt);
savedJobRouter.use(authorizeRoles("user"));

savedJobRouter.post("/:jobId", saveJob);
savedJobRouter.get("/me", getSavedJobs);
savedJobRouter.delete("/:jobId", deleteSavedJob);


export default savedJobRouter;