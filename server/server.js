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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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



git quickgit quickgit quickgit quickgit quick
git quickgit quickgit quickgit quickgit quick
git quickgit quickgit quickgit quickgit quickgit quick
git quickgit quickgit quickgit quickgit quickgit quick