import jwt from "jsonwebtoken";
import reviewerModel from "../models/reviewerModel.js";

export const authReviewer = async (req, res, next) => {
   try {
      const token = req.headers.rtoken; //  Only check rtoken

      if (!token) {
         return res
            .status(401)
            .json({ success: false, message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const reviewer = await reviewerModel
         .findById(decoded.id)
         .select("-password");
      if (!reviewer) {
         return res
            .status(401)
            .json({ success: false, message: "Reviewer not found" });
      }

      req.user = { id: reviewer._id, role: "reviewer" };
      next();
   } catch (error) {
      res.status(401).json({
         success: false,
         message: "Unauthorized",
         error: error.message,
      });
   }
};
