import Rejectmodel from "../model/Rejectmodel.js";
import mongoose from "mongoose";

// CREATE
const createReject = async (req, res) => {
  try {
    const reject = new Rejectmodel(req.body);
    await reject.save();
    res.status(201).json({
      success: true,
      message: "Rejection saved successfully",
      data: reject,
    });
  } catch (error) {
    console.error("Create Reject Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to save rejection" });
  }
};

// GET ALL
const getAllRejects = async (req, res) => {
  try {
    const rejects = await Rejectmodel.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, data: rejects, count: rejects?.length });
  } catch (error) {
    console.error("Get All Rejects Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch rejections" });
  }
};

// GET BY ID
const getRejectById = async (req, res) => {
  try {
    const reject = await Rejectmodel.findById(req.params.id);
    if (!reject) {
      return res
        .status(404)
        .json({ success: false, message: "Rejection not found" });
    }
    res.status(200).json({ success: true, data: reject });
  } catch (error) {
    console.error("Get Reject By ID Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching rejection" });
  }
};

// UPDATE
const updateReject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Reject ID" });
  }

  try {
    const reject = await Rejectmodel.findById(id);
    if (!reject) {
      return res
        .status(404)
        .json({ success: false, message: "Rejection not found" });
    }

    // Manual update with nullish checks (for 0 values too)
    reject.Application_Id = req.body.Application_Id ?? reject.Application_Id;
    reject.Employee_Id = req.body.Employee_Id ?? reject.Employee_Id;
    reject.Lead_Id = req.body.Lead_Id ?? reject.Lead_Id;
    reject.reject_subject = req.body.reject_subject ?? reject.reject_subject;
    reject.reject_reason = req.body.reject_reason ?? reject.reject_reason;
    console.log("chekih", req?.body?.Lead_Stage_No);

    if (req.body.Lead_Stage_No !== undefined) {
      const stage = Number(req.body.Lead_Stage_No);
      if (![0, 1, 2, 3, 4, 5, 6].includes(stage)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Lead_Stage_No" });
      }
      reject.Lead_Stage_No = stage;
    }

    const updatedReject = await reject.save();

    res.status(200).json({
      success: true,
      message: "Rejection updated successfully",
      data: updatedReject,
    });
  } catch (error) {
    console.error("Update Reject Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error updating rejection" });
  }
};

// DELETE
const deleteReject = async (req, res) => {
  try {
    const deleted = await Rejectmodel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Rejection not found" });
    }

    res.status(200).json({
      success: true,
      message: "Rejection deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete Reject Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error deleting rejection" });
  }
};

export {
  createReject,
  getAllRejects,
  getRejectById,
  updateReject,
  deleteReject,
};
