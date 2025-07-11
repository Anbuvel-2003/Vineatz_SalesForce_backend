import express from "express";
import { createproject, CreateUser, deleteproject, getprojects, getsingleproject, LoginUser, updateproject }from "../controllers/postControllers.js";
import { CreateTask, DeleteTask, GetallTask, UpdateTask } from "../controllers/TaskController.js";
const router = express.Router();
// PROJECT :
router.get("/projects",getprojects);
router.post("/creteprojects",createproject);
router.get("/projects/:id",getsingleproject);
router.put("/updateprojects/:id",updateproject);
router.delete("/deleteprojects/:id",deleteproject);
// USER :
router.post("/CreateUser",CreateUser);
router.post("/loginUser",LoginUser);
// TASK :
router.post("/createtask",CreateTask);
router.get("/gettasks",GetallTask);
router.put("/updatetask/:id",UpdateTask);
router.delete("/deletetask/:id",DeleteTask);


export default router;