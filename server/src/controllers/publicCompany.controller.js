import mongoose from "mongoose";
import Company from "../models/company.model.js";
import ApiError from "../utils/ApiError.js";

export const getPublicCompanies = async(req, res, next) => {
  try {
    const companies = await Company.find().sort({createdAt: -1}).select("name logo location website");
    return res.status(200).json({
      success: true,
      data: companies
    });
  } catch (error) {
    return next(error);
  }
};
export const getPublicCompanyById = async(req, res, next) => {
  const {id} = req.params;
  if(!mongoose.Types.ObjectId.isValid(id))
    return next(new ApiError(400, "Invalid company ID."));
  try {
    const company = await Company.findById(id);
    if(!company)
      return next(new ApiError(404, "Company not found."));
    return res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    return next(error);
  }
};