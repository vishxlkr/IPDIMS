import multer from "multer";
import path from "path";

// Storage information
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads/"); // Make sure this folder exists
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
   },
});

// multer configuration with storage information and limit
const upload = multer({
   storage,
   limits: {
      fieldSize: 10 * 1024 * 1024, // 10MB for text fields
      fileSize: 5 * 1024 * 1024, // 5MB for file uploads
   },
});

export default upload;
