import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import reviewerRouter from "./routes/reviewerRoutes.js";

// app config
const app = express();

// middlewares
app.disable("x-powered-by");

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
const allowedOrigins = (process.env.CORS_ORIGINS || "")
   .split(",")
   .map((origin) => origin.trim())
   .filter(Boolean);

app.use(
   cors({
      origin(origin, callback) {
         // Allow non-browser clients and local/dev setups where origins are unset.
         if (!origin || allowedOrigins.length === 0) {
            callback(null, true);
            return;
         }

         if (allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
         }

         callback(new Error("CORS origin not allowed"));
      },
      credentials: true,
   }),
);

// app.use(
//    cors({
//       origin: "*",
//       methods: ["GET", "POST", "PUT", "DELETE"],
//       allowedHeaders: ["Content-Type", "Authorization"],
//    })
// );

const port = process.env.PORT || 4000;

// api endpoint
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reviewer", reviewerRouter);

app.get("/", (req, res) => {
   res.send("api workinggggggggggggggg");
});

app.get("/health", (req, res) => {
   res.status(200).json({ success: true, message: "ok" });
});

const bootstrap = async () => {
   await connectDB();
   await connectCloudinary();

   app.listen(port, () => {
      console.log("✅ server started on port " + port);
   });
};

bootstrap().catch((error) => {
   console.error("❌ Failed to start server:", error.message);
   process.exit(1);
});
