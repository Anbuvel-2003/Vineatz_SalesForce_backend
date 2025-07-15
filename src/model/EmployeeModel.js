import mongoose from "mongoose";

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
  },
  {
    timestamps: true,
  }
);

const Employeemodel = mongoose.model("Employee", EmployeeSchema);
export default Employeemodel;
