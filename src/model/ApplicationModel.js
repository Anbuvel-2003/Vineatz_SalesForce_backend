import mongoose from "mongoose";
const ApplicationSchema = new mongoose.Schema({
    Application_Name: {
        type: String,
        required: true,
    },
    Application_Description: {
        type: String,
        required: true,
    },
    Application_url: {
        type: String
    },
    Application_lunch_date: {
        type: String
    },
    Application_ID: {
        type: String,
        unique: true,
    },
    
}, {
    timestamps: true,
});

const Applicationmodel = mongoose.model("Application", ApplicationSchema);
export default Applicationmodel;
