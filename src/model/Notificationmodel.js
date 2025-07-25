import mongoose from "mongoose";
const Notificationschema = new mongoose.Schema(
  {
    Client_Id: {
      type: String,
    },
    Application_Id: {
      type: String,
    },
    Application_Name: {
      type: String,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notificationmodel = mongoose.model("Notification", Notificationschema);
export default Notificationmodel;
