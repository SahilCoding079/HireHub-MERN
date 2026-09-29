import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name:{
    type: String,
    trim: true,
    required: [true, "Company name is required."],
    unique: true
  },
  description: {
    type: String,
    required: [true, "Company description is required."],
    trim: true
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, "Please enter a valid website URL"]
  },
  location: {
    type: String,
    required: [true, "Company location is required."],
    trim: true
  },
  logo: {
    type: String,
    default: ""
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Recruiter is required."]
  },
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);
export default Company;