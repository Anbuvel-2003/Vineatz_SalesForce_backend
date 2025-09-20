import mongoose from "mongoose";
const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    Team_Id: {
      type: String,
      unique: true
    },
    id: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    description: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",

      }
    ],
    Completedlead: {
      type: Number,
      default: 0,
    },
    rejectedlead: {
      type: Number,
      default: 0,
    },
    teamlead: {
      type: String,
      required: true,
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
