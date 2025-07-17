import mongoose from "mongoose";
const ClientSchema = new mongoose.Schema(
  {
    Client_Name: {
      type: String,
      required: true,
    },
    Client_Mobilenumber: {
      type: Number,
      required: true,
    },
    Client_Email: {
      type: String,
      required: true,
    },
    Company_Name: {
      type: String,
      required: true,
    },
    Register_Certificate_Number: {
      type: String,
      required: true,
    },
    GST: {
      type: String,
    },
    Address: {
      type: String,
      required: true,
    },
    Employee_ID: {
      type: String,
    },
    Application_ID: {
      type: String,
    },
    Lead_ID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Clientmodel = mongoose.model("Client", ClientSchema);
export default Clientmodel;
