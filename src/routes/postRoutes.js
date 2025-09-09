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
  LoginEmployee,
  updateEmployee,
} from "../controllers/EmployeeControllers.js";
import {
  Changepassword,
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  LoginUser,
  SendOtp,
  updateUser,
  VerifyOtp,
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
import {
  addNote,
  createLead,
  deleteNote,
  getAllLeads,
  getAllRejectedLeads,
  getSingleLead,
  rejectmessage,
  updateLeadStatus,
  updateNote,
} from "../controllers/LeadControllers.js";
import { createTeamlead, deleteTeamlead, getAllTeamlead, getTeamleadById, updateTeamlead } from "../controllers/TeamleadController.js";
import { createTeam, deleteTeam, getAllTeam, getTeamById, updateTeam } from "../controllers/TeamController.js";
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
router.post("/employeelogin", LoginEmployee);
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
router.post("/user/sendotp", SendOtp);
router.post("/user/verifyotp", VerifyOtp);
router.post("/user/changepassword", Changepassword);

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

// TEAMLEAD :
router.get("/teamlead", getAllTeamlead);
router.post("/teamlead", createTeamlead);
router.get("/teamlead/:id", getTeamleadById);
router.get("/teamlead/:id", deleteTeamlead);
router.get("/teamlead/:id", updateTeamlead);

// TEAM :
router.get("/team", getAllTeam);
router.post("/team", createTeam);
router.get("/team/:id", getTeamById);
router.get("/team/:id", deleteTeam);
router.get("/team/:id", updateTeam);

// Notification :
router.get("/notification", getAllnotifications);

// Leads :
router.get("/lead", getAllLeads);
router.post("/lead", createLead);
router.post("/lead/:id", getSingleLead);
router.post("/lead/:leadId/notes", addNote);
router.delete("/lead/:leadId/notes/:noteId", deleteNote);
router.put("/lead/:leadId/notes/:noteId", updateNote);
router.put("/lead/:leadId", updateLeadStatus);
router.put("/lead/reject/:leadId", rejectmessage);
router.get("/lead/reject", getAllRejectedLeads);

export default router;
