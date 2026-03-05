import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
   try {
      // 1️ get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
         return res.status(401).json({
            success: false,
            message: "Not authorized. Please login again.",
         });
      }

      const token = authHeader.split(" ")[1]; // get the actual token

      // 2️ verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
         return res.status(401).json({
            success: false,
            message: "Invalid token. Please login again.",
         });
      }

      req.user = { id: decoded.id }; // attach user info
      next();
   } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401).json({
         success: false,
         message: "Authentication failed. " + error.message,
      });
   }
};

export default authUser;
