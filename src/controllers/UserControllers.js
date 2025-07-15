import Users from "../model/UserModel.js"; // your UserSchema file
import bcrypt from "bcrypt";

// CREATE USER
const createUser = async (req, res) => {
  try {
    const { Email, Mobile_Number, Password } = req.body;

    const existing = await Users.findOne({ Email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    const newUser = new Users(req.body);
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Create User Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Get All Users Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Get User Error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.Password) {
      // Hash new password if provided
      const salt = await bcrypt.genSalt(10);
      req.body.Password = await bcrypt.hash(req.body.Password, salt);
    }

    const updatedUser = await Users.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error.message);
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const deleted = await Users.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};

export { getAllUsers, getUserById, updateUser, deleteUser, createUser };
