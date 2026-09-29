import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is reqiured."],
    minlength: [6, "Password must be at least 6 characters long."],
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "recruiter"],
  },
  profilePhoto: {
    type: String,
    default: ""
  },
  profilePhotoPublicId: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
    trim: true
  },
  bio: {
    type: String,
    default: "",
    trim: true
  },
  skills: [
    {
      type: String,
      trim: true
    }
  ],
  resume: {
    type: String,
    default: ""
  },
  resumeOriginalName: {
    type: String,
    default: ""
  },
  resumePublicId: {
    type: String,
    default: "",
  }
},{
  timestamps: true,
});

userSchema.pre("save", async function() {
    if(!this.isModified("password"))
      return;
    return this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword){
  return bcrypt.compare(enteredPassword, this.password);
}
const User = mongoose.model("User", userSchema);
export default User;