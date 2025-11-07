import submissionModel from "../models/submissionModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import sendEmail from "../config/email.js";

// 🟢 Create a new submission
export const newSubmission = async (req, res) => {
   try {
      const { title, description, keywords, eventName } = req.body;
      const file = req.file; // uploaded file
      const userId = req.user.id; // comes from auth middleware

      console.log("🧾 Received new submission request");

      // ✅ Validate required fields
      if (!title || !description || !keywords) {
         return res.json({
            success: false,
            message: "Missing required fields",
         });
      }

      // ✅ Find user from DB
      const user = await userModel.findById(userId);
      if (!user) {
         return res.json({ success: false, message: "User not found" });
      }

      // ✅ Upload file to Cloudinary (supports image/pdf)
      let fileUrl = "";

      if (file) {
         try {
            console.log(
               "📁 Uploading to Cloudinary:",
               file.originalname,
               file.mimetype
            );

            // For PDF files, Cloudinary needs resource_type = "raw"
            const resourceType =
               file.mimetype === "application/pdf" ? "raw" : "auto";

            const uploadResult = await cloudinary.uploader.upload(file.path, {
               resource_type: "auto",
               folder: "submissions",
               use_filename: true,
               unique_filename: false,
            });

            fileUrl = uploadResult.secure_url;
            console.log("✅ Cloudinary upload success:", fileUrl);
         } catch (err) {
            console.error("❌ Cloudinary upload failed:", err);
         }
      } else {
         console.warn("⚠️ No file uploaded in request");
      }

      if (!fileUrl) {
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
         authorAffiliation: user.organization || "",
         attachment: fileUrl,
         eventName: eventName || `IPDIMS ${new Date().getFullYear()}`,
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
- Attachment: ${fileUrl ? fileUrl : "No attachment"}

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
         .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         submissions,
      });
   } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};










git quick
git quickgit quickgit quickgit quickgit quickgit quickgit quick
git quickgit quickgit quickgit quickgit quick
git quickgit quickgit quickgit quickgit quickgit quickgit quick
git quickgit quickgit quickgit quickgit quickgit quickgit quickgit quickgit quickgit quickgit quickgit quickgit quick