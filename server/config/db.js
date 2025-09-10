import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
   try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
   } catch (error) {
      console.error(`❌ MongoDB Connection Failed: ${error.message}`);
      process.exit(1); // Exit process with failure
   }
};

export default connectDB;
