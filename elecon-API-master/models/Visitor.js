const mongoose = require("mongoose");



const Visitor = new mongoose.Schema({
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
    name:{
        type: String,
        default: ""
    },
    phone_no:{
        type: String,
        default: ""
    },
    email_id:{
        type: String,
        default: ""
    },
    gender:{
        type: String,
        default: ""
    },
    is_professional:{
        type: Boolean,
        default: true
    },
    designation:{
        type: String,
        default: ""
    },
    guest_company:{
        type: String,
        default: ""
    },
    id_proof:{
        type: String,
        default: ""
    },
    id_number:{
        type: String,
        default: ""
    },
    place:{
        type: String,
        default: ""
    },
    visit_type:{
        type: String,
        default: ""
    },
    from_date:{
        type: Date,
        default: ""
    },
    to_date:{
        type: Date,
        default: ""
    },
    purpose:{
        type: String,
        default: ""
    },
    area_of_visit:{
        type: String,
        default: ""
    },
    entry_gate:{
        type: String,
        default: ""
    },
    image:{
        type: String,
        default: ""
    },
    appointment_half: {
        type: String,
        default: ""
    },
    accessories_id:[],
    to_whom_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    in_time: {
        type: Date,
        default: ""
    },
    out_time: {
        type: Date,
        default: ""
    }
})



module.exports = mongoose.model("Visitor", Visitor);