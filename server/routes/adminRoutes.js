import express from "express";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

import {
   addReviewer,
   assignSubmission,
   changeSubmissionStatus,
   deleteSubmission,
   getAllRegistrations,
   getAllReviewers,
   getAllSubmissions,
   getAllUsers,
   getReviewerById,
   getSubmissionById,
   getUserById,
   getUserSubmissions,
   loginAdmin,
   markFeedbackSeen,
   notifyAuthor,
   updateReviewerStatus,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Admin login
adminRouter.post("/login", loginAdmin);

// Reviewer routes
adminRouter.post(
   "/add-reviewer",
   authAdmin,
   upload.single("image"), // optional image upload
   addReviewer
);
adminRouter.get("/all-reviewer", authAdmin, getAllReviewers);
adminRouter.get("/reviewer/:id", authAdmin, getReviewerById);
adminRouter.post(
   "/change-availability/:reviewerId",
   authAdmin,
   updateReviewerStatus
);

// Submission routes
adminRouter.get("/submissions", authAdmin, getAllSubmissions);
adminRouter.get("/submission/:id", authAdmin, getSubmissionById);
adminRouter.post("/assign-submission", authAdmin, assignSubmission);
adminRouter.post(
   "/change-submission-status",
   authAdmin,
   changeSubmissionStatus
);
adminRouter.delete("/submission/:id", authAdmin, deleteSubmission);

// User routes
adminRouter.get("/users", authAdmin, getAllUsers);
adminRouter.get("/user/:id", authAdmin, getUserById);
adminRouter.get("/user/:id/submissions", authAdmin, getUserSubmissions);

// all registrations
adminRouter.get("/registrations", authAdmin, getAllRegistrations);
adminRouter.put("/mark-feedback-seen/:id", authAdmin, markFeedbackSeen);

adminRouter.post("/notify-author", authAdmin, notifyAuthor);

export default adminRouter;
