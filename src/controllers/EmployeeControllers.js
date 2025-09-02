import { application } from "express";
import Employeemodel from "../model/EmployeeModel.js";
import Welcomemail from "../emailtemplates/welcomemail.js";
import { sendMail } from "../Utils/EmailServer/emailsend.js";

// GET EMPLOYEE:
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
      Employee_Name,
      Employee_Email,
      Employee_Mobilenumber,
      Employee_Alternative_Mobilenumber,
      Employee_Address,
      Employee_joining_date,
      Lead_Id,
      Application_Id,
      Client_Id,
      Employee_Bike_Number,
      Employee_Driving_License_Number,
      Employee_Password,
    } = req.body;
    // ✅ Validate required fields
    if (
      !Employee_Name ||
      !Employee_Email ||
      !Employee_Mobilenumber ||
      !Employee_Alternative_Mobilenumber ||
      !Employee_Address ||
      !Employee_Bike_Number ||
      !Employee_Driving_License_Number ||
      !Employee_Password
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }
    // ✅ Check if email already exists
    const existingEmployee = await Employeemodel.findOne({
      Employee_Email,
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
    if (lastEmployee && lastEmployee.Employee_Id) {
      const lastIdNum = parseInt(
        lastEmployee.Employee_Id.replace("EMP", "")
      );
      nextId = lastIdNum + 1;
    }
    const Employee_Id = `EMP${nextId.toString().padStart(3, "0")}`;
    // ✅ Create and save new employee
    const newEmployee = new Employeemodel({
      Employee_Id,
      Employee_Name,
      Employee_Email,
      Employee_Mobilenumber,
      Employee_Alternative_Mobilenumber,
      Employee_Address,
      Employee_joining_date,
      Lead_Id,
      Application_Id,
      Client_Id,
      Employee_Bike_Number,
      Employee_Driving_License_Number,
      Employee_Password,
    });
    await newEmployee.save();
    // ✅ Send welcome email with credentials
    const subject = `👋 Welcome to Vineatz Salesforce, ${Employee_Name}!`;
    const html = Welcomemail(Employee_Email, Employee_Password); // This sends raw password
    const result = await sendMail({ to: Employee_Email, subject, html });
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
  const { id } = req.params;

  const {
    Employee_Id,
    Employee_Name,
    Employee_Email,
    Employee_Mobilenumber,
    Employee_Alternative_Mobilenumber,
    Employee_Address,
    Employee_Bike_Number,
    Employee_Driving_License_Number,
    Employee_joining_date,
    Application_Id,
    Client_Id,
    Lead_Id,
  } = req.body;

  try {
    const employee = await Employeemodel.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Optionally check for duplicate Employee_Id
    if (Employee_Id && Employee_Id !== employee.Employee_Id) {
      const duplicate = await Employeemodel.findOne({ Employee_Id });
      if (duplicate) {
        return res
          .status(400)
          .json({ success: false, message: "Employee ID already exists" });
      }
    }
    employee.Employee_Name = Employee_Name || employee.Employee_Name;
    employee.Employee_Email = Employee_Email || employee.Employee_Email;
    employee.Employee_Mobilenumber =
      Employee_Mobilenumber || employee.Employee_Mobilenumber;
    employee.Employee_Alternative_Mobilenumber =
      Employee_Alternative_Mobilenumber ||
      employee.Employee_Alternative_Mobilenumber;
    employee.Employee_Address = Employee_Address || employee.Employee_Address;
    employee.Employee_Bike_Number =
      Employee_Bike_Number || employee.Employee_Bike_Number;
    employee.Employee_Driving_License_Number =
      Employee_Driving_License_Number ||
      employee.Employee_Driving_License_Number;
    employee.Employee_joining_date =
      Employee_joining_date || employee.Employee_joining_date;
    employee.Lead_Id = Lead_Id || employee.Lead_Id;
    employee.Application_Id = Application_Id || employee.Application_Id;
    employee.Client_Id = Client_Id || employee.Client_Id;
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

export {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  deleteEmployee,
  updateEmployee,
};
    