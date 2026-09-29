import express from "express";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { createCompany, deleteCompany, getAllCompanies, getCompanyById, updateCompany } from "../controllers/company.controller.js";

const companyRouter = express.Router();

companyRouter.post("/",verifyJwt,authorizeRoles("recruiter"), createCompany);
companyRouter.get("/",verifyJwt,authorizeRoles("recruiter"), getAllCompanies);
companyRouter.get("/:id",verifyJwt,authorizeRoles("recruiter"), getCompanyById);
companyRouter.patch("/:id",verifyJwt,authorizeRoles("recruiter"), updateCompany);
companyRouter.delete("/:id",verifyJwt,authorizeRoles("recruiter"), deleteCompany);


export default companyRouter;