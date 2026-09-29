import mongoose from "mongoose";
import Company from "../models/company.model.js";
import ApiError from "../utils/ApiError.js";

export const createCompany = async (req, res, next) => {
  const { name, description, website, location, logo } = req.body;
  if (!name || !description || !location)
    return next(new ApiError(400, "All fields are required."));
  if (!req.user) return next(new ApiError(401, "Unauthorized."));
  const createdBy = req.user._id;
  try {
    const normalizedName = name.trim().toLowerCase();
    const isCompanyExists = await Company.findOne({ name: normalizedName });
    if (isCompanyExists)
      return next(new ApiError(409, "Company with this name already exists."));
    const company = await Company.create({
      name: normalizedName,
      description,
      website,
      location,
      logo,
      createdBy,
    });
    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    return next(error);
  }
};
export const getAllCompanies = async (req, res, next) => {
  if (!req.user) return next(new ApiError(401, "Unauthorized"));
  try {
    const companies = await Company.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    return next(error);
  }
};
export const getCompanyById = async (req, res, next) => {
  const { id } = req.params;
  if(!mongoose.Types.ObjectId.isValid(id))
    return next(new ApiError(400, "Invalid company ID."));
  try {
    const company = await Company.findOne({
      _id: id,
      createdBy: req.user._id,
    });
    if (!company) return next(new ApiError(404, "No company found."));
    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    return next(error);
  }
};
export const updateCompany = async (req, res, next) => {
  const {name, description, website, location, logo} = req.body;
  const {id} = req.params;
  if(!mongoose.Types.ObjectId.isValid(id))
    return next(new ApiError(400, "Invalid company ID."));
  try {
    const updateData = {};
    if(name !== undefined){
      const normalizedName = name.trim().toLowerCase();
      const existingCompany = await Company.findOne({
        _id: {$ne:id},
        name: normalizedName
      });
      if(existingCompany)
        return next(new ApiError(409, "Company name already exists."));
      updateData.name = normalizedName
    }
    if(description !== undefined)
      updateData.description = description.trim();
    if(website !== undefined)
      updateData.website = website.trim();
    if(location !== undefined)
      updateData.location = location.trim();
    if(logo !== undefined)
      updateData.logo = logo
    if(Object.keys(updateData).length === 0)
      return next(new ApiError(400, "No fields provided to update."));
    const updatedCompany = await Company.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user._id,
      },
      updateData,
      { new: true, runValidators: true },
    );
    if(!updatedCompany)
      return next(new ApiError(404, "Company not found"))
    return res.status(200).json({
      success: true,
      message: "Company updated successfully.",
      data: updatedCompany,
    });
  } catch (error) {
    return next(error);
  }
};
export const deleteCompany = async (req, res, next) => {
  const {id} = req.params;
  if(!mongoose.Types.ObjectId.isValid(id))
    return next(new ApiError(400, "Invalid company ID."));
  try {
    const deleteCompany = await Company.findOneAndDelete({
      _id: id,
      createdBy: req.user._id
    });
    if(!deleteCompany)
      return next(new ApiError(404, "Company not found"));
    return res.status(200).json({
      success: true,
      message: "Company deleted successfully."
    })
  } catch (error) {
    return next(error);
  }
};
