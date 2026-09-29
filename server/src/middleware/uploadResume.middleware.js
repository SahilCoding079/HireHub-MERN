import multer from "multer";

const storage = multer.memoryStorage();

const resumeUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if(!allowedFileTypes.includes(file.mimetype)){
      return cb(new Error("Only PDF, DOC, and DOCX files are allowed."));
    }
    cb(null, true);
  }
});

export default resumeUpload;