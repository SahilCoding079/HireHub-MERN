import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

export const getUserProfile = async(req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if(!user)
      return next(new ApiError(404, "User not found"));
    return res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async(req, res, next) => {
  const {fullName, phone, bio, skills } = req.body;
  try {
    const updatedData = {};
    if(fullName !== undefined)
      updatedData.fullName = fullName.trim();
    if(phone !== undefined)
      updatedData.phone = phone.trim();
    if(skills !== undefined){
      if(!Array.isArray(skills) || skills.length === 0){
        return next(new ApiError(400, "Skills must be a non-empty array."));
      }
      updatedData.skills = skills.map((skill) => skill.trim())
    }
    if(bio !== undefined)
      updatedData.bio = bio;
    if(Object.keys(updatedData).length === 0)
      return next(new ApiError(400, "No fields provided to update"))
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
        updatedData,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    })
  } catch (error) {
    return next(error);
  }
};
export const updateProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, "Profile photo is required."));
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ApiError(404, "User not found."));
    }

    if (user.profilePhotoPublicId) {
      await cloudinary.uploader.destroy(user.profilePhotoPublicId);
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "hirehub/profile-photos",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    user.profilePhoto = result.secure_url;
    user.profilePhotoPublicId = result.public_id;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully.",
      data: {
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    return next(error);
  }
};
export const uploadResume = async(req, res, next) => {
  try {
    if(!req.file)
      return next(new ApiError(400, "resume is required"));
    const user = await User.findById(req.user._id);
    if(!user)
      return next(new ApiError(404, "User not found."));
    if(user.resumePublicId){
      await cloudinary.uploader.destroy(user.resumePublicId,{
        resource_type: "raw"
      });
    }
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "hirehub/resumes",
          resource_type: "raw"
        },
        (error, uploadResult) => {
          if(error)
            reject(error);
          else
            resolve(uploadResult);
        }
      );
      stream.end(req.file.buffer);
    });
    user.resume = result.secure_url;
    user.resumeOriginalName = req.file.originalname;
    user.resumePublicId = result.public_id;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: {
        resume: user.resume,
        resumeOriginalName: user.resumeOriginalName,
        resumePublicId: user.resumePublicId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProfilePhoto = async(req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if(!user)
      return next(new ApiError(404, "User not found."));
    if(!user.profilePhotoPublicId)
      return next(new ApiError(404, "No profile photo found."));
    await cloudinary.uploader.destroy(user.profilePhotoPublicId);
    user.profilePhoto = "";
    user.profilePhotoPublicId = "";
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile photo deleted successfully.",
      data: { profilePhoto: "", profilePhotoPublicId: "" },
    });
  } catch (error) {
    return next(error);
  }
};
export const deleteResume = async(req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if(!user)
      return next(new ApiError(404, "User not found."));
    if(!user.resumePublicId)
      return next(new ApiError(404, "No resume found."));
    await cloudinary.uploader.destroy(user.resumePublicId, {
      resource_type: "raw"
    });
    user.resume = "";
    user.resumeOriginalName = "";
    user.resumePublicId = "";

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully."
    });
  } catch (error) {
    return next(error);
  }
}