import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
   {
      // 🧩 Basic Paper Info
      title: { type: String, required: true },
      description: { type: String, required: true },
      keywords: { type: [String], default: [] },

      // 👤 Author (linked to user model)
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
         required: true,
      },

      // 🔒 Redundant Author Info (safety copy)
      authorName: { type: String, required: true },
      authorEmail: { type: String, required: true },
      authorAffiliation: { type: String, default: "" },

      // 📎 Attachment (single main file)
      attachment: { type: String, default: "" },

      // 👨‍🏫 Reviewer (assigned later by admin)
      reviewer: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "reviewer", // linked to reviewer model
         default: null,
      },

      // 📊 Paper Status
      status: {
         type: String,
         enum: [
            "Pending",
            "Under Review",
            "Accepted",
            "Rejected",
            "Revision Requested",
         ],
         default: "Pending",
      },

      // 💳 Payment Screenshot (image link)
      paymentScreenshot: { type: String, default: "" },
      paymentStatus: {
         type: Boolean,
         default: "false",
      },

      // 🎫 Event Dropdown
      eventName: {
         type: String,

         default: `IPDIMS ${new Date().getFullYear()}`,
      },
   },
   { timestamps: true }
);

const submissionModel =
   mongoose.models.submission || mongoose.model("submission", submissionSchema);

export default submissionModel;
