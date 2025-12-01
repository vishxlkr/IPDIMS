// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import connectDB from "./config/mongodb.js";
// import connectCloudinary from "./config/cloudinary.js";
// import userRouter from "./routes/userRoutes.js";
// import adminRouter from "./routes/adminRoutes.js";
// import reviewerRouter from "./routes/reviewerRoutes.js";

// // app config
// const app = express();

// // middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const port = process.env.PORT || 4000;
// connectDB();
// connectCloudinary();

// // api endpoint
// // app.use("/api/admin", adminRouter);
// // localhost:4000/api/admin/add-doctor

// // app.use("/api/doctor", doctorRouter);

// app.use("/api/user", userRouter);
// app.use("/api/admin", adminRouter);
// app.use("/api/reviewer", reviewerRouter);

// app.get("/", (req, res) => {
//    res.send("api working");
// });

// app.listen(port, () => {
//    console.log("server started on port " + port);
// });

//--------for vercel deployment--------

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import reviewerRouter from "./routes/reviewerRoutes.js";

// Create express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- IMPORTANT FOR SERVERLESS --- //
let dbConnected = false;
let cloudinaryConnected = false;

// Connect DB only once (serverless safe)
app.use(async (req, res, next) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  next();
});

// Connect Cloudinary once (serverless safe)
app.use((req, res, next) => {
  if (!cloudinaryConnected) {
    connectCloudinary();
    cloudinaryConnected = true;
  }
  next();
});

// API Routes (REMOVE /api because Vercel adds it)
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/reviewer", reviewerRouter);

// Test route
app.get("/", (req, res) => {
  res.send("API is working on Vercel");
});

// ❌ DO NOT USE app.listen() ON VERCEL
// export app for serverless function
export default app;
