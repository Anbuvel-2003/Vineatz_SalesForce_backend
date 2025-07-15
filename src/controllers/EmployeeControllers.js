import { application } from "express";
import Employeemodel from "../model/EmployeeModel.js";

// GET EMPLOYEE:
 const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employeemodel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    console.error("Get All Employees Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch employees" });
  }
};

// CREATE EMPLOYEE :
const createEmployee = async (req, res) => {
  const {
    Employee_Id,
    Employee_Name,
    Employee_Email,
    Employee_Mobilenumber,
    Employee_Alternative_Mobilenumber,
    Employee_Address,
    Employee_Bike_Number,
    Employee_Driving_License_Number,
  } = req.body;
  try {
    const existingEmployee = await Employeemodel.findOne({ Employee_Id });
    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee ID already exists!",
        success: false,
      });
    }
    const employee = await Employeemodel.create({
      Employee_Id,
      Employee_Name,
      Employee_Email,
      Employee_Mobilenumber,
      Employee_Alternative_Mobilenumber,
      Employee_Address,
      Employee_Bike_Number,
      Employee_Driving_License_Number,
    });
    res.status(200).json({
      message: "Application Created Sucessfully !!!!",
      data: employee,
      success: true,
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
  updateEmployee
};
