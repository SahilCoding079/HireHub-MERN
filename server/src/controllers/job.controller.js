import mongoose from "mongoose";
import Company from "../models/company.model.js";
import Job from "../models/job.model.js";
import ApiError from "../utils/ApiError.js";

export const createJob = async (req, res, next) => {
  const {
    title,
    description,
    requirements,
    salary,
    experienceLevel,
    location,
    jobType,
    position,
    company: companyId,
    status = "active",
  } = req.body;
  if (
    !title ||
    !description ||
    !requirements ||
    salary == null ||
    experienceLevel == null ||
    !location ||
    !jobType ||
    position == null ||
    !status
  )
    return next(new ApiError(400, "All fields are required."));
  if (!['active', 'closed', 'draft'].includes(status))
    return next(new ApiError(400, "Invalid job status."));
  if (!req.user) return next(new ApiError(401, "Unauthorized."));
  const createdBy = req.user._id;
  if (!Array.isArray(requirements) || requirements.length == 0)
    return next(new ApiError(400, "Requirements must be a non-empty array."));
  if (!companyId) return next(new ApiError(400, "Company ID is required."));
  if (!mongoose.Types.ObjectId.isValid(companyId))
    return next(new ApiError(400, "Invalid company ID."));
  try {
    const existingCompany = await Company.findOne({
      _id: companyId,
      createdBy,
    });
    if (!existingCompany) return next(new ApiError(404, "Company not found."));
    const newJob = await Job.create({
      title,
      description,
      requirements,
      salary,
      experienceLevel,
      location,
      jobType,
      position,
      company: companyId,
      createdBy,
      status,
    });
    return res.status(201).json({
      success: true,
      message: "Job created successfully.",
      data: newJob,
    });
  } catch (error) {
    return next(error);
  }
};
export const getAllJobs = async (req, res, next) => {
  const createdBy = req.user._id;
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentPage = Number(page);
    const pageLimit = Number(limit);
    const skip = (currentPage - 1) * pageLimit;

    const [allJobs, totalJobs] = await Promise.all([
      Job.find({ createdBy })
        .populate("company", "name logo location")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageLimit),
      Job.countDocuments({ createdBy }),
    ]);
    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully.",
      data: allJobs,
      pagination: {
        totalJobs,
        currentPage,
        totalPages: Math.ceil(totalJobs / pageLimit),
        limit: pageLimit,
      },
    });
  } catch (error) {
    return next(error);
  }
};
export const getJobById = async(req, res, next) => {
  const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
      return next(new ApiError(400, "Invalid Job ID."));
  try {
    const job = await Job.findOne({
      _id: id,
      createdBy: req.user._id
    }).populate("company", "name description website logo location");
    if(!job)
      return next(new ApiError(404, "Job not found."));
    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: job
    });
  } catch (error) {
    return next(error);
  }
};
export const updateJob = async (req, res, next) => {
  const {
    title,
    description,
    requirements,
    salary,
    experienceLevel,
    location,
    jobType,
    position,
    company,
    status
  } = req.body;
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ApiError(400, "Invalid job ID."));
  try {
    const updatedData = {};
    if (title !== undefined) updatedData.title = title.trim();
    if (description !== undefined) updatedData.description = description.trim();
    if (requirements !== undefined) {
      if (!Array.isArray(requirements) || requirements.length === 0) {
        return next(
          new ApiError(400, "Requirements must be a non-empty array."),
        );
      }
      updatedData.requirements = requirements.map((item) => item.trim());
    }
    if (salary !== undefined) updatedData.salary = salary;
    if (experienceLevel !== undefined)
      updatedData.experienceLevel = experienceLevel;
    if (location !== undefined) updatedData.location = location.trim();
    if (jobType !== undefined) updatedData.jobType = jobType.trim();
    if (position !== undefined) updatedData.position = position;
    if(status!== undefined)
      updatedData.status = status.trim();
    if (company !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(company)) {
        return next(new ApiError(400, "Invalid company ID."));
      }
      const existingCompany = await Company.exists({
        _id: company,
        createdBy: req.user._id,
      });
      if (!existingCompany)
        return next(new ApiError(404, "Company not found."));
      updatedData.company = company;
    }
    if (Object.keys(updatedData).length === 0)
      return next(new ApiError(400, "No fields provided to update."));
    const updatedJob = await Job.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user._id,
      },
      updatedData,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedJob) return next(new ApiError(404, "Job not found"));
    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    return next(error);
  }
};
export const deleteJob = async(req, res, next) => {
  const {id} = req.params;
  if(!mongoose.Types.ObjectId.isValid(id))
    return next(new ApiError(400, "Invalid Job ID."));
  try {
    const job = await Job.findOneAndDelete({
      _id: id,
      createdBy: req.user._id
    });
    if(!job)
      return next(new ApiError(404, "Job not found."));
    return res.status(200).json({
      success: true,
      message: "Job deleted successfully."
    });
  } catch (error) {
    return next(error);
  }
};  

