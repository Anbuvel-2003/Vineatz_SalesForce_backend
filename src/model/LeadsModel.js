import mongoose from "mongoose";
const leadsschema = new mongoose.Schema(
  {
    Lead_Status_ID: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7],
    },
    Application_ID: {
      type: String,
    },
    Employee_Id: {
      type: String,
    },
    Reject_ID: {
      type: String,
    },
    First_Stage: {
      type: Array,
    },
    Second_Stage: {
      type: Array,
    },
    Third_Stage: {
      type: Array,
    },
    Fourth_Stage: {
      type: Array,
    },  
    Fivth_Stage: {
      type: Array,
    },
    Sixth_Stage: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const leads = mongoose.model("leads", leadsschema);
export default leads;
