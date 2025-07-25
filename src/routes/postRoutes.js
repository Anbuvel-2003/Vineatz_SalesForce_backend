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
  LoginUser,
  updateUser,
} from "../controllers/UserControllers.js";
import {
  createReject,
  deleteReject,
  getAllRejects,
  getRejectById,
  updateReject,
} from "../controllers/RejectControllers.js";
import {
  createclient,
  deleteClient,
  getAllclient,
  getClientById,
  updateClient,
} from "../controllers/ClientControllers.js";
import { getAllnotifications } from "../controllers/NotificationControllers.js";
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
router.post("/user/login", LoginUser);

// REJECT :
router.get("/reject", getAllRejects);
router.post("/reject", createReject);
router.get("/reject/:id", getRejectById);
router.put("/reject/:id", updateReject);
router.delete("/reject/:id", deleteReject);

// CLIENT :
router.get("/client", getAllclient);
router.post("/client", createclient);
router.get("/client/:id", getClientById);
router.get("/client/:id", updateClient);
router.get("/client/:id", deleteClient);

// Notification :
router.get("/notification", getAllnotifications);
export default router;
