import mongoose from "mongoose";
import bcrypt from "bcrypt";

const EmployeeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    mobilenumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    },
    alternative_mobilenumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Alternative mobile number must be 10 digits"],
    },
    address: {
      type: String,
      required: true,
    },
    joining_date: {
      type: Date,
    },
    lead_id: {
      type: String,
    },
    client_id: {
      type: String,
    },
    Bike_Number: {
      type: String,
      required: true,
      match: [
        /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/,
        "Please enter a valid bike number (e.g., TN01AB1234)",
      ],
    },
    driving_license_number: {
      type: String,
      required: true,
      match: [
        /^[A-Z]{2}\d{2}\d{11}$/,
        "Please enter a valid license number (e.g., TN1020201234567)",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
        },
        message:
          "Password must include uppercase, lowercase, number, and special character",
      },
    },
    role: {
      type: String,
      enum: ["leader", "member"],
      default: "member",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    fcm_token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password before saving
EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔑 Add method to compare password
EmployeeSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

const Employeemodel = mongoose.model("Employee", EmployeeSchema);
export default Employeemodel;
