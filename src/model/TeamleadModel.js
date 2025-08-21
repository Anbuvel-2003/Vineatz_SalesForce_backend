import mongoose from "mongoose";
import bcrypt from "bcrypt";

const TeamleadSchema = new mongoose.Schema(
  {
    Id: {
      type: String,
      unique: true,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
     Mobilenumber: {
      type: String,
      required: true, 
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    },
    Alternative_Mobilenumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Alternative mobile number must be 10 digits"],
    },
    Address: {
      type: String,
      required: true,
    },
    joining_date: {
      type: Date,
    },
    TeamId: {
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
    Driving_License_Number: {
      type: String,
      required: true,
      match: [
        /^[A-Z]{2}\d{2}\d{11}$/,
        "Please enter a valid license number (e.g., TN1020201234567)",
      ],
    },
    Password: {
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
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password before saving :
TeamleadSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  try {0
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔑 Add method to compare password :
TeamleadSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.Password);
};

const Teamleadmodel = mongoose.model("Teamlead", TeamleadSchema);
export default Teamleadmodel;
