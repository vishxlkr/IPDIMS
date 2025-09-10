import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes that require authentication
export const protect = async (req, res, next) => {
   let token;

   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
   ) {
      try {
         token = req.headers.authorization.split(" ")[1];
         // ✅ The decoded token now includes the user's ID and role
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         // ✅ Fetch the user and their role from the database
         req.user = await User.findById(decoded.id).select("-password");

         if (!req.user) {
            return res
               .status(401)
               .json({ message: "Not authorized, user not found" });
         }

         next();
      } catch (error) {
         console.error(error);
         return res
            .status(401)
            .json({ message: "Not authorized, token failed" });
      }
   }

   if (!token) {
      return res
         .status(401)
         .json({ message: "Not authorized, no token provided" });
   }
};

// ✅ New middleware to authorize specific roles
export const authorizeRoles = (...roles) => {
   return (req, res, next) => {
      // Check if the authenticated user's role is in the list of allowed roles
      if (!req.user || !roles.includes(req.user.role)) {
         return res.status(403).json({ message: "Access Denied" });
      }
      next();
   };
};
