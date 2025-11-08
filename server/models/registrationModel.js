import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
   {
      paperId: { type: Number, required: true, unique: true },
      paperTitle: { type: String, required: true },
      presenterType: { type: String, required: true },
      name: { type: String, required: true },
      designation: { type: String, required: true },
      email: { type: String, required: true },
      mobile: { type: String, required: true },
      registrationCategory: { type: String, required: true },
      registrationType: { type: String, required: true },
      amountPaid: { type: Number, required: true },
      paymentDate: { type: String, required: true },
      transactionRefNo: { type: String, required: true },
      paymentProof: { type: String, required: true },
      accommodationRequired: { type: String },
      foodPreference: { type: String },
      additionalNotes: { type: String },
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
         required: true,
      },
   },
   { timestamps: true }
);

export default mongoose.model("registration", registrationSchema);
