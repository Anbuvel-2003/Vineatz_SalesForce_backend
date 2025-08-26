import mongoose from "mongoose";
const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    members: {
      type: Array,
    },
    teamlead: {
      type: String,
      required: true,
    },
    employees: {
      type: Array,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Teammodel = mongoose.model("Team", TeamSchema);

export default Teammodel;
