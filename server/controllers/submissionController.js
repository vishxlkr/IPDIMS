import submissionModel from "../models/submissionModel.js";
import userModel from "../models/userModel.js";
import reviewerModel from "../models/reviewerModel.js";
import { v2 as cloudinary } from "cloudinary";
import sendEmail from "../config/email.js";
import {
   getAuthorSubmissionSuccessEmail,
   getAdminNewSubmissionEmail,
   getAdminRevisionSubmissionEmail,
   getReviewerAssignmentEmail,
} from "../config/emailTemplates/templates.js";
import path from "path";
import jwt from "jsonwebtoken";

// 🟢 Create a new submission
export const newSubmission = async (req, res) => {
   try {
      const { title, description, keywords, eventName, authorOrganization } =
         req.body;
      const file = req.file; // uploaded file
      const userId = req.user.id; // comes from auth middleware

      console.log("Received new submission request");

      //  Validate required fields
      if (!title || !description || !keywords) {
         return res.json({
            success: false,
            message: "Missing required fields",
         });
      }

      //  Find user from DB
      const user = await userModel.findById(userId);
      if (!user) {
         return res.json({ success: false, message: "User not found" });
      }

      let downloadUrl = "";
      let viewUrl = "";

      if (file) {
         try {
            console.log(
               "📁 Uploading to Cloudinary:",
               file.originalname,
               file.mimetype,
            );

            const originalName = file.originalname;

            const uploadResult = await cloudinary.uploader.upload(file.path, {
               resource_type: "raw", // "Raw" type as requested. or "auto"
               folder: "submissions",
               use_filename: true, // Use the uploaded filename
               unique_filename: true, // Append random characters for uniqueness
               overwrite: false,
               type: "upload", // Explicitly public upload
               access_mode: "public", // Explicitly public access
            });

            //  URL handling
            downloadUrl = uploadResult.secure_url;
            viewUrl = uploadResult.secure_url;

            console.log("Cloudinary upload success:", downloadUrl);
         } catch (err) {
            console.error("Cloudinary upload failed:", err);
         }
      } else {
         console.warn("No file uploaded in request");
      }

      if (!downloadUrl) {
         return res.json({
            success: false,
            message: "File upload failed. Please try again.",
         });
      }

      // Create submission data
      const submissionData = {
         title,
         description,
         keywords: keywords.split(",").map((k) => k.trim()),
         author: userId,
         authorName: user.name,
         authorEmail: user.email,
         authorAffiliation: authorOrganization || user.organization || "",
         attachment: {
            downloadUrl,
            viewUrl,
         },
         fileHistory: downloadUrl ? [{ downloadUrl, viewUrl }] : [],
         eventName: eventName || `IPDIMS ${new Date().getFullYear()}`,

         // 1. Author submits paper -> Needs Admin Action
         needsAdminAction: true,
         needsReviewerAction: false,
         needsAuthorAction: false,
      };

      //  Save to MongoDB
      const newSubmissionDoc = new submissionModel(submissionData);
      await newSubmissionDoc.save();

      console.log(" Submission saved successfully");

      //  Send email notification to admin
      const adminEmail = process.env.ADMIN_EMAIL; // from .env for login
      const adminNotificationEmail = process.env.ADMIN_EMAIL_UPDATE; // for notifications
      const adminSecret = process.env.ADMIN_PASSWORD; // To sign the admin JWT

      const adminToken = jwt.sign(
         adminEmail + adminSecret,
         process.env.JWT_SECRET,
      );
      const adminUrl = process.env.ADMIN_URL || "http://localhost:5174";
      const magicLink = `${adminUrl}/admin/submissions?token=${adminToken}&action=assign&submissionId=${newSubmissionDoc._id}`;

      const adminHtml = getAdminNewSubmissionEmail(
         "Admin",
         user,
         submissionData,
         downloadUrl,
         magicLink,
      );

      try {
         await sendEmail({
            email: adminNotificationEmail,
            subject: `IPDIMS - Action Required: Assing Reviewers`,
            message: `New submission: ${title} by ${user.name}`,
            html: adminHtml,
         });
         console.log(" Admin notified via templated email");

         const authorHtml = getAuthorSubmissionSuccessEmail(
            user.name,
            submissionData,
         );
         await sendEmail({
            email: user.email,
            subject: `IPDIMS - Submission Received Successfully`,
            message: `Your submission "${title}" has been received.`,
            html: authorHtml,
         });
         console.log(" Author notified via templated email");
      } catch (emailErr) {
         console.error(
            " Failed to send email notifications:",
            emailErr.message,
         );
      }

      res.json({
         success: true,
         message: "Submission added successfully and admin notified",
         submission: newSubmissionDoc,
      });
   } catch (error) {
      console.error("❌ Error in addSubmission:", error);
      res.json({ success: false, message: error.message });
   }
};

// 🟡 Get all submissions of logged-in user
export const getUserSubmissions = async (req, res) => {
   try {
      const userId = req.user.id;

      if (!userId) {
         return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
      }

      const submissions = await submissionModel
         .find({ author: userId })
         .sort({ needsAuthorAction: -1, updatedAt: -1 });

      res.status(200).json({
         success: true,
         submissions,
      });
   } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

// 🔵 Update a submission
export const updateSubmission = async (req, res) => {
   try {
      const { id } = req.params;
      const { title, description, keywords } = req.body;
      const file = req.file;
      const userId = req.user.id;

      const submission = await submissionModel.findById(id);
      if (!submission) {
         return res
            .status(404)
            .json({ success: false, message: "Submission not found" });
      }

      if (submission.author.toString() !== userId) {
         return res.status(403).json({
            success: false,
            message: "Not authorized to edit this submission",
         });
      }

      // Find user from DB
      const user = await userModel.findById(userId);
      if (!user) {
         return res.json({ success: false, message: "User not found" });
      }

      const previousStatus = submission.status; // Store previous status

      if (title) submission.title = title;
      if (description) submission.description = description;
      if (keywords)
         submission.keywords = Array.isArray(keywords)
            ? keywords
            : keywords.split(",").map((k) => k.trim());

      if (file) {
         try {
            const uploadResult = await cloudinary.uploader.upload(file.path, {
               resource_type: "raw",
               folder: "submissions",
               use_filename: true,
               unique_filename: true,
               overwrite: false,
               type: "upload",
               access_mode: "public",
            });

            submission.attachment = {
               downloadUrl: uploadResult.secure_url,
               viewUrl: uploadResult.secure_url,
            };
            submission.fileHistory.push({
               downloadUrl: uploadResult.secure_url,
               viewUrl: uploadResult.secure_url,
            });
         } catch (err) {
            console.error("Cloudinary upload failed:", err);
            return res
               .status(500)
               .json({ success: false, message: "File upload failed" });
         }
      }

      submission.status = "Under Review";

      submission.needsAuthorAction = false;
      submission.needsReviewerAction = true;

      await submission.save();

      // Send email to admin and notify assigned reviewers if this was a revision submission
      if (previousStatus === "Revision Requested") {
         const adminNotificationEmail = process.env.ADMIN_EMAIL_UPDATE;
         if (adminNotificationEmail) {
            try {
               const adminHtml = getAdminRevisionSubmissionEmail(
                  "Admin",
                  user,
                  submission,
                  submission.attachment.downloadUrl,
               );

               await sendEmail({
                  email: adminNotificationEmail,
                  subject: `IPDIMS - Revised Manuscript Submitted for Paper #${submission.paperId}`,
                  message: `Revised submission: ${submission.title} by ${user.name}`,
                  html: adminHtml,
               });
               console.log("✅ Admin notified: Revised manuscript submitted");
            } catch (emailErr) {
               console.error(
                  "❌ Failed to send admin notification:",
                  emailErr.message,
               );
            }
         }

         // Notify all already-assigned reviewers to re-review the revised paper
         try {
            if (submission.reviewers && submission.reviewers.length > 0) {
               const reviewersToNotify = await reviewerModel.find({
                  _id: { $in: submission.reviewers },
               });

               const adminUrl =
                  process.env.ADMIN_URL || "http://localhost:5174";

               for (const reviewer of reviewersToNotify) {
                  try {
                     const token = jwt.sign(
                        { id: reviewer._id, role: "reviewer" },
                        process.env.JWT_SECRET,
                        { expiresIn: "7d" },
                     );

                     const magicLink = `${adminUrl}/reviewer-access?token=${token}&submissionId=${submission._id}`;

                     const subject = `IPDIMS - Revised Paper Ready For Re-Review (#${submission.paperId})`;
                     const message = `Revised paper submitted: ${submission.title}`;
                     const htmlContent = getReviewerAssignmentEmail(
                        reviewer.name,
                        submission,
                        magicLink,
                     );

                     await sendEmail({
                        email: reviewer.email,
                        subject,
                        message,
                        html: htmlContent,
                     });

                     console.log(
                        "📧 Notified reviewer about revised paper:",
                        reviewer.email,
                     );
                  } catch (revEmailErr) {
                     console.error(
                        `Failed to notify reviewer ${reviewer.email}:`,
                        revEmailErr.message,
                     );
                  }
               }
            } else {
               console.log("No assigned reviewers to notify for this revision");
            }
         } catch (err) {
            console.error(
               "Error while notifying reviewers for revision:",
               err.message,
            );
         }
      }

      res.json({
         success: true,
         message: "Submission updated successfully",
         submission,
      });
   } catch (error) {
      console.error("Error updating submission:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};
