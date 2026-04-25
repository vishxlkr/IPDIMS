import express from "express";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

import {
   addReviewer,
   assignSubmission,
   changeSubmissionStatus,
   deleteAuthor,
   deleteRegistration,
   deleteSubmission,
   deleteReviewer,
   getAllRegistrations,
   getAllReviewers,
   getAllSubmissions,
   getAllUsers,
   getRegistrationByUser,
   getReviewerById,
   getSubmissionById,
   getUserById,
   getUserSubmissions,
   loginAdmin,
   markFeedbackSeen,
   notifyAuthor,
   updateRegistrationApproval,
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
   addReviewer,
);
adminRouter.get("/all-reviewer", authAdmin, getAllReviewers);
adminRouter.get("/reviewer/:id", authAdmin, getReviewerById);
adminRouter.post(
   "/change-availability/:reviewerId",
   authAdmin,
   updateReviewerStatus,
);
adminRouter.delete("/reviewer/:id", authAdmin, deleteReviewer);

// Submission routes
adminRouter.get("/submissions", authAdmin, getAllSubmissions);
adminRouter.get("/submission/:id", authAdmin, getSubmissionById);
adminRouter.post("/assign-submission", authAdmin, assignSubmission);
adminRouter.post(
   "/change-submission-status",
   authAdmin,
   changeSubmissionStatus,
);
adminRouter.delete("/submission/:id", authAdmin, deleteSubmission);

// User routes
adminRouter.get("/users", authAdmin, getAllUsers);
adminRouter.get("/user/:id", authAdmin, getUserById);
adminRouter.get("/user/:id/submissions", authAdmin, getUserSubmissions);
adminRouter.delete("/user/:id", authAdmin, deleteAuthor);

// all registrations
adminRouter.get("/registrations", authAdmin, getAllRegistrations);
adminRouter.delete("/registrations/:id", authAdmin, deleteRegistration);
adminRouter.put(
   "/registrations/:id/approval",
   authAdmin,
   updateRegistrationApproval,
);
adminRouter.get("/registration/user/:userId", authAdmin, getRegistrationByUser);
adminRouter.put("/mark-feedback-seen/:id", authAdmin, markFeedbackSeen);

adminRouter.post("/notify-author", authAdmin, notifyAuthor);

export default adminRouter;
