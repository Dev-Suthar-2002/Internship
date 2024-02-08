const mongoose = require("mongoose");



const ModelBill = new mongoose.Schema({
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
    make_model:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MakeAndModelMaster"
    },
    employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    vehicle_no:{
        type: String,
        default: ""
    },
    purchase_date:{
        type: Date,
        default: ""
    },
    issue_date:{
        type: Date,
        default: ""
    },
    received_date:{
        type: Date,
        default: ""
    },
    engine_no:{
        type: String,
        default: ""
    },
    asset_no:{
        type:String,
        default: ""
    },
    chassis_no:{
        type: String,
        default: ""
    },
    remarks:{
        type: String,
        default: ""
    },
    condition:{
        type: String,
        default: ""
    },
    usage:{
        type: String,
        default: ""
    },

    // sales details 

    sale_date:{
        type: Date,
        default: ""
    },
    sale_value:{
        type: Number,
        default: ""
    },
    wdv_amount:{
        type: Number,
        default: ""
    },
    sale_to:{
        type: String,
        default: ""
    },
    approved_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },

    // payment details 
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
    rc_book_details:{ // will be an image link 
        type:String,
        default: ""
    },
    insurance_details:{// will be an image link 
        type:String,
        default: ""
    },
    puc_details:{// will be an image link 
        type:String,
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



module.exports = mongoose.model("ModelBill", ModelBill);


