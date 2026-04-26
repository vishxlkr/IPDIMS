import reviewerModel from "../models/reviewerModel.js";
import submissionModel from "../models/submissionModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../config/email.js";
import { getAllReviewersFeedbackCompleteEmail } from "../config/emailTemplates/templates.js";

// api to login reviewer
export const loginReviewer = async (req, res) => {
   try {
      const { email, password } = req.body;
      const reviewer = await reviewerModel.findOne({ email });
      if (!reviewer)
         return res
            .status(404)
            .json({ success: false, message: "Reviewer not found" });

      const isMatch = await bcrypt.compare(password, reviewer.password);
      if (!isMatch)
         return res
            .status(400)
            .json({ success: false, message: "Invalid credentials" });

      const token = jwt.sign(
         { id: reviewer._id, role: "reviewer" },
         process.env.JWT_SECRET,

         { expiresIn: "7d" },
      );
      res.json({ success: true, token, reviewer });
   } catch (error) {
      res.status(500).json({ success: false, message: "Login failed", error });
   }
};

// api to get reviewer profile
export const getReviewerProfile = async (req, res) => {
   try {
      const reviewer = await reviewerModel
         .findById(req.user.id)
         .select("-password");
      if (!reviewer) {
         return res
            .status(404)
            .json({ success: false, message: "Reviewer not found" });
      }

      res.json({ success: true, reviewer });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Failed to fetch profile",
         error,
      });
   }
};

// api to update reviewer profile
export const updateReviewerProfile = async (req, res) => {
   try {
      const reviewerId = req.user.id;
      const body = req.body || {};
      const { name, affiliation, phone } = body;

      const updatedReviewer = await reviewerModel
         .findByIdAndUpdate(
            reviewerId,
            {
               $set: {
                  ...(name && { name }),
                  ...(affiliation && { affiliation }),
                  ...(phone && { phone }),
               },
            },
            { new: true, runValidators: true },
         )
         .select("-password");

      if (!updatedReviewer) {
         return res
            .status(404)
            .json({ success: false, message: "Reviewer not found" });
      }

      res.json({
         success: true,
         message: "Profile updated successfully",
         reviewer: updatedReviewer,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Failed to update profile",
         error,
      });
   }
};

// api to get all the assigned submission
export const getAssignedSubmissions = async (req, res) => {
   try {
      const reviewerId = req.user.id;

      const submissions = await submissionModel
         .find({
            $or: [{ reviewer: reviewerId }, { reviewers: reviewerId }],
         })
         .populate("author", "name email affiliation")
         .sort({ needsReviewerAction: -1, updatedAt: -1 }); // Reviewer Sort

      res.json({
         success: true,
         submissions,
         message: "Fetched assigned submissions",
      });
   } catch (error) {
      console.log("Fetch Assigned Submissions Error:", error);
      res.status(500).json({
         success: false,
         message: "Failed to fetch assigned submissions",
      });
   }
};

// api to get the specific submission by id
export const getAssignedSubmissionById = async (req, res) => {
   try {
      const reviewerId = req.user.id;
      const { id } = req.params;

      const submission = await submissionModel
         .findOne({
            _id: id,
            $or: [{ reviewer: reviewerId }, { reviewers: reviewerId }],
         }) // ensure assigned to that reviewer
         .populate("author", "name email affiliation")
         .populate({
            path: "feedback.reviewer",
            model: "reviewer",
            select: "name email",
         });

      if (!submission)
         return res.status(404).json({
            success: false,
            message: "Submission not found or not assigned to you",
         });

      res.json({ success: true, submission });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Failed to fetch submission details",
         error,
      });
   }
};

// api for the reviwer dashboard
export const getDashboardStats = async (req, res) => {
   try {
      const reviewerId = req.user.id;

      const query = {
         $or: [{ reviewer: reviewerId }, { reviewers: reviewerId }],
      };

      const total = await submissionModel.countDocuments(query);

      const completed = await submissionModel.countDocuments({
         ...query,
         "feedback.reviewer": reviewerId,
      });

      const pending = total - completed;

      res.json({
         success: true,
         stats: {
            total,
            pending,
            completed,
         },
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Failed to fetch dashboard data",
         error: error.message,
      });
   }
};

export const submitReview = async (req, res) => {
   try {
      const { id: submissionId } = req.params;
      const reviewerId = req.user.id;
      const {
         feedbackText,
         decision,
         scores,
         bestPaperNomination,
         confidentialComments,
      } = req.body;

      //  Check if submission exists and assigned to this reviewer
      const submission = await submissionModel.findOne({
         _id: submissionId,
         $or: [{ reviewer: reviewerId }, { reviewers: reviewerId }],
      });

      if (!submission) {
         return res.status(403).json({
            success: false,
            message: "Submission not found or not assigned to this reviewer",
         });
      }

      if (!feedbackText) {
         return res.status(400).json({
            success: false,
            message: "Feedback text is required",
         });
      }

      const existingFeedbackIndex = submission.feedback.findIndex(
         (f) => f.reviewer.toString() === reviewerId,
      );

      if (existingFeedbackIndex !== -1) {
         const fb = submission.feedback[existingFeedbackIndex];
         fb.comment = feedbackText;
         fb.confidentialComments = confidentialComments || "";
         fb.recommendation = decision || "Under Review";
         fb.scores = scores || {};
         fb.bestPaperNomination = bestPaperNomination || "No";
      } else {
         submission.feedback.unshift({
            reviewer: reviewerId,
            comment: feedbackText, // Comments to Author
            confidentialComments: confidentialComments || "",
            recommendation: decision || "Under Review",
            scores: scores || {}, // { engineeringSignificance: 5, ... }
            bestPaperNomination: bestPaperNomination || "No",
            createdAt: new Date(),
         });
      }

      submission.needsAdminAction = true;
      submission.needsReviewerAction = false;

      submission.updatedAt = new Date();
      await submission.save();

      // Check if all reviewers have submitted feedback
      const totalReviewers = submission.reviewers.length;
      const feedbackCount = submission.feedback.filter(
         (f) => f.reviewer,
      ).length;

      if (totalReviewers > 0 && feedbackCount === totalReviewers) {
         // All reviewers have submitted feedback, send email to admin
         const adminEmail = process.env.ADMIN_EMAIL_UPDATE;
         if (adminEmail) {
            try {
               const adminHtml = getAllReviewersFeedbackCompleteEmail(
                  "Admin",
                  submission,
                  feedbackCount,
                  totalReviewers,
               );

               await sendEmail({
                  email: adminEmail,
                  subject: `IPDIMS - All Reviewer Feedbacks Complete for Paper #${submission.paperId}`,
                  message: `All ${totalReviewers} reviewers have submitted feedback for paper "${submission.title}"`,
                  html: adminHtml,
               });
               console.log(
                  "✅ Admin notified: All reviewer feedbacks complete",
               );
            } catch (emailErr) {
               console.error(
                  "❌ Failed to send admin notification:",
                  emailErr.message,
               );
            }
         }
      }

      res.status(200).json({
         success: true,
         message: "Feedback submitted successfully",
         feedback: submission.feedback,
      });
   } catch (error) {
      console.error("❌ Error in submitReview:", error);
      res.status(500).json({
         success: false,
         message: "Failed to submit feedback",
         error: error.message,
      });
   }
};
