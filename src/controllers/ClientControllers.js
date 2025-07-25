import Applicationmodel from "../model/ApplicationModel.js";
import Clientmodel from "../model/ClientModel.js";
import Notificationmodel from "../model/Notificationmodel.js";

// GET CLIENT:
const getAllclient = async (req, res) => {
  try {
    const client = await Clientmodel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    console.error("Get All Client Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch Client" });
  }
};

// CREATE CLIENT :
const createclient = async (req, res) => {
  const {
    Client_Name,
    Client_Mobilenumber,
    Client_Email,
    Company_Name,
    Register_Certificate_Number,
    GST,
    Address,
    Employee_ID,
    Application_ID,
    Lead_ID,
  } = req.body;
  try {
    const client = await Clientmodel.create({
      Client_Name,
      Client_Mobilenumber,
      Client_Email,
      Company_Name,
      Register_Certificate_Number,
      GST,
      Address,
      Employee_ID,
      Application_ID,
      Lead_ID,
    });
    const application = await Applicationmodel.findById(Application_ID);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    console.log("application", application);
    console.log("application", application?.Application_Name);

    await Notificationmodel.create({
      Client_Id: client._id?.toString(),
      Application_Id: Application_ID,
      Application_Name: application?.Application_Name,
      is_read: false,
      message: `The lead has been received for ${application?.Application_Name}, please check and process it`,
    });

    res.status(200).json({
      message: "Client Created Sucessfully !!!!",
      data: client,
      success: true,
    });
  } catch (err) { console.log(err?.message);
    res.status(400).json({ message: err?.message, success: false });
  }
};

// // GET SINGLE EMPLOYEE :
const getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Clientmodel.findById(id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    console.error("Get client By ID Error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching client" });
  }
};

// // UPDATE  CLIENT:
const updateClient = async (req, res) => {
  const { id } = req.params;
  const {
    Client_Name,
    Client_Mobilenumber,
    Client_Email,
    Company_Name,
    Register_Certificate_Number,
    GST,
    Address,
    Employee_ID,
    Application_ID,
    Lead_ID,
  } = req.body;
  try {
    const client = await Clientmodel.findById(id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "client not found" });
    }
    client.Client_Name = Client_Name || client.Client_Name;
    client.Client_Mobilenumber =
      Client_Mobilenumber || client.Client_Mobilenumber;
    client.Client_Email = Client_Email || client.Client_Email;
    client.Company_Name = Company_Name || client.Company_Name;
    client.Register_Certificate_Number =
      Register_Certificate_Number || client.Register_Certificate_Number;
    client.GST = GST || client.GST;
    client.Address = Address || client.Address;
    client.Employee_ID = Employee_ID || client.Employee_ID;
    client.Application_ID = Application_ID || client.Application_ID;
    client.Lead_ID = Lead_ID || client.Lead_ID;
    await client.save();

    res.status(200).json({
      success: true,
      message: "client updated successfully",
      data: client,
    });
  } catch (error) {
    console.error("Update client Error:", error.message);
    res.status(500).json({ success: false, message: "Error updating client" });
  }
};

// // DELETE CLIENT :
const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Clientmodel.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "client not found" });
    }
    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete client Error:", error.message);
    res.status(500).json({ success: false, message: "Error deleting client" });
  }
};

export {
  getAllclient,
  createclient,
  getClientById,
  deleteClient,
  updateClient,
};
