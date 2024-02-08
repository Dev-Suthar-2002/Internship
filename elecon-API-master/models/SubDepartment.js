const mongoose = require("mongoose");



const SubDepartment = new mongoose.Schema({
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
    sub_department_name: {
        type: String,
        default: ""
    },
    gl_code:{
        type:String,
        default:""
    }
})



module.exports = mongoose.model("SubDepartment", SubDepartment);