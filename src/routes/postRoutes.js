import express from "express";
import {
  createapplication,
  deleteapplication,
  getapplication,
  getsingleapplication,
  updateapplication,
} from "../controllers/ApplicationControllers.js";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "../controllers/EmployeeControllers.js";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/UserControllers.js";
import {
  createReject,
  deleteReject,
  getAllRejects,
  getRejectById,
  updateReject,
} from "../controllers/RejectControllers.js";
const router = express.Router();

// APPLICATION :
router.get("/application", getapplication);
router.post("/application", createapplication);
router.get("/application/:id", getsingleapplication);
router.put("/application/:id", updateapplication);
router.delete("/application/:id", deleteapplication);

// EMPLOYEE :

router.get("/employee", getAllEmployees);
router.post("/employee", createEmployee);
router.get("/employee/:id", getEmployeeById);
router.put("/employee/:id", updateEmployee);
router.delete("/employee/:id", deleteEmployee);

// LEADS :

// USER :
router.get("/user", getAllUsers);
router.post("/user", createUser);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

// REJECT :
router.get("/reject", getAllRejects);
router.post("/reject", createReject);
router.get("/reject/:id", getRejectById);
router.put("/reject/:id", updateReject);
router.delete("/reject/:id", deleteReject);
export default router;
