import reviewerModel from "../models/reviewerModel.js";
import submissionModel from "../models/submissionModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      const { name, affiliation, phone } = req.body;

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
      const pending = await submissionModel.countDocuments({
         ...query,
         status: { $in: ["Pending", "Under Review"] },
      });
      const accepted = await submissionModel.countDocuments({
         ...query,
         status: "Accepted",
      });
      const rejected = await submissionModel.countDocuments({
         ...query,
         status: "Rejected",
      });
      const revisionRequested = await submissionModel.countDocuments({
         ...query,
         status: "Revision Requested",
      });

      res.json({
         success: true,
         stats: {
            total,
            pending,
            accepted,
            rejected,
            revisionRequested,
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

      // ✅ Check if submission exists and assigned to this reviewer
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

      // ✅ Check if reviewer has already submitted feedback
      const existingFeedbackIndex = submission.feedback.findIndex(
         (f) => f.reviewer.toString() === reviewerId,
      );

      if (existingFeedbackIndex !== -1) {
         // Update existing feedback
         const fb = submission.feedback[existingFeedbackIndex];
         fb.comment = feedbackText;
         fb.confidentialComments = confidentialComments || "";
         fb.recommendation = decision || "Under Review";
         fb.scores = scores || {};
         fb.bestPaperNomination = bestPaperNomination || "No";
         // We keep original createdAt and reviewer
      } else {
         // Add new feedback entry at top (newest first)
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

      // 3. Reviewer submits review -> Needs Admin Action
      // 6. Reviewer re-reviews -> Needs Admin Action
      submission.needsAdminAction = true;
      submission.needsReviewerAction = false;
      // submission.needsAuthorAction = false; // Already false mostly

      //  Avoid overwriting status if multiple reviewers are working independently
      // Or set status based on logic. Currently keeping existing logic minimal or just logging feedback.
      // submission.status = decision || "Under Review";

      //  Update submission status to reviewer’s decision
      // submission.status = decision || "Under Review";

      // Explicitly update timestamp to ensure it floats to top
      submission.updatedAt = new Date(); // Mongoose handles this, but forcing just in case
      await submission.save();

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
