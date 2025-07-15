import mongoose from "mongoose";

const RejectSchema = new mongoose.Schema(
  {
    Application_Id: { type: String },
    Employee_Id: { type: String },
    Lead_Id: { type: String },
    reject_subject: { type: String },
    reject_reason: { type: String },
    Lead_Stage_No: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3, 4, 5, 6],
    },
  },
  { timestamps: true }
);

const Rejectmodel = mongoose.model("Rejects", RejectSchema);
export default Rejectmodel;
