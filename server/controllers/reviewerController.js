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
         { expiresIn: "7d" }
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
            { new: true, runValidators: true }
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
         .find({ reviewer: reviewerId })
         .populate("author", "name email affiliation")
         .sort({ createdAt: -1 });

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
         .findOne({ _id: id, reviewer: reviewerId }) // ensure assigned to that reviewer
         .populate("author", "name email affiliation");

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

      const total = await submissionModel.countDocuments({
         reviewer: reviewerId,
      });
      const pending = await submissionModel.countDocuments({
         reviewer: reviewerId,
         status: "Under Review",
      });
      const accepted = await submissionModel.countDocuments({
         reviewer: reviewerId,
         status: "Accepted",
      });
      const rejected = await submissionModel.countDocuments({
         reviewer: reviewerId,
         status: "Rejected",
      });
      const revisionRequested = await submissionModel.countDocuments({
         reviewer: reviewerId,
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
      const reviewerId = req.user.id; // comes from auth middleware
      const { feedbackText, rating, decision } = req.body;

      // ✅ Check if submission exists and assigned to this reviewer
      const submission = await submissionModel.findOne({
         _id: submissionId,
         reviewer: reviewerId,
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

      // ✅ Add new feedback entry at top (newest first)
      submission.feedback.unshift({
         reviewer: reviewerId,
         comment: feedbackText, // ✅ FIXED
         rating: rating || null,
         recommendation: decision || "Under Review", // ✅ match your schema naming
         reviewedAt: new Date(),
      });

      // ✅ Update submission status to reviewer’s decision
      submission.status = decision || "Under Review";
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

// export const submitReview = async (req, res) => {
//    try {
//       const { id: submissionId } = req.params;
//       const reviewerId = req.user.id;
//       const { feedbackText, rating, decision } = req.body;

//       const submission = await submissionModel.findOne({
//          _id: submissionId,
//          reviewer: reviewerId,
//       });

//       if (!submission) {
//          return res.status(403).json({
//             success: false,
//             message: "Not authorized for this submission",
//          });
//       }

//       if (!feedbackText) {
//          return res.status(400).json({
//             success: false,
//             message: "Feedback is required",
//          });
//       }

//       submission.feedback = {
//          reviewer: reviewerId,
//          text: feedbackText,
//          rating: rating || null,
//          decision: decision || "Under Review",
//          reviewedAt: new Date(),
//       };

//       if (req.file) {
//          submission.reviewFile = req.file.path;
//       }

//       submission.status = decision || "Under Review";
//       await submission.save();

//       res.json({
//          success: true,
//          message: "Review submitted successfully",
//          submission,
//       });
//    } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//    }
// };
