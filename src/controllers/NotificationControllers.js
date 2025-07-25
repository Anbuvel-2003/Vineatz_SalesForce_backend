import { application } from "express";
import Notificationmodel from "../model/Notificationmodel.js";

// GET EMPLOYEE:
const getAllnotifications = async (req, res) => {
  try {
    const notification = await Notificationmodel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error("Get All Notification Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notification" });
  }
};

// // UPDATE  EMPLOYEE:
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { is_read } = req.body;
  try {
    const notification = await Notificationmodel.findById(id);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "notification not found" });
    }
    notification.is_read = is_read || notification.is_read;
    await notification.save();
    res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Update Notification Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error updating Notification" });
  }
};

// // DELETE EMPLOYEE :
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notificationmodel.findByIdAndDelete(id);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "notification not found" });
    }
    res.status(200).json({
      success: true,
      message: "notification deleted successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Delete notification Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error deleting notification" });
  }
};

export {
  getAllnotifications,
  deleteEmployee,
  updateEmployee,
};
