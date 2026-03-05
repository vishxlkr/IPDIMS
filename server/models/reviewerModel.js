import mongoose from "mongoose";

const reviewerSchema = new mongoose.Schema(
   {
      // Basic Info
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, default: "" },
      password: { type: String, required: true },

      // Professional Details
      designation: { type: String, default: "" },
      organization: { type: String, default: "" },
      specialization: { type: [String], default: [] },

      bio: { type: String, default: "" },
      address: { type: String, default: "" },
      gender: { type: String, default: "Not Selected" },

      // Assigned Submissions
      assignedSubmissions: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "submission",
         },
      ],

      // Optional fields for reviewer management
      isActive: { type: Boolean, default: true },
      lastAssignedAt: { type: Date, default: null },
   },
   { timestamps: true },
);

const reviewerModel =
   mongoose.models.reviewer || mongoose.model("reviewer", reviewerSchema);

export default reviewerModel;
