const mongoose = require("mongoose");



const AssetBill = new mongoose.Schema({
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
    item:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "AssetMaster"
    },
    vendor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "VendorMaster"
    },
    issued_to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    purchase_date:{
        type: Date,
        default: ""
    },
    issue_date:{
        type: Date,
        default: ""
    },
    condition:{
        type: String,
        default: ""
    },
    sale_date:{
        type: Date,
        default: ""
    },
    wdv_amount:{
        type: Number,
        default: ""
    },
    sale_value:{
        type: Number,
        default: ""
    },
    approved_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    cjo_no:{
        type: String,
        default: ""
    },
    payment_mode:{
        type: String,
        default: ""
    },
    payment_from_bank:{
        type: String,
        default: ""
    },
    cheque_date:{
        type: Date,
        default: ""
    },
    cheque_no:{
        type: String,
        default: ""
    },
    cheque_to:{
        type: String,
        default: ""
    },
    transaction_date:{
        type: Date,
        default: ""
    },
    transaction_no:{
        type: String,
        default: ""
    },
    transaction_status:{
        type: String,
        default: ""
    },
    payment_to_bank:{
        type: String,
        default: ""
    },
    amount:{
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



module.exports = mongoose.model("AssetBill", AssetBill);