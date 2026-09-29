import express from "express";
import { getPublicCompanies, getPublicCompanyById } from "../controllers/publicCompany.controller.js";

const publicCompanyRouter = express.Router();

publicCompanyRouter.get("/", getPublicCompanies);
publicCompanyRouter.get("/:id", getPublicCompanyById);

export default publicCompanyRouter;