const mongoose = require("mongoose");



const HotelBill = new mongoose.Schema({
    created_date: {
        type: Date,
        default: new Date()
    },
    created_by: {
        type: String,
        default: "",
    },
    updated_date: {
        type: Date,
        default: new Date()
    },
    updated_by: {
        type: String,
        default: "",
    },
    deleted_date: {
        type: Date,
        default: ""
    },
    deleted_by: {
        type: String,
        default: "",
    },
    hotel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "HotelMaster"
    },
    booked_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    guest_name:{
        type: String,
        default: ""
    },
    purpose:{
        type: String,
        default: ""
    },
    requisition_date:{
        type: Date,
        default: ""
    },
    stay_from_date:{
        type: String,
        default: ""
    },
    stay_to_date:{
        type: String,
        default: ""
    },
    bill_no:{
        type: String,
        default: ""
    },
    total_days:{
        type: Number,
        default: ""
    },
    amount:{
        type: Number,
        default: ""
    },
    billing_date:{
        type: Date,
        default: ""
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    division: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Division"
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }
    
})



module.exports = mongoose.model("HotelBill", HotelBill);