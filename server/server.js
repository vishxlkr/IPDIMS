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

// app.use(
//    cors({
//       origin: "*",
//       methods: ["GET", "POST", "PUT", "DELETE"],
//       allowedHeaders: ["Content-Type", "Authorization"],
//    })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// api endpoint
// app.use("/api/admin", adminRouter);
// localhost:4000/api/admin/add-doctor

// app.use("/api/doctor", doctorRouter);

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reviewer", reviewerRouter);

app.get("/", (req, res) => {
   res.send("api working");
});

app.listen(port, () => {
   console.log("server started on port " + port);
});




git quick