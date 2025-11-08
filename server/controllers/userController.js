import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import registrationModel from "../models/registrationModel.js";
import sendEmail from "../config/email.js";
import { v2 as cloudinary } from "cloudinary";

// Generate 6-digit OTP
const generateOTP = () =>
   Math.floor(100000 + Math.random() * 900000).toString();

// Generate JWT token
const generateToken = (id) =>
   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// ======================= SIGNUP =======================
export const signup = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
         return res.status(400).json({
            success: false,
            message: "Name, email, and password are required.",
         });
      }

      let user = await userModel.findOne({ email });

      if (user && user.isVerified) {
         return res.status(400).json({
            success: false,
            message: "User with this email already exists.",
         });
      }

      const otp = generateOTP();
      const otpExpires = Date.now() + 10 * 60 * 1000;
      const hashedPassword = await bcrypt.hash(password, 10);

      if (user) {
         user.name = name;
         user.password = hashedPassword;
         user.otp = otp;
         user.otpExpires = otpExpires;
         user.isVerified = false;
         await user.save();
      } else {
         user = new userModel({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
         });
         await user.save();
      }

      // Send OTP email
      const message = `Your OTP for registration is: ${otp}. It expires in 10 minutes.`;
      await sendEmail({
         email: user.email,
         subject: "OTP Verification",
         message,
      });

      res.status(200).json({
         success: true,
         message: "OTP sent to your email.",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during signup.",
      });
   }
};

// ======================= VERIFY OTP =======================
export const verifyOtp = async (req, res) => {
   try {
      const { email, otp } = req.body;

      if (!email || !otp) {
         return res.status(400).json({
            success: false,
            message: "Email and OTP are required.",
         });
      }

      const user = await userModel.findOne({
         email,
         otp: otp.toString(),
         otpExpires: { $gt: Date.now() },
      });

      if (!user) {
         return res.status(400).json({
            success: false,
            message: "Invalid OTP or OTP expired.",
         });
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      const token = generateToken(user._id);

      res.status(200).json({
         success: true,
         message: "OTP verified successfully.",
         user: { _id: user._id, name: user.name, email: user.email, token },
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during OTP verification.",
      });
   }
};

// ======================= LOGIN =======================
export const login = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: "Email and password are required.",
         });
      }

      const user = await userModel.findOne({ email });
      if (!user) {
         return res.status(401).json({
            success: false,
            message: "Invalid email or password.",
         });
      }

      if (!user.isVerified) {
         return res.status(400).json({
            success: false,
            message: "User not verified.",
         });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(401).json({
            success: false,
            message: "Invalid email or password.",
         });
      }

      const token = generateToken(user._id);

      res.status(200).json({
         success: true,
         message: "Login successful",
         user: { _id: user._id, name: user.name, email: user.email, token },
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during login.",
      });
   }
};

// ======================= FORGOT PASSWORD =======================
export const forgotPassword = async (req, res) => {
   try {
      const { email } = req.body;

      if (!email) {
         return res.status(400).json({
            success: false,
            message: "Email is required.",
         });
      }

      const user = await userModel.findOne({ email, isVerified: true });
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "No verified user found with this email.",
         });
      }

      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      const message = `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`;
      await sendEmail({
         email: user.email,
         subject: "Password Reset OTP",
         message,
      });

      res.status(200).json({
         success: true,
         message: "OTP sent for password reset.",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during forgot password.",
      });
   }
};

// ======================= RESET PASSWORD =======================
export const resetPassword = async (req, res) => {
   try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
         return res.status(400).json({
            success: false,
            message: "Email, OTP, and new password are required.",
         });
      }

      const user = await userModel.findOne({
         email,
         otp,
         otpExpires: { $gt: Date.now() },
      });

      if (!user) {
         return res.status(400).json({
            success: false,
            message: "Invalid OTP or OTP expired.",
         });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      res.status(200).json({
         success: true,
         message: "Password reset successfully.",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during password reset.",
      });
   }
};

// ======================= GET PROFILE =======================
export const getProfile = async (req, res) => {
   try {
      // req.user must be set by auth middleware
      const userId = req.user.id;
      const user = await userModel.findById(req.user.id).select("-password");
      if (!user) {
         return res
            .status(404)
            .json({ success: false, message: "User not found." });
      }
      res.status(200).json({ success: true, user });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error while fetching profile.",
      });
   }
};

// ======================= update PROFILE =======================

export const updateProfile = async (req, res) => {
   try {
      const userId = req.user.id;
      console.log("Updating profile for user:", userId);

      const {
         name,
         phone,
         gender,
         designation,
         personalUrl,
         organisation,
         address,
         bio,
      } = req.body;

      const imageFile = req.file;

      // Check if at least one field is provided
      if (
         !name &&
         !phone &&
         !gender &&
         !designation &&
         !personalUrl &&
         !organisation &&
         !address &&
         !bio &&
         !imageFile
      ) {
         return res.json({
            success: false,
            message: "No data provided to update",
         });
      }

      // Prepare an object with only the fields that exist
      const updateData = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (gender) updateData.gender = gender;
      if (designation) updateData.designation = designation;
      if (personalUrl) updateData.personalUrl = personalUrl;
      if (organisation) updateData.organisation = organisation;
      if (address) updateData.address = address;
      if (bio) updateData.bio = bio;

      // Update user data in DB
      await userModel.findByIdAndUpdate(userId, updateData, { new: true });

      // Handle image upload if provided
      if (imageFile) {
         const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
         });
         const imageURL = imageUpload.secure_url;
         await userModel.findByIdAndUpdate(
            userId,
            { image: imageURL },
            { new: true }
         );
      }

      res.json({ success: true, message: "Profile updated successfully" });
   } catch (error) {
      console.log("Error updating profile:", error);
      res.json({ success: false, message: error.message });
   }
};

// ⭐ CONTROLLER: User Registration for Conference
export const addRegistration = async (req, res) => {
   try {
      const {
         paperTitle,
         presenterType,
         name,
         designation,
         email,
         mobile,
         registrationCategory,
         registrationType,
         amountPaid,
         paymentDate,
         transactionRefNo,
         accommodationRequired,
         foodPreference,
         additionalNotes,
      } = req.body;

      const file = req.file; // Payment proof (jpg/jpeg/pdf)

      if (!file)
         return res.status(400).json({
            success: false,
            message: "Payment proof is required",
         });

      // ✅ Auto generate paperId (sequential globally, not per user)
      const lastEntry = await registrationModel.findOne().sort({ paperId: -1 });
      const nextPaperId = lastEntry ? lastEntry.paperId + 1 : 1;

      // ✅ Upload proof file to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.path, {
         folder: "payment_proofs",
         resource_type: "auto",
      });

      const newRegistration = new registrationModel({
         paperId: nextPaperId,
         paperTitle,
         presenterType,
         name,
         designation,
         email,
         mobile,
         registrationCategory,
         registrationType,
         amountPaid,
         paymentDate,
         transactionRefNo,
         paymentProof: uploadResult.secure_url,
         accommodationRequired,
         foodPreference,
         additionalNotes,
         userId: req.user.id, // logged-in user
      });

      await newRegistration.save();

      res.status(200).json({
         success: true,
         message: "Registration completed successfully",
         registration: newRegistration,
      });
   } catch (error) {
      console.error("❌ Registration Error:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
};
