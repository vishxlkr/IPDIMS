import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, required: false },
      password: { type: String, required: true },

      gender: { type: String, default: "Not Selected" },
      designation: { type: String, default: "" },
      personalUrl: { type: String, default: "" },
      organization: { type: String, default: "" },
      address: { type: String, default: "" },
      bio: { type: String, default: "" },
      image: {
         type: String,
         default: "",
      },
      isVerified: {
         type: Boolean,
         default: false,
      },
      otp: {
         type: String,
      },
      otpExpires: {
         type: Date,
      },
   },
   { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;


git quickgit quickgit quickgit quickgit quickgit quickgit quick