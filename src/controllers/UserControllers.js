import Users from "../model/UserModel.js"; // your UserSchema file
import bcrypt from "bcrypt";

// CREATE USER
const createUser = async (req, res) => {
  try {
    const { first_Name, last_Name, Email, Mobile_Number, Password, Address } =
      req.body;

    if (
      !first_Name ||
      !last_Name ||
      !Email ||
      !Mobile_Number ||
      !Password ||
      !Address
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

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

const LoginUser = async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const userdata = await Users.findOne({ Email });
    if (!Email) {
      res.status(400).json({ message: "User Not Found", success: false });
    } else {
      console.log("user", userdata?.Password);

      const isMatch = await bcrypt.compare(Password, userdata.Password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Incorrect password", success: false });
      }
      res.status(200).json({
        message: "Login Successfull",
        data: {
          first_Name: userdata.first_Name,
          last_Name: userdata.last_Name,
          Email: userdata.Email,
          Mobile_Number: userdata.Mobile_Number,
          Address: userdata.Address,
          Password: userdata.Password,
          _id: userdata._id,
        },
        success: true,
      });
    }
  } catch (err) {
    if (err.kind === "ObjectId" && err.name === "CastError") {
      return res
        .status(400)
        .json({ message: "invalid post ID", success: false });
    }
    console.log(err?.message);
    res.status(500).json({ message: err?.message, success: false });
  }
};

export {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  LoginUser,
};
