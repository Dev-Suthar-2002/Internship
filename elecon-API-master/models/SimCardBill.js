const mongoose = require("mongoose");



const SimCardBill = new mongoose.Schema({
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
    employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    service_provider:{
        type: String,
        default: ""
    },
    requisition_date:{
        type: Date,
        default: ""
    },
    tarriff_plan_no:{
        type: String,
        default: ""
    },
    mobile_no:{
        type: String,
        default: ""
    },
    data_card_no:{
        type: String,
        default: ""
    },
    issue_date_simcard:{
        type: Date,
        default: ""
    },
    issue_date_datacard:{
        type: Date,
        default: ""
    },
    amount:{
        type: Number,
        default: ""
    },
    approved_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
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



module.exports = mongoose.model("SimCardBill", SimCardBill);