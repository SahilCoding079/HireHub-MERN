import express from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { createJob, deleteJob, getAllJobs, getJobById, updateJob } from "../controllers/job.controller.js";

const jobRouter = express.Router();

jobRouter.use(verifyJwt);
jobRouter.use(authorizeRoles("recruiter"));

jobRouter.post("/", createJob);
jobRouter.get("/", getAllJobs);
jobRouter.patch("/:id", updateJob); 
jobRouter.get("/:id", getJobById); 
jobRouter.delete("/:id", deleteJob); 


export default jobRouter;