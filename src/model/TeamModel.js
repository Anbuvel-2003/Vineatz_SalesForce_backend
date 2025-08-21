import mongoose from "mongoose";
const TeamSchema = new mongoose.Schema(
  {
    TeamName: {
      type: String,
      required: true,
    },
    TeamId: {
      type: String,
      required: true
    },
    TeamLead: {
      type: String,
      required: true,
    },
    Employee_ID: {
      type: Array
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
  }
);

const Teammodel = mongoose.model("Team", TeamSchema);

export default Teammodel;
