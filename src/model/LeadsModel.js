import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    Id: {
      type: String,
      unique: true,
      trim: true,
    },
    Name: {
      type: String,
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    Email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    Mobilenumber: {
      type: String,
      match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
    },
    Address: {
      type: String,
      trim: true,
      maxlength: [300, "Address can't exceed 300 characters"],
    },
    Company_Name: {
      type: String,
      trim: true,
    },
    GST: {
      type: String,
      trim: true,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GST format",
      ],
    },
    Register_Certificate_Number: {
      type: String,
      trim: true,
    },
    Status: {
      type: Number,
      enum: {
        values: [0, 1, 2, 3, 4, 5, 6],
        message: "Status must be between 0 and 6",
      },
    },
    details: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    Application_Id: {
      type: String,
      trim: true,
    },
    Application_Name: {
      type: String,
      trim: true,
    },
    Joining_Date: {
      type: Date,
    },
    Is_rejected: {
      type: Boolean,
      default: false,
    },
    reject_subject: {
      type: String,
    },
    reject_reason: {
      type: String,
    },
    Notes: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
          subject: String,
          note: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
