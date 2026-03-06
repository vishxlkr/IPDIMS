import submissionModel from "../models/submissionModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import sendEmail from "../config/email.js";
import path from "path";

// 🟢 Create a new submission
export const newSubmission = async (req, res) => {
   try {
      const { title, description, keywords, eventName, authorOrganization } =
         req.body;
      const file = req.file; // uploaded file
      const userId = req.user.id; // comes from auth middleware

      console.log(" Received new submission request");

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

            // Use 'raw' but ensure public access is correct or use 'auto' with specific format
            // 'auto' often converts PDFs to image-deliverable assets which is good for viewing,
            // but sometimes 'raw' is safer for just file storage.
            // However, 401 on 'raw' implies access control issues.
            // Let's try 'image' resource type explicitly if we want PDF features from Cloudinary,
            // OR go back to 'raw' but ensure no access control is set (which is default usually).

            // Upload as 'raw' but force 'pdf' format if possible, or just rely on 'auto' which usually works for PDFs.
            // However, to ensure correct Content-Type for viewers, 'auto' is best as it detects PDF -> image/pdf or application/pdf.
            // Let's try explicit 'raw' resource type if 'auto' fails? No, 'auto' is correct for transformations/preview.
            // BUT for just downloading/viewing as a file, 'raw' is safer if we want exact byte-for-byte.

            // Use 'raw' as suggested for stable PDF handling.
            // Avoid contradictory flags: use_filename AND unique_filename can be used but be careful.
            // IMPORTANT: For raw files, if specific public_id is NOT provided, Cloudinary uses the filename.
            // If unique_filename is true, it appends random string.
            // We should NOT manually append extension to URL if Cloudinary does it correctly.

            const uploadResult = await cloudinary.uploader.upload(file.path, {
               resource_type: "raw", // Raw type as requested
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

            console.log("✅ Cloudinary upload success:", downloadUrl);
         } catch (err) {
            console.error("❌ Cloudinary upload failed:", err);
         }
      } else {
         console.warn("⚠️ No file uploaded in request");
      }

      if (!downloadUrl) {
         return res.json({
            success: false,
            message: "File upload failed. Please try again.",
         });
      }

      // ✅ Create submission data
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
         eventName: eventName || `IPDIMS ${new Date().getFullYear()}`,

         // 1. Author submits paper -> Needs Admin Action
         needsAdminAction: true,
         needsReviewerAction: false,
         needsAuthorAction: false,
      };

      // ✅ Save to MongoDB
      const newSubmissionDoc = new submissionModel(submissionData);
      await newSubmissionDoc.save();

      console.log("✅ Submission saved successfully");

      // ✅ Send email notification to admin
      const adminEmail = process.env.ADMIN_EMAIL; // from .env
      const emailSubject = `New Submission by ${user.name}`;
      const emailMessage = `
Hello Admin,

A new submission has been added by a user. Here are the details:

- Name: ${user.name}
- Email: ${user.email}
- Affiliation: ${user.organization || "N/A"}
- Submission Title: ${title}
- Description: ${description}
- Keywords: ${keywords}
- Event: ${submissionData.eventName}
- Attachment: ${downloadUrl ? downloadUrl : "No attachment"}

Please review the submission in the admin panel.

Thanks,
Your Application
      `;

      try {
         await sendEmail({
            email: adminEmail,
            subject: emailSubject,
            message: emailMessage,
         });
         console.log("📧 Admin notified via email");
      } catch (emailErr) {
         console.error("⚠️ Failed to send email to admin:", emailErr.message);
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

      // Find original submission
      const submission = await submissionModel.findById(id);
      if (!submission) {
         return res
            .status(404)
            .json({ success: false, message: "Submission not found" });
      }

      // Check ownership
      if (submission.author.toString() !== userId) {
         return res.status(403).json({
            success: false,
            message: "Not authorized to edit this submission",
         });
      }

      // Update basic fields
      if (title) submission.title = title;
      if (description) submission.description = description;
      if (keywords)
         submission.keywords = Array.isArray(keywords)
            ? keywords
            : keywords.split(",").map((k) => k.trim());

      // Handle file update if new file provided
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
         } catch (err) {
            console.error("Cloudinary upload failed:", err);
            return res
               .status(500)
               .json({ success: false, message: "File upload failed" });
         }
      }

      // Automatically set status to "Under Review" upon user edit
      submission.status = "Under Review";

      // 5. Author submits revised paper -> Needs Reviewer Action
      submission.needsAuthorAction = false;
      submission.needsReviewerAction = true;
      // In case they were revising based on admin feedback before reviewer assignment?
      // Prompt says "needsReviewerAction = true". Assuming workflow strictly follows 4 -> 5.

      await submission.save();

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
