import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import submissionModel from "../models/submissionModel.js";
import reviewerModel from "../models/reviewerModel.js";
import validator from "validator";
import sendEmail from "../config/email.js";

//1. api for the admin login

export const loginAdmin = async (req, res) => {
   try {
      const { email, password } = req.body;
      if (
         email === process.env.ADMIN_EMAIL &&
         password === process.env.ADMIN_PASSWORD
      ) {
         const token = jwt.sign(email + password, process.env.JWT_SECRET);
         res.json({ success: true, token });
      } else {
         res.json({ success: false, message: "Invalid credentials" });
      }
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
};

export const addReviewer = async (req, res) => {
   try {
      const {
         name,
         email,
         phone,
         password,
         designation,
         organization,
         specialization,
         bio,
         address,
         gender,
         isActive,
      } = req.body;

      const imageFile = req.file; // optional

      // Mandatory fields
      if (!name || !email || !password) {
         return res.json({
            success: false,
            message: "Missing required fields",
         });
      }

      // Validate email
      if (!validator.isEmail(email)) {
         return res.json({
            success: false,
            message: "Please enter a valid email",
         });
      }

      // Validate password length
      if (password.length < 8) {
         return res.json({
            success: false,
            message: "Password must be at least 8 characters long",
         });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Upload image if provided
      let imageUrl = "";
      if (imageFile) {
         const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
         });
         imageUrl = uploadResult.secure_url;
      }

      // Handle specialization list
      const specializationList = specialization
         ? specialization.split(",").map((item) => item.trim())
         : [];

      // Create reviewer data
      const reviewerData = {
         name,
         email,
         phone,
         password: hashedPassword,
         designation,
         organization,
         specialization: specializationList,
         bio,
         address,
         gender,
         isActive,
         image: imageUrl,
      };

      const newReviewer = new reviewerModel(reviewerData);
      await newReviewer.save();
      console.log("reviwer added ");

      res.json({ success: true, message: "Reviewer added successfully" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
};

//2.  api to get all reviewer

export const getAllReviewers = async (req, res) => {
   try {
      const reviewers = await reviewerModel
         .find()
         .select("-password")
         .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         reviewers,
      });
   } catch (error) {
      console.error("Error fetching reviewers:", error);
      res.status(500).json({
         success: false,
         message: "Server error while fetching reviewers",
      });
   }
};

// api to get reviwer by :id
export const getReviewerById = async (req, res) => {
   try {
      const reviewer = await reviewerModel
         .findById(req.params.id)
         .populate("assignedSubmissions"); // populate assigned submissions

      if (!reviewer) {
         return res.status(404).json({
            success: false,
            message: "Reviewer not found",
         });
      }
      res.status(200).json({
         success: true,
         reviewer,
      });
   } catch (error) {
      console.error("Error fetching reviewer:", error);
      res.status(500).json({
         success: false,
         message: "Server error while fetching reviewer",
         error: error.message, // optional
      });
   }
};

// Admin: Update reviewer status (isActive)
export const updateReviewerStatus = async (req, res) => {
   try {
      const { reviewerId } = req.params; // reviewer ID from URL
      const { isActive } = req.body; // new status from request body

      if (typeof isActive !== "boolean") {
         return res.status(400).json({
            success: false,
            message: "isActive must be a boolean value",
         });
      }

      const reviewer = await reviewerModel.findById(reviewerId);
      if (!reviewer) {
         return res.status(404).json({
            success: false,
            message: "Reviewer not found",
         });
      }

      reviewer.isActive = isActive;
      await reviewer.save();

      res.status(200).json({
         success: true,
         message: `Reviewer ${
            isActive ? "activated" : "deactivated"
         } successfully`,
         reviewer,
      });
   } catch (error) {
      console.error("Error updating reviewer status:", error);
      res.status(500).json({
         success: false,
         message: "Server error while updating reviewer status",
      });
   }
};

//3.  api to get all submission
export const getAllSubmissions = async (req, res) => {
   try {
      const submissions = await submissionModel
         .find()
         .sort({ createdAt: -1 }) // newest first
         .populate("author", "name email affiliation") // optional, if author is referenced
         .populate("reviewer", "name email");

      res.status(200).json({
         success: true,
         submissions,
      });
   } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({
         success: false,
         message: "Server error while fetching submissions",
      });
   }
};

// api to get submission by id

export const getSubmissionById = async (req, res) => {
   try {
      const submission = await submissionModel
         .findById(req.params.id)
         .populate("author", "name email organization") // populate user info
         .populate("reviewer", "name email organization"); // populate reviewer info

      if (!submission) {
         return res
            .status(404)
            .json({ success: false, message: "Submission not found" });
      }

      res.status(200).json({ success: true, submission });
   } catch (error) {
      console.error("Error fetching submission:", error);
      res.status(500).json({
         success: false,
         message: "Failed to fetch submission",
         error: error.message,
      });
   }
};

// api to  Assign Submission to Reviewer
// ----------------------------
export const assignSubmission = async (req, res) => {
   try {
      const { submissionId, reviewerId } = req.body;

      if (!submissionId || !reviewerId) {
         return res.status(400).json({
            success: false,
            message: "Submission ID and Reviewer ID are required",
         });
      }

      const submission = await submissionModel.findById(submissionId);
      const reviewer = await reviewerModel.findById(reviewerId);

      if (!submission) {
         return res
            .status(404)
            .json({ success: false, message: "Submission not found" });
      }
      if (!reviewer) {
         return res
            .status(404)
            .json({ success: false, message: "Reviewer not found" });
      }

      // Assign submission
      submission.reviewer = reviewerId;
      submission.status = "Under Review";
      await submission.save();

      // Add submission to reviewer's assigned list if not already present
      if (!reviewer.assignedSubmissions.includes(submissionId)) {
         reviewer.assignedSubmissions.push(submissionId);
      }
      reviewer.lastAssignedAt = new Date();
      await reviewer.save();

      // Populate for response
      const populatedSubmission = await submissionModel
         .findById(submissionId)
         .populate("author", "name email organization")
         .populate("reviewer", "name email organization");

      // ✅ Send email notification to reviewer
      try {
         const subject = "New Paper Assigned For Review";
         const message = `
Hello ${reviewer.name},

You have been assigned a new paper for review.

Paper Details:
📄 Title: ${submission.title}
👤 Author: ${submission.authorName}
📧 Author Email: ${submission.authorEmail}
👉 Download Paper: ${submission.attachment}

Please log in to your reviewer dashboard to review the paper.

Regards,
Team IPDIMS
         `;

         await sendEmail({
            email: reviewer.email,
            subject,
            message,
         });

         console.log("📧 Reviewer notified:", reviewer.email);
      } catch (emailErr) {
         console.error("❌ Failed to send reviewer email:", emailErr.message);
      }

      res.status(200).json({
         success: true,
         message: "Submission assigned successfully",
         submission: populatedSubmission,
      });
   } catch (error) {
      console.error("Assignment error:", error);
      res.status(500).json({
         success: false,
         message: "Assignment failed",
         error: error.message,
      });
   }
};

// api to change submission status

export const changeSubmissionStatus = async (req, res) => {
   try {
      const { submissionId, status } = req.body;

      if (!submissionId || !status) {
         return res.status(400).json({
            success: false,
            message: "Submission ID and status are required",
         });
      }

      const submission = await submissionModel
         .findById(submissionId)
         .populate("author", "name email organization")
         .populate("reviewer", "name email organization");

      if (!submission) {
         return res
            .status(404)
            .json({ success: false, message: "Submission not found" });
      }

      submission.status = status;
      await submission.save();
      console.log("✅ Status updated to:", status);

      // ✅ Send Email to user
      const userEmail = submission.authorEmail || submission.author.email;
      const userName = submission.authorName || submission.author.name;

      const subject = `Your Paper Status Updated - ${status}`;
      const message = `
Hello ${userName},
Your paper submission status has been updated.

📄 Paper Title: ${submission.title}
📌 New Status: ${status}

You may log in to your dashboard to see more details.

Regards,  
Team IPDIMS
`;

      try {
         await sendEmail({
            email: userEmail,
            subject,
            message,
         });

         console.log("📧 Email sent to:", userEmail);
      } catch (emailErr) {
         console.error("❌ Email sending failed:", emailErr.message);
      }

      res.status(200).json({
         success: true,
         message: "Status updated successfully & user notified",
         submission,
      });
   } catch (error) {
      console.error("❌ Error updating submission status:", error);
      res.status(500).json({
         success: false,
         message: "Failed to update status",
         error: error.message,
      });
   }
};

// api to  Delete a submission by ID
export const deleteSubmission = async (req, res) => {
   try {
      const submission = await submissionModel.findByIdAndDelete(req.params.id);

      if (!submission) {
         return res.status(404).json({
            success: false,
            message: "Submission not found",
         });
      }

      res.status(200).json({
         success: true,
         message: "Submission deleted successfully",
      });
   } catch (error) {
      console.error("Error deleting submission:", error);
      res.status(500).json({
         success: false,
         message: "Failed to delete submission",
         error: error.message,
      });
   }
};

// Get all users
export const getAllUsers = async (req, res) => {
   try {
      const users = await userModel
         .find()
         .select("-password") // exclude password
         .sort({ createdAt: -1 }); // newest first

      res.status(200).json({
         success: true,
         users,
      });
   } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
         success: false,
         message: "Server error while fetching users",
         error: error.message,
      });
   }
};

// get user by user id
// Get user by ID
export const getUserById = async (req, res) => {
   try {
      const user = await userModel
         .findById(req.params.id)
         .select("-password") // exclude password
         .populate("submissions"); // optional: if you have a submissions reference in userModel

      if (!user) {
         return res
            .status(404)
            .json({ success: false, message: "User not found" });
      }

      res.status(200).json({ success: true, user });
   } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
         success: false,
         message: "Server error while fetching user",
         error: error.message,
      });
   }
};

// Get all submissions of a user
export const getUserSubmissions = async (req, res) => {
   try {
      const userId = req.params.id;

      // Find submissions where 'user' field matches userId
      const submissions = await submissionModel
         .find({ user: userId })
         .sort({ createdAt: -1 }) // newest first
         .populate("reviewer", "name email organization"); // optional: populate reviewer info

      if (!submissions || submissions.length === 0) {
         return res.status(404).json({
            success: false,
            message: "No submissions found for this user",
         });
      }

      res.status(200).json({ success: true, submissions });
   } catch (error) {
      console.error("Error fetching user submissions:", error);
      res.status(500).json({
         success: false,
         message: "Server error while fetching user submissions",
         error: error.message,
      });
   }
};
