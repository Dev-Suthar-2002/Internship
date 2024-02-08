const mongoose = require("mongoose");



const HotelMaster = new mongoose.Schema({
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
    address1:{
        type: String,
        default: ""
    },
    address2:{
        type: String,
        default: ""
    },
    city:{
        type: String,
        default: ""
    },
    state:{
        type: String,
        default: ""
    },
    pincode:{
        type: String,
        default: ""
    },
    district:{
        type: String,
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



module.exports = mongoose.model("HotelMaster", HotelMaster);