import mongoose from "mongoose";
const EmployeeSchema = new mongoose.Schema({
    Employee_Id: {
        type: String,
        required: true,
    },
    Employee_Name: {
        type: String,
        required: true,
    },
    Employee_Email: {
        type: String,
        required: true,
    },
    Employee_Mobilenumber: {
        type: String,
        required: true,
    },
    Employee_Alternative_Mobilenumber: {
        type: String,
        required: true,
    },
    Employee_Address: {
        type: String,
        required: true,
    },
    Employee_Bike_Number: {
        type: String,
        required: true,
    },
    Employee_Driving_License_Number: {
        type: String,
        required: true,
    },

}, {
    timestamps: true,
});

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;
