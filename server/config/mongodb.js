import mongoose from "mongoose";

const connectDB = async () => {
   try {
      mongoose.set("strictQuery", false);
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("✅ Database connected successfully");
   } catch (err) {
      console.error("❌ Database connection error:", err.message);
   }
};

export default connectDB;
