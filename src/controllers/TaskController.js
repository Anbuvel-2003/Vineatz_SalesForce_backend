import Task from "../model/TaskModal.js";

const GetallTask = async (req, res) => {
    try{
        const post = await Task.find();
        res.status(200).json(post);
    }catch(err){
        console.log(err?.message);
        res.status(400).json({message:err?.message});
    }
}
const CreateTask = async (req, res) => {
    const {Task_Name,Task_Description,Task_Assigned_To,Task_Assigned_By,Task_Status,Task_Deadline}=req.body;
    try{
            const post = await Task.create({Task_Name,Task_Description,Task_Assigned_To,Task_Assigned_By,Task_Status,Task_Deadline});
            res.status(200).json({message:"Task Created Sucessfully !!!!"});
    }catch(err){
        console.log(err?.message);
        res.status(400).json({message:err?.message});
    }
}
const UpdateTask = async (req, res) => {
    const {id} = req.params;
    try{
        const post  = await Task.findById(id);
        if(!post)
        {
            return res.status(404).json({message:"Task ID not found"});
        }
        const {Task_Name,Task_Description,Task_Assigned_To,Task_Assigned_By,Task_Status,Task_Deadline} = req.body;
        post.Task_Name = Task_Name;
        post.Task_Description = Task_Description;
        post.Task_Assigned_To = Task_Assigned_To;
        post.Task_Assigned_By = Task_Assigned_By;
        post.Task_Status = Task_Status;
        post.Task_Deadline = Task_Deadline;
        await post.save();
        res.status(200).json({
            success:true,
            message:"Task details updated sucessfully !!!!",
            record:{
                Task_Name:post.Task_Name,
                Task_Description:post.Task_Description,
                Task_Assigned_To:post.Task_Assigned_To,
                Task_Assigned_By:post.Task_Assigned_By,
                Task_Status:post.Task_Status,
                Task_Deadline:post.Task_Deadline
            }
        });
    }
    catch(err){
        if (err.kind === 'ObjectId' && err.name === 'CastError') {
            return res.status(400).json({message:"invalid Project ID"});
        }
        console.log(err?.message);
        res.status(500).json({message:err?.message});
    }
}

const DeleteTask = async (req, res) => {
    try{
        const post = await Task.findByIdAndDelete(req.params.id);
        if(!post)
        {
            return res.status(404).json({message:"Task ID not found"});
        }
        res.status(200).json({message:"Task Deleted Successfully"});
    } catch(err){
        if (err.kind === 'ObjectId' && err.name === 'CastError') {
            return res.status(400).json({message:"invalid post ID"});
        }
        console.log(err?.message);
        res.status(500).json({message:err?.message});
    }
}



export {GetallTask,CreateTask,DeleteTask,UpdateTask};