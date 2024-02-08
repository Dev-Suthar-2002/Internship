const mongoose = require("mongoose");




const Department = new mongoose.Schema({
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
    department_name: {
        type: String,
        default: ""
    },
    hod_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    sub_department: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubDepartment"
    }]
})



module.exports = mongoose.model("Department", Department);