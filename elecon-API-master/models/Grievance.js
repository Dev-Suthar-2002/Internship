const mongoose = require("mongoose");



const Grievance = new mongoose.Schema({
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
    title: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        default:""
    },
    grievance_type: {
        type: String,
        default: ""
    },
    by_whom_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    grievance_date: {
        type: Date,
        default: ""
    },
    status:{
        type: String,
        default: "pending"
    },
    is_escalated:{
        type:Boolean,
        default: false
    },
    is_resend:{
        type:Boolean,
        default: false
    },
    approval_remarks: {
        type: String,
        default: ""
    },
    closure_remarks:{
        type: String,
        default: ""
    },

})



module.exports = mongoose.model("Grievance", Grievance);