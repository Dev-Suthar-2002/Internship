const mongoose = require("mongoose");



const DriverMaster = new mongoose.Schema({
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
    contractor:{
        type: String,
        default: ""
    },
    employee_id:{
        type: String,
        default: ""
    },
    first_name:{
        type: String,
        default: ""
    },
    middle_name:{
        type: String,
        default: ""
    },
    last_name:{
        type: String,
        default: ""
    },
    address:{
        type: String,
        default: ""
    },
    city:{
        type: String,
        default: ""
    },
    email_id:{
        type: String,
        default: ""
    },
    pincode:{
        type: String,
        default: ""
    },
    state:{
        type: String,
        default: ""
    },
    phone_no:{
        type: String,
        default: ""
    },
    emergancy_contact_person:{
        type: String,
        default: ""
    },
    emergancy_contact_no:{
        type: String,
        default: ""
    },
    birth_date:{
        type: Date,
        default: ""
    },
    join_date:{
        type: Date,
        default: ""
    },
    license_no:{
        type: String,
        default: ""
    },
    license_exp_date:{
        type: Date,
        default: ""
    },
    releave_date:{
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



module.exports = mongoose.model("DriverMaster", DriverMaster);