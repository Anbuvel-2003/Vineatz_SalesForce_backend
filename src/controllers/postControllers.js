import Projects from "../model/ProjectsModel.js";
import Registeruser from "../model/RegisterModel.js";

// GET PROJECTS :

const getprojects = async (req, res) => {
    try{
        const post = await Projects.find();
        res.status(200).json(post);
    }catch(err){
        console.log(err?.message);
        res.status(400).json({message:err?.message});
    }
}

// CREATE PROJECTS :
const createproject = async (req, res) => {
    const {project_Name,project_Manager,project_description,project_status,start_Date,end_Date}=req.body;
    try{
            const post = await Projects.create({project_Name,project_Manager,project_description,project_status,start_Date,end_Date});
            res.status(200).json({message:"Project Created Sucessfully !!!!"});
    }catch(err){
        console.log(err?.message);
        res.status(400).json({message:err?.message});
    }
}
// GET SINGLE PROJECTS : 
const getsingleproject = async (req, res) => {
    try{
        const post = await Projects.findById(req.params.id);
        if(!post)
        {
            return res.status(404).json({message:"Project ID not found"});
        }
        res.status(200).json({post});
    }catch(err){
        if (err.kind === 'ObjectId' && err.name === 'CastError') {
            return res.status(400).json({message:"invalid post ID"});
        }
        console.log(err?.message);
        res.status(500).json({message:err?.message});
    }
}

// UPDATE  PROJECTS:

const updateproject = async (req, res) => {
    const {id} = req.params;
    try{
        const post  = await Projects.findById(id);
        if(!post)
        {
            return res.status(404).json({message:"Project ID not found"});
        }
        const {project_Name,project_Manager,project_description,project_status,start_Date,end_Date} = req.body;
        post.project_Name = project_Name;
        post.project_Manager = project_Manager;
        post.project_description = project_description;
        post.project_status = project_status;
        post.start_Date = start_Date;
        post.end_Date = end_Date;
        await post.save();
        res.status(200).json({
            success:true,
            message:"project details updated sucessfully !!!!",
            record:{
                project_Name:post.project_Name,
                project_Manager:post.project_Manager,
                project_description:post.project_description,
                project_status:post.project_status,
                start_Date:post.start_Date,
                end_Date:post.end_Date
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


// DELETE PROJECTS :
const deleteproject = async (req, res) => {
    try{
        const post = await Projects.findByIdAndDelete(req.params.id);
        if(!post)
        {
            return res.status(404).json({message:"Project ID not found"});
        }
        res.status(200).json({message:"Project Deleted Successfully"});
    } catch(err){
        if (err.kind === 'ObjectId' && err.name === 'CastError') {
            return res.status(400).json({message:"invalid post ID"});
        }
        console.log(err?.message);
        res.status(500).json({message:err?.message});
    }
}
// REGISTER API FUNCTION :
const CreateUser = async (req,res)=>{
    const {firstname,lastname,email,phonenumber,address,password}=req.body;
    try{
        const StudentEmail = await Registeruser.findOne({email});
        const StudentPhone = await Registeruser.findOne({phonenumber});
        if( !StudentEmail && !StudentPhone )
        {
            const Student = await Registeruser.create({firstname,lastname,email,phonenumber,address,password});
            res.status(200).json({message:"User Registered Successfully",
                record : {
                    firstname:Student.firstname,
                    lastname:Student.lastname,
                    email:Student.email,
                    phonenumber:Student.phonenumber,
                    address:Student.address,
                    password:Student.password,
                    _id:Student._id,
                }
            });
        }else{
            if (StudentEmail) {
                return res.status(400).json({message:"Email Already Exist"});
            }
            if (StudentPhone) {
                return res.status(400).json({message:"Phone Number Already Exist"});
            }
            return res.status(400).json({message:"User Already Exist"});
        }   
    }catch(err){
        if (err.kind === 'ObjectId' && err.name === 'CastError') {
            return res.status(400).json({message:"invalid post ID"});
        }
        console.log(err?.message);
        res.status(500).json({message:err?.message});
    }
}
// LOGIN API FUNCTION :
const LoginUser = async (req,res) =>{
    const {email,password} = req.body;
    try {
        const Email = await Registeruser.findOne({email});
        if(!Email)
        {
        res.status(400).json({message:"User Not Found"})
        }else{
            if(Email.password !== password)
            {
                res.status(400).json({message:"Password incorrect"})
            }else{
                res.status(200).json({message:"Login Successfull",
                    record : {
                        firstname:Email.firstname,
                        lastname:Email.lastname,
                        email:Email.email,
                        phonenumber:Email.phonenumber,
                        address:Email.address,
                        password:Email.password,
                        _id:Email._id,
                    }
                })
            } 
        }   
    } catch(err){
        if (err.kind === 'ObjectId' && err.name === 'CastError') {
            return res.status(400).json({message:"invalid post ID"});
        }
        console.log(err?.message);
        res.status(500).json({message:err?.message});
    }
}

export {createproject,getprojects,getsingleproject,updateproject,deleteproject,CreateUser,LoginUser};