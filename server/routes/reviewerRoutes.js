import express from "express";
import {
   loginReviewer,
   getReviewerProfile,
   updateReviewerProfile,
   getAssignedSubmissions,
   getAssignedSubmissionById,
   getDashboardStats,
   submitReview,
} from "../controllers/reviewerController.js";
import { authReviewer } from "../middlewares/authReviewer.js";

const reviewerRouter = express.Router();

// 🔑 Public route
reviewerRouter.post("/login", loginReviewer);

// 🔒 Protected routes (require reviewer auth)
reviewerRouter.get("/profile", authReviewer, getReviewerProfile);
reviewerRouter.put("/profile", authReviewer, updateReviewerProfile);

reviewerRouter.get("/submissions", authReviewer, getAssignedSubmissions);
reviewerRouter.get("/submissions/:id", authReviewer, getAssignedSubmissionById);

reviewerRouter.post("/submissions/:id/review", authReviewer, submitReview);

reviewerRouter.get("/dashboard", authReviewer, getDashboardStats);

export default reviewerRouter;
