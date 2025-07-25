import mongoose from "mongoose";
import bcrypt from "bcrypt";

const EmployeeSchema = new mongoose.Schema(
  {
    Employee_Id: {
      type: String,
      unique: true,
      required: true,
    },
    Employee_Name: {
      type: String,
      required: true,
    },
    Employee_Email: {
      type: String,
      required: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    Employee_Mobilenumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    },
    Employee_Alternative_Mobilenumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Alternative mobile number must be 10 digits"],
    },
    Employee_Address: {
      type: String,
      required: true,
    },
    Employee_joining_date: {
      type: Date,
    },
    Lead_Id: {
      type: String,
    },
    Application_Id: {
      type: String,
    },
    Client_Id: {
      type: String,
    },
    Employee_Bike_Number: {
      type: String,
      required: true,
      match: [
        /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/,
        "Please enter a valid bike number (e.g., TN01AB1234)",
      ],
    },
    Employee_Driving_License_Number: {
      type: String,
      required: true,
      match: [
        /^[A-Z]{2}\d{2}\d{11}$/,
        "Please enter a valid license number (e.g., TN1020201234567)",
      ],
    },
    Employee_Password: {
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

// 🔐 Hash password before saving
EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("Employee_Password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.Employee_Password = await bcrypt.hash(this.Employee_Password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔑 Add method to compare password
EmployeeSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.Employee_Password);
};

const Employeemodel = mongoose.model("Employee", EmployeeSchema);
export default Employeemodel;
