import mongoose from "mongoose";
import bcrypt from "bcrypt";

const TeamSchema = new mongoose.Schema(
  {
    Team_Id: {
      type: String,
      required: true,
    },
    Team_Name: {
      type: String,
      unique: true,
      required: true,
    },
    Team_Description: {
      type: String,
      required: true,
    },
    Create_at: {
      type: Date,
      default:new Date()
    },
    Teamlead_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true
    },
    Teamlead_Name:{
      type:String,
      default:null
    },
    Completedlead :{
      type:Number,
      default:0
    },
    rejectedlead:{
      type:Number,
      default:0
    },
    Teammembers_ID:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    }
], 
    Is_active:{
        type:Boolean,
        default:true
    }
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model("Team", TeamSchema);
export default Team;
