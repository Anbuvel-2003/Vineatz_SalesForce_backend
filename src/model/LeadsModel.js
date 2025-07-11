import mongoose from "mongoose";
const leadsschema = new mongoose.Schema({
    Application_Id: {
        type: String,
        required: true,
    },
    Application_Name: {
        type: String,
        required: true,
    },
    Client_name: {
        type: String,
        required: true,
    },
    Client_Email: {
        type: String,
        required: true,
    },
    Client_Mobilenumber: {
        type: number,
        required: true,
    },
    Client_Company_Name: {
        type: String,
        required: true,
    },
    Client_Address: {
        type: String,
    },
    Client_Register_certificate_No: {
        type: String,
    },
    Client_GST: {
        type: String
    },
    Lead_Stage: {
        type: Array
    },
    Lead_Stage_No: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6],
        required: true
    },
    Employee_Id: {
        type: String
    },
    reject_reason: {
        type: String
    },
    reject_subjects: {
        type: String
    },
    reject_date: {
        type: Date
    },
    reject_stage_no: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6]
    }

}, {
    timestamps: true,
});

const leads = mongoose.model("leads", leadsschema);
export default leads;
