const mongoose = require("mongoose");



const Requisition = new mongoose.Schema({
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
        default: "",
    },
    activity:{
        type:String,
        default: ""
    },
    employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    problem_desc:{
        type:String,
        default: "",
    },
    requisition_date:{
        type:Date,
        default: ""
    },
    // attachment:{
    //     type:String,
    //     default:""
    // },

    status:{
        type: String,
        default: "pending"
    },
    approval_remarks: {
        type: String,
        default: ""
    },
    closure_remarks:{
        type: String,
        default: ""
    },
    is_escalated:{
        type: Boolean,
        default: false
    },
    is_resend: {
        type: Boolean,
        default: false
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



module.exports = mongoose.model("Requisition", Requisition);