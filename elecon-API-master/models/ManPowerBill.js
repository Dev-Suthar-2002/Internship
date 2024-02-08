const mongoose = require("mongoose");



const ManPowerBill = new mongoose.Schema({
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
    work_type:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorktypeMaster"
    },
    contractor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "VendorMaster"
    },
    month_year:{
        type: String,
        default: ""
    },
    location:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LocationMaster"
    },
    no_of_employee:{
        type: Number,
        default: ""
    },
    bill_no:{
        type: String,
        default: ""
    },
    bill_date:{
        type: Date,
        default: ""
    },
    bill_amount:{
        type:String,
        default: ""
    },
    sgst:{
        type: Number,
        default: 0
    },
    cgst:{
        type: Number,
        default: 0
    },
    igst:{
        type: Number,
        default: 0
    },
    total_amount:{
        type: Number,
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



module.exports = mongoose.model("ManPowerBill", ManPowerBill);


