import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    mobilenumber: {
      type: String,
      match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [300, "Address can't exceed 300 characters"],
    },
    company_name: {
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
    register_certificate_number: {
      type: String,
      trim: true,
    },
    status: {
      type: Number,
      enum: {
        values: [0, 1, 2, 3, 4, 5, 6],
        message: "Status must be between 0 and 6",
      },
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    details: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    application_id: {
      type: String,
      trim: true,
    },
    application_name: {
      type: String,
      trim: true,
    },
    joining_date: {
      type: Date,
    },
    is_rejected: {
      type: Boolean,
      default: false,
    },
    reject_subject: {
      type: String,
    },
    reject_reason: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    notes: {
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
