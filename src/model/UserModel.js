import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    first_Name: {
      type: String,
      required: true,
    },
    last_Name: {
      type: String,
      required: true,
    },
    Mobile_Number: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    Address: {
      type: String,
      required: true,
    },
    IsAdmin: {
      type: Boolean,
      default: false,
    },
    Password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
        },
        message:
          "Password must include uppercase, lowercase, number, and special character",
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.Password);
};

const Users = mongoose.model("Users", UserSchema);
export default Users;
