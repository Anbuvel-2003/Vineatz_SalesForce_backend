import { application } from "express";
import Employeemodel from "../model/EmployeeModel.js";
import Welcomemail from "../emailtemplates/welcomemail.js";
import { sendMail } from "../Utils/EmailServer/emailsend.js";
import bcrypt from "bcrypt"; 
import EmailSendOtp from "../emailtemplates/emailsendotp.js";
import { createToken, verifyToken } from "../config/jwtConfig.js";
const otpStore = new Map();


// GET EMPLOYEE:
// const getAllEmployees = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const total = await Employeemodel.countDocuments();
//     const employees = await Employeemodel.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);
//     res.status(200).json({
//       success: true,
//       data: employees,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//         hasNextPage: page * limit < total,
//         hasPrevPage: page > 1,
//       },
//     });
//   } catch (error) {
//     console.error("Get All Employees Error:", error.message);
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch employees" });
//   }
// };


const getAllEmployees = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || "createdAt";  
    const order = req.query.order === "asc" ? 1 : -1; 

    // Filtering
    const search = req.query.search || ""; 
    const role = req.query.role || ""; // 👈 role filter from query

    const filter = {};

    // If search query is present
    if (search) {
      filter.$or = [
        { Employee_Name: { $regex: search, $options: "i" } },
        { Employee_Email: { $regex: search, $options: "i" } },
        { Employee_Address: { $regex: search, $options: "i" } },
        { Role: { $regex: search, $options: "i" } },
      ];
    }

    // If role filter is present
    if (role) {
      filter.Role = role; // exact match (employee / teamlead)
    }

    // Count for pagination
    const total = await Employeemodel.countDocuments(filter);

    // Fetch employees
    const employees = await Employeemodel.find(filter)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get All Employees Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch employees" });
  }
};

// CREATE EMPLOYEE :
const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      mobilenumber,
      alternative_mobilenumber,
      address,
      joining_date,
      lead_id,
      client_id,
      Bike_Number,
      driving_license_number,
      password,
    } = req.body;
    // ✅ Validate required fields
    if (
      !name ||
      !email ||
      !mobilenumber ||
      !alternative_mobilenumber ||
      !address ||
      !joining_date ||
      !driving_license_number ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }
     console.log("2222222");
    // ✅ Check if email already exists
    const existingEmployee = await Employeemodel.findOne({
      email,
    });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    // ✅ Generate auto Employee_Id like EMP001
    const lastEmployee = await Employeemodel.findOne().sort({ createdAt: -1 });
    let nextId = 1;
    if (lastEmployee && lastEmployee.id) {
      const lastIdNum = parseInt(
        lastEmployee.id.replace("EMP", "")
      );
      nextId = lastIdNum + 1;
    }
    const id = `EMP${nextId.toString().padStart(3, "0")}`;
    console.log("id", id);
    
    // ✅ Create and save new employee
    const newEmployee = new Employeemodel({
      id,
      name,
      email,
      mobilenumber,
      alternative_mobilenumber,
      address,
      joining_date,
      lead_id,
      client_id,
      Bike_Number,
      driving_license_number,
      password,
    });
    await newEmployee.save();
    // ✅ Send welcome email with credentials
    const subject = `👋 Welcome to Vineatz Salesforce, ${name}!`;
    const html = Welcomemail(email, password); // This sends raw password
    const result = await sendMail({ to: email, subject, html });
    if (!result.success) {
      console.error("Email sending failed:", result.error);
      return res.status(500).json({
        success: false,
        message: "Employee created, but failed to send email",
      });
    }
    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: newEmployee,
    });
  } catch (err) {
    console.log(err?.message);
    res.status(400).json({ message: err?.message, success: false });
  }
};

// // GET SINGLE EMPLOYEE :
const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employeemodel.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    console.error("Get Employee By ID Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching employee" });
  }
};

// // UPDATE  EMPLOYEE:
const updateEmployee = async (req, res) => {
  const { ID } = req.params;
  const {
   id,
    name,
    email,
    mobilenumber,
    alternative_mobilenumber,
    address,
    Bike_Number,
    driving_license_number,
    joining_date,
    client_id,
    lead_id,
  } = req.body;

  try {
    const employee = await Employeemodel.findById(ID);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Optionally check for duplicate Employee_Id
    if (id && id !== employee.id) {
      const duplicate = await Employeemodel.findOne({ id });
      if (duplicate) {
        return res
          .status(400)
          .json({ success: false, message: "Employee ID already exists" });
      }
    }
    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.mobilenumber =
      mobilenumber || employee.mobilenumber;
    employee.alternative_mobilenumber =
      alternative_mobilenumber ||
      employee.alternative_mobilenumber;
    employee.address = address || employee.address;
    employee.Bike_Number =
      Bike_Number || employee.Bike_Number;
    employee.driving_license_number =
      driving_license_number ||
      employee.driving_license_number;
    employee.joining_date =
      joining_date || employee.joining_date;
    employee.lead_id = lead_id || employee.lead_id;
    employee.client_id = client_id || employee.client_id;
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Update Employee Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error updating employee" });
  }
};

// // DELETE EMPLOYEE :
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Employeemodel.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete Employee Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error deleting employee" });
  }
};
 
const LoginEmployee = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userdata = await Employeemodel.findOne({ email: email });
    if (!userdata) {
      return res
        .status(404)
        .json({ message: "Employee not found", success: false });
    }
    const isMatch = await bcrypt.compare(password, userdata.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect password", success: false });
    }
    res.status(200).json({
      message: "Login successful",
      data: {
        _id: userdata._id,
        name: userdata.name,
        email: userdata.email,
        employeeId: userdata.id,
        mobilenumber: userdata.mobilenumber,
        alternative_mobilenumber: userdata.alternative_mobilenumber,
        address: userdata.address,
        Bike_Number: userdata.Bike_Number,
        driving_license_number: userdata.driving_license_number,
        joining_date: userdata.joining_date,
        lead_id: userdata.lead_id,
        client_id: userdata.client_id
      },
      success: true,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: err.message, success: false });
  }
};

const employeeSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // ✅ Check if email exists in the Users collection
    const existingUser = await Employeemodel.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Email not found", success: false });
    }
    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = await createToken(email, otp);
    console.log("Generated Token:", token);
    console.log("OTP:", otp);
    const html = EmailSendOtp(email, otp);
    const subject = "🔐 Your OTP to Change Password - Vineatz Salesforce";  
    const result = await sendMail({ to: email, subject, html });
    result.success
      ? console.log("Email sent successfully")
      : console.error("Failed to send email:", result.error);
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
    return res.status(200).json({
      message: "OTP sent successfully",
      token,
      success: true,
    });
  } catch (error) {
    console.error("Error in send-otp:", error);
    return res
      .status(500)
      .json({ message: "OTP sending failed", success: false });
  }
};
const employeeverifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const data = await verifyToken(req.headers.authorization.split(" ")[1]);
    console.log(data);
    if (data !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }
    return res
      .status(200)
      .json({ message: "OTP verified successfully", success: true });
  } catch (error) {
    console.error("Error in verify-otp:", error);
    return res
      .status(500)
      .json({ message: "OTP verification failed", success: false });
  }
};
const employeeChangepassword = async (req, res) => {
  try {
    const { newpassword, email } = req.body;

    const user = await Employeemodel.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    await Employeemodel.updateOne({ email: email }, { password: hashedPassword });

    return res
      .status(200)
      .json({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.error("Error in change-password:", error.message);
    return res 
      .status(500)
      .json({ message: "Password change failed", success: false });
  }
};



export {
  getAllEmployees,
  LoginEmployee,
  createEmployee,
  getEmployeeById,
  deleteEmployee,
  updateEmployee,
  employeeSendOtp,
  employeeverifyOtp,
  employeeChangepassword
};
    