import mongoose from "mongoose";

/* -----------------------------------------
   COUNTER SCHEMA (used to auto-increment paperId)
-------------------------------------------- */
const counterSchema = new mongoose.Schema({
   _id: { type: String, required: true }, // name of the sequence (e.g. paperId)
   seq: { type: Number, default: 0 }, // current value
});

// If already exists, reuse — prevents OverwriteModelError
const Counter =
   mongoose.models.Counter || mongoose.model("Counter", counterSchema);

/* -----------------------------------------
   SUBMISSION SCHEMA
-------------------------------------------- */
const submissionSchema = new mongoose.Schema(
   {
      paperId: { type: Number, unique: true }, // <-- AUTO INCREMENT FIELD

      title: { type: String, required: true },
      description: { type: String, required: true },
      keywords: { type: [String], default: [] },

      // Author reference
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
         required: true,
      },

      // Stored redundantly for safety
      authorName: { type: String, required: true },
      authorEmail: { type: String, required: true },
      authorAffiliation: { type: String, default: "" },

      attachment: { type: String, default: "" },

      // Reviewer reference
      reviewer: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "reviewer",
         default: null,
      },

      status: {
         type: String,
         enum: [
            "Pending",
            "Under Review",
            "Accepted",
            "Rejected",
            "Revision Requested",
         ],
         default: "Pending",
      },

      feedback: [
         {
            reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "reviewer" },
            comment: { type: String, required: true },
            recommendation: {
               type: String,
               enum: ["Accepted", "Rejected", "Revision Required"],
               default: "Revision Required",
            },
            createdAt: { type: Date, default: Date.now },
         },
      ],

      paymentScreenshot: { type: String, default: "" },
      paymentStatus: { type: Boolean, default: false },

      eventName: {
         type: String,
         default: `IPDIMS ${new Date().getFullYear()}`,
      },
   },
   { timestamps: true }
);

/* -----------------------------------------
   AUTO-INCREMENT LOGIC FOR paperId
-------------------------------------------- */
submissionSchema.pre("save", async function (next) {
   if (this.paperId) return next(); // prevents reassignment if updating document

   try {
      const counter = await Counter.findByIdAndUpdate(
         { _id: "paperId" },
         { $inc: { seq: 1 } }, // seq = seq + 1
         { new: true, upsert: true } // create if doesn't exist
      );

      this.paperId = counter.seq; // Assign incremented ID
      next();
   } catch (error) {
      next(error);
   }
});

/* -----------------------------------------
   EXPORT MODEL
-------------------------------------------- */
const submissionModel =
   mongoose.models.submission || mongoose.model("submission", submissionSchema);

export default submissionModel;
