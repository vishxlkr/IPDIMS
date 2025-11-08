import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
   {
      paperId: { type: Number, required: true, unique: true }, // auto-increment logic handled in controller
      paperTitle: { type: String, required: true },

      presenterType: {
         type: String,
         enum: ["Online", "Offline"],
         required: true,
      },

      name: { type: String, required: true },
      designation: { type: String, required: true },
      email: { type: String, required: true },
      mobile: { type: String, required: true },

      registrationCategory: {
         type: String,
         enum: [
            "Student",
            "Academician / R&D Lab",
            "Industrialist",
            "Attendee",
            "Foreign Delegate",
         ],
         required: true,
      },

      registrationType: {
         type: String,
         enum: ["Early Bird", "Late"],
         required: true,
      },

      amountPaid: { type: Number, required: true },
      paymentDate: { type: String, required: true },
      transactionRefNo: { type: String, required: true },

      paymentProof: { type: String, required: true }, // cloudinary URL

      accommodationRequired: {
         type: String,
         enum: ["Yes", "No"],
         required: true,
      },

      foodPreference: {
         type: String,
         enum: ["Veg", "Non-Veg", "NA"],
         required: true,
      },

      additionalNotes: { type: String, default: "" },

      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
         required: true,
      },
   },
   { timestamps: true }
);

export default mongoose.model("registration", registrationSchema);
