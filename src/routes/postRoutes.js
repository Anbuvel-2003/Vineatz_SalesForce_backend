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
  getalltotalemployee,
  getEmployeeById,
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
import { getAllnotifications } from "../controllers/NotificationControllers.js";
import {
  addNote,
  createLead,
  deleteNote,
  getAllLeads,
  getSingleLead,
  updateLeadStatus,
  updateNote,
} from "../controllers/LeadControllers.js";
import { createTeam, deleteTeam, getTeams, updateTeam } from "../controllers/TeamControllers.js";
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
router.get("/totalemployeelist",getalltotalemployee)
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


// Team :

router.get("/team",getTeams);
router.post("/team",createTeam);
router.put("/team:id",updateTeam);
router.delete("/team:id",deleteTeam)

export default router;
