import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import submissionModel from "../models/submissionModel.js";
import reviewerModel from "../models/reviewerModel.js";
import validator from "validator";
import sendEmail from "../config/email.js";
import registrationModel from "../models/registrationModel.js";

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
         .sort({ needsAdminAction: -1, updatedAt: -1 }) // Admin Sort
         .populate("author", "name email affiliation") // optional, if author is referenced
         .populate("reviewers", "name email");

      // Debug log to verify usage of endpoint and sorting
      console.log(
         "Admin getAllSubmissions called. Returning count:",
         submissions.length,
      );
      if (submissions.length > 0) {
         console.log(
            "Top submission:",
            submissions[0]._id,
            "NeedsAdmin:",
            submissions[0].needsAdminAction,
         );
      }

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
         .populate("reviewers", "name email organization") // populate reviewer info
         .populate({
            path: "feedback.reviewer",
            model: "reviewer",
            select: "name email image",
         });

      if (!submission) {
         return res
            .status(404)
            .json({ success: false, message: "Submission not found" });
      }

      // Sort feedback newest first if not already sorted by query
      // (Though mongoose find usually returns document order, explicit sort on array is good)
      if (submission.feedback && submission.feedback.length > 0) {
         submission.feedback.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
         );
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
      const { submissionId, reviewerIds } = req.body;

      if (!submissionId || !reviewerIds || !Array.isArray(reviewerIds)) {
         return res.status(400).json({
            success: false,
            message: "Submission ID and Reviewer IDs (array) are required",
         });
      }

      const submission = await submissionModel.findById(submissionId);

      if (!submission) {
         return res
            .status(404)
            .json({ success: false, message: "Submission not found" });
      }

      // Update submission with new list of reviewers
      submission.reviewers = reviewerIds;

      // Update status if it was pending and now has reviewers
      if (submission.status === "Pending" && reviewerIds.length > 0) {
         submission.status = "Under Review";
      } else if (
         reviewerIds.length === 0 &&
         submission.status === "Under Review"
      ) {
         // Optional: revert to pending if all reviewers removed?
         // keeping it simple for now
         submission.status = "Pending";
      }

      // 2. Admin assigns reviewer -> Needs Reviewer Action
      if (reviewerIds.length > 0) {
         submission.needsReviewerAction = true;
         submission.needsAdminAction = false;
         submission.needsAuthorAction = false;
      }
      // If reviewer removed, maybe revert flags?
      // Assuming typical workflow: Assign -> Reviewer sees it.

      // Backward compatibility (optional, set first reviewer as main 'reviewer' field)
      if (reviewerIds.length > 0) {
         submission.reviewer = reviewerIds[0];
      } else {
         submission.reviewer = null;
      }

      await submission.save();

      // Update reviewers' assigned lists (add if not present)
      // Note: optimally we should also remove this submission from reviewers who were unassigned
      // For simplicity/safety, we'll just add it to the new ones for now or do a bulk update

      // 1. Remove submission from all reviewers (clean slate approach for this submission)
      // This might be heavy if many reviewers, but accurate
      await reviewerModel.updateMany(
         { assignedSubmissions: submissionId },
         { $pull: { assignedSubmissions: submissionId } },
      );

      // 2. Add to selected reviewers
      if (reviewerIds.length > 0) {
         await reviewerModel.updateMany(
            { _id: { $in: reviewerIds } },
            {
               $addToSet: { assignedSubmissions: submissionId },
               $set: { lastAssignedAt: new Date() },
            },
         );
      }

      // Populate for response
      const populatedSubmission = await submissionModel
         .findById(submissionId)
         .populate("author", "name email organization")
         .populate("reviewers", "name email organization");

      // Send email to newly assigned reviewers
      const newReviewers = await reviewerModel.find({
         _id: { $in: reviewerIds },
      });

      for (const reviewer of newReviewers) {
         try {
            // Generate magic token
            const token = jwt.sign(
               { id: reviewer._id, role: "reviewer" },
               process.env.JWT_SECRET,
               { expiresIn: "7d" },
            );

            // Access client URL from env
            const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
            const magicLink = `${clientUrl}/reviewer-access?token=${token}`;

            const subject =
               "New Paper Assigned For Review - Access Link Inside";
            const message = `
Hello ${reviewer.name},

You have been assigned a new paper for review.

Paper Details:
Title: ${submission.title}
Author: ${submission.authorName || "N/A"}

Click here to review the paper directly (No manual login required):
${magicLink}

This link is valid for 7 days.

Regards,
Team IPDIMS
`;

            await sendEmail({
               email: reviewer.email,
               subject: subject,
               message: message,
            });

            console.log("Email sent to reviewer:", reviewer.email);
         } catch (emailErr) {
            console.error(
               `Failed to send reviewer email to ${reviewer.email}:`,
               emailErr.message,
            );
         }
      }

      res.status(200).json({
         success: true,
         message: "Reviewers assigned successfully",
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
      const { submissionId, status, notify, customMessage } = req.body;

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

      // 4. Admin decision logic for workflow flags
      if (status === "Revision Requested") {
         submission.needsAuthorAction = true;
         submission.needsAdminAction = false;
         submission.needsReviewerAction = false;
      } else if (status === "Accepted" || status === "Rejected") {
         // Completed / History
         submission.needsAuthorAction = false;
         submission.needsAdminAction = false;
         submission.needsReviewerAction = false;
      }
      // If status is "Under Review", it might have been set by Assign or something else.
      // But typically Admin changes to one of the above.

      await submission.save();

      console.log("✅ Status updated to:", status);

      // ✉️ Only send email if notify = true
      if (notify) {
         const userEmail = submission.authorEmail || submission.author.email;
         const userName = submission.authorName || submission.author.name;

         const subject = `Your Paper Status Updated - ${status}`;
         const message = `
Hello ${userName},

Your paper submission status has been updated.

📄 Paper Title: ${submission.title}
📌 New Status: ${status}

${customMessage ? `\n📝 Note from Admin:\n${customMessage}\n` : ""}

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
      }

      res.status(200).json({
         success: true,
         message: notify
            ? "Status updated successfully & user notified"
            : "Status updated successfully (no notification sent)",
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
      const user = await userModel.findById(req.params.id).select("-password"); // exclude password
      // .populate("submissions"); // optional: if you have a submissions reference in userModel

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
         .find({ author: userId })
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

//  Get all submissions of a specific user (AUTHOR)
// export const getUserSubmissions = async (req, res) => {
//    try {
//       const userId = req.params.id;

//       const submissions = await submissionModel
//          .find({ author: userId }) // match author field
//          .sort({ createdAt: -1 }) // newest first
//          .populate("reviewer", "name email organization") // show reviewer details
//          .populate("author", "name email organization"); // show user details

//       res.status(200).json({
//          success: true,
//          submissions,
//       });
//    } catch (error) {
//       console.error(" Error fetching user submissions:", error);
//       res.status(500).json({
//          success: false,
//          message: "Server error while fetching user submissions",
//          error: error.message,
//       });
//    }
// };

// api to get all registrations

export const getAllRegistrations = async (req, res) => {
   try {
      const registrations = await registrationModel
         .find()
         .sort({ createdAt: -1 })
         .populate("userId", "name email"); // to show user details if needed

      res.status(200).json({
         success: true,
         registrations,
      });
   } catch (error) {
      console.error("❌ Error fetching registrations:", error);
      res.status(500).json({
         success: false,
         message: "Server error while fetching registrations",
      });
   }
};

//  Get registration of a specific user (Admin only)
export const getRegistrationByUser = async (req, res) => {
   try {
      const { userId } = req.params;

      const registration = await registrationModel
         .findOne({ userId })
         .populate("userId", "name email organization")
         .lean();

      if (!registration) {
         return res.status(404).json({
            success: false,
            message: "No registration found for this user",
         });
      }

      res.status(200).json({
         success: true,
         registration,
      });
   } catch (error) {
      console.error("❌ Error fetching user registration:", error);
      return res.status(500).json({
         success: false,
         message: "Server error while fetching registration",
         error: error.message,
      });
   }
};

// api to mark feedback as seen
export const markFeedbackSeen = async (req, res) => {
   try {
      const submissionId = req.params.id;

      const submission = await submissionModel.findById(submissionId);
      if (!submission) {
         return res
            .status(404)
            .json({ success: false, message: "Submission not found" });
      }

      // If you have a flag for unseen feedbacks, reset it here
      submission.hasNewFeedback = false;

      await submission.save();

      res.status(200).json({
         success: true,
         message: "Feedback marked as seen",
      });
   } catch (error) {
      console.error("Error marking feedback as seen:", error);
      res.status(500).json({
         success: false,
         message: "Failed to mark feedback as seen",
         error: error.message,
      });
   }
};

// api to notify author about new feedback
export const notifyAuthor = async (req, res) => {
   try {
      const { submissionId, feedbackId } = req.body;

      if (!submissionId || !feedbackId) {
         return res.status(400).json({
            success: false,
            message: "submissionId and feedbackId are required",
         });
      }

      // Fetch submission with feedback and author details
      const submission = await submissionModel
         .findById(submissionId)
         .populate("author", "name email")
         .populate("feedback.reviewer", "name email");

      if (!submission) {
         return res
            .status(404)
            .json({ success: false, message: "Submission not found" });
      }

      const feedback = submission.feedback.id(feedbackId);
      if (!feedback) {
         return res
            .status(404)
            .json({ success: false, message: "Feedback not found" });
      }

      // Get author info
      const authorEmail = submission.authorEmail || submission.author?.email;
      const authorName = submission.authorName || submission.author?.name;

      if (!authorEmail) {
         return res
            .status(400)
            .json({ success: false, message: "Author email not found" });
      }

      // Prepare email content
      const subject = `Reviewer Feedback on Your Paper: "${submission.title}"`;

      const message = `
Hello ${authorName || "Author"},

You have received new feedback from the reviewer for your paper submission.

📄 Paper Title: ${submission.title}
🗣 Reviewer: ${feedback.reviewer?.name || "Anonymous Reviewer"}

💬 Reviewer Comments:
${feedback.comment}

📌 Recommendation: ${feedback.recommendation}

Please log in to your IPDIMS dashboard to review the feedback and make necessary changes if required.

Best regards,  
Team IPDIMS
`;

      // Send email
      try {
         await sendEmail({
            email: authorEmail,
            subject,
            message,
         });
         console.log("📧 Feedback email sent to:", authorEmail);
      } catch (emailErr) {
         console.error("❌ Error sending feedback email:", emailErr.message);
      }

      res.status(200).json({
         success: true,
         message: "Author notified successfully via email",
      });
   } catch (error) {
      console.error("❌ Error notifying author:", error);
      res.status(500).json({
         success: false,
         message: "Failed to notify author",
         error: error.message,
      });
   }
};

//  api to Delete Author (Admin only)
export const deleteAuthor = async (req, res) => {
   try {
      const { id } = req.params;

      const user = await userModel.findById(id);
      if (!user)
         return res
            .status(404)
            .json({ success: false, message: "Author not found" });

      await submissionModel.deleteMany({ author: id }); // delete related submissions
      await userModel.findByIdAndDelete(id);

      res.status(200).json({
         success: true,
         message: "Author deleted successfully",
      });
   } catch (error) {
      console.error("Delete author error:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

//  Delete a registration by ID
export const deleteRegistration = async (req, res) => {
   try {
      const { id } = req.params;

      const registration = await registrationModel.findById(id);
      if (!registration) {
         return res.status(404).json({
            success: false,
            message: "Registration not found",
         });
      }

      await registrationModel.findByIdAndDelete(id);

      res.status(200).json({
         success: true,
         message: "Registration deleted successfully",
      });
   } catch (error) {
      console.error("❌ Delete Registration Error:", error);
      res.status(500).json({
         success: false,
         message: "Server error while deleting registration",
         error: error.message,
      });
   }
};
