import { application } from "express";
import Employeemodel from "../model/EmployeeModel.js";
import Welcomemail from "../emailtemplates/welcomemail.js";
import { sendMail } from "../Utils/EmailServer/emailsend.js";
import bcrypt from "bcrypt"; 


// GET EMPLOYEE:
const getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Employeemodel.countDocuments();
    const employees = await Employeemodel.find()
      .sort({ createdAt: -1 })
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
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch employees" });
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
        id: userdata._id,
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



export {
  getAllEmployees,
  LoginEmployee,
  createEmployee,
  getEmployeeById,
  deleteEmployee,
  updateEmployee,
};
    