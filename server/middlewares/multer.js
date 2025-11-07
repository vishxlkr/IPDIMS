// import multer from "multer";

// const storage = multer.diskStorage({
//    filename: function (req, file, callback) {
//       callback(null, file.originalname);
//    },
// });

// const upload = multer({ storage });

// export default upload;
////////////////////////////////////////////////////////////////////////

import multer from "multer";
import path from "path";

// Storage
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads/"); // Make sure this folder exists
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
   },
});

// Limits
const upload = multer({
   storage,
   limits: {
      fieldSize: 10 * 1024 * 1024, // 10MB for text fields
      fileSize: 5 * 1024 * 1024, // 5MB for file uploads
   },
});

export default upload;
