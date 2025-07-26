import Welcomemail from "../emailtemplates/welcomemail.js";
import Users from "../model/UserModel.js"; // your UserSchema file
import bcrypt from "bcrypt";
import { sendMail } from "../Utils/EmailServer/emailsend.js";
import { createToken, verifyToken } from "../config/jwtConfig.js";
import EmailSendOtp from "../emailtemplates/emailsendotp.js";
const otpStore = new Map();

// CREATE USER
const createUser = async (req, res) => {
  try {
    const { first_Name, last_Name, Email, Mobile_Number, Password, Address } =
      req.body;
    // ✅ Validate required fields
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
    // ✅ Check if email already exists
    const existingusers = await Users.findOne({
      Email,
    });
    if (existingusers) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    // ✅ Generate auto USERS_ID like AMD001
    const lastUser = await Users.findOne().sort({ createdAt: -1 });
    let nextId = 1;
    if (lastUser && lastUser.User_Id) {
      const lastIdNum = parseInt(lastUser.User_Id.replace("EMP", ""));
      nextId = lastIdNum + 1;
    }
    const User_Id = `AMD${nextId.toString().padStart(3, "0")}`;
    // ✅ Create and save new user
    const newuser = new Users({
      User_Id,
      first_Name,
      last_Name,
      Email,
      Mobile_Number,
      Password,
      Address,
    });
    await newuser.save();
    // ✅ Send welcome email with credentials
    const html = Welcomemail(Email, Password);
    const subject = `👋 Welcome to Vineatz Salesforce, ${first_Name}!`;
    const result = await sendMail({ to: Email, subject, html });
    result.success
      ? console.log("Email sent successfully")
      : console.error("Failed to send email:", result.error);
    if (result.success) {
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newuser,
      });
    } else {
      console.error("Failed to send email:", result.error);
      // Optionally delete the user or mark email failed
      return res.status(500).json({
        success: false,
        message: "User created, but failed to send welcome email",
      });
    }
  } catch (error) {
    console.error("Create User Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Get query params or default to page 1 and limit 10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate how many records to skip
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const total = await Users.countDocuments();

    // Fetch paginated data
    const users = await Users.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
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

const SendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // ✅ Check if email exists in the Users collection
    const existingUser = await Users.findOne({ Email: email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Email not found", success: false });
    }
    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = await createToken(email, otp);
    console.log("Generated Token:", token);
    console.log("OTP:", otp);
    const html = EmailSendOtp(email, otp);
    const subject = "🔐 Your OTP to Change Password - Vineatz Salesforce";
    const result = await sendMail({ to: email, subject, html });
    result.success
      ? console.log("Email sent successfully")
      : console.error("Failed to send email:", result.error);
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
    return res.status(200).json({
      message: "OTP sent successfully",
      token,
      success: true,
    });
  } catch (error) {
    console.error("Error in send-otp:", error);
    return res
      .status(500)
      .json({ message: "OTP sending failed", success: false });
  }
};
const VerifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const data = await verifyToken(req.headers.authorization.split(" ")[1]);
    console.log(data);
    if (data !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }
    return res
      .status(200)
      .json({ message: "OTP verified successfully", success: true });
  } catch (error) {
    console.error("Error in verify-otp:", error);
    return res
      .status(500)
      .json({ message: "OTP verification failed", success: false });
  }
};
const Changepassword = async (req, res) => {
  try {
    const { oldpassword, newpassword, email } = req.body;

    const user = await Users.findOne({ Email: email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(oldpassword, user.Password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect password", success: false });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    await Users.updateOne({ Email: email }, { Password: hashedPassword });

    return res
      .status(200)
      .json({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.error("Error in change-password:", error.message);
    return res
      .status(500)
      .json({ message: "Password change failed", success: false });
  }
};

export {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  LoginUser,
  SendOtp,
  VerifyOtp,
  Changepassword,
};
