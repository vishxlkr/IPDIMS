import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";
import bcrypt from "bcryptjs"; // ✅ Import bcryptjs for matchPassword

// Function to generate a 6-digit OTP
const generateOTP = () => {
   return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to generate JWT
const generateToken = (id, role) => {
   // ✅ Now the token's payload includes the user's role
   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
   });
};

// @desc    Register a new user (sends OTP)
// @route   POST /api/users/signup
// @access  Public
export const signup = async (req, res) => {
   const { name, email, password } = req.body;
   try {
      const existingVerifiedUser = await User.findOne({
         email,
         isVerified: true,
      });
      if (existingVerifiedUser) {
         return res
            .status(400)
            .json({ message: "User with this email already exists." });
      }
      const otp = generateOTP();
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      let user = await User.findOne({ email });
      if (user) {
         user.name = name;
         user.password = password; // Hashed by the pre-save hook
         user.otp = otp;
         user.otpExpires = otpExpires;
         user.isVerified = false;
      } else {
         // ✅ The default role of "author" is set in the user model
         user = new User({ name, email, password, otp, otpExpires });
      }
      await user.save();
      const message = `Your OTP for registration is: ${otp}. It will expire in 10 minutes.`;
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
      res.status(500).json({ message: "Server error during signup." });
   }
};

// @desc    Verify OTP and create user
// @route   POST /api/users/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
   const { email, otp } = req.body;
   try {
      const user = await User.findOne({
         email,
         otp,
         otpExpires: { $gt: Date.now() },
      });
      if (!user) {
         return res
            .status(400)
            .json({ message: "Invalid OTP or OTP has expired." });
      }
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      const token = generateToken(user._id, user.role); // ✅ Generate token with user's ID and role
      res.status(201).json({
         _id: user._id,
         name: user.name,
         email: user.email,
         role: user.role, // ✅ Return the user's role
         token,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         message: "Server error during OTP verification.",
      });
   }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
   const { email, password } = req.body;
   try {
      const user = await User.findOne({ email });
      if (user && user.isVerified && (await user.matchPassword(password))) {
         const token = generateToken(user._id, user.role); // ✅ Generate token with user's ID and role
         res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, // ✅ Return the user's role
            token,
         });
      } else {
         res.status(401).json({
            message: "Invalid email or password, or user not verified.",
         });
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error during login." });
   }
};

// @desc    Forgot password (sends OTP)
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
   const { email } = req.body;
   try {
      const user = await User.findOne({ email, isVerified: true });
      if (!user) {
         return res
            .status(404)
            .json({ message: "No verified user found with this email." });
      }
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();
      const message = `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`;
      await sendEmail({
         email: user.email,
         subject: "Password Reset OTP",
         message,
      });
      res.status(200).json({
         success: true,
         message: "OTP for password reset sent to your email.",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         message: "Server error during forgot password process.",
      });
   }
};

// @desc    Reset password using OTP
// @route   POST /api/users/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
   const { email, otp, newPassword } = req.body;
   try {
      const user = await User.findOne({
         email,
         otp,
         otpExpires: { $gt: Date.now() },
      });
      if (!user) {
         return res
            .status(400)
            .json({ message: "Invalid OTP or OTP has expired." });
      }
      user.password = newPassword;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      res.status(200).json({
         success: true,
         message: "Password has been reset successfully. Please login.",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error during password reset." });
   }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
   if (req.user) {
      res.json({
         _id: req.user._id,
         name: req.user.name,
         email: req.user.email,
         role: req.user.role, // ✅ Also include the role
      });
   } else {
      res.status(404).json({ message: "User not found" });
   }
};
