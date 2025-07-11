import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    first_Name: {
        type: String,
        required: true,
    },
    last_Name: {
        type: String,
        required: true,
    },
    Mobile_Number: {
        type: number,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    }

}, {
    timestamps: true,
});

const Users = mongoose.model("Users", UserSchema);
export default Users;
