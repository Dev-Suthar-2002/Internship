const mongoose = require("mongoose");


// ASSET

const AssetMaster = new mongoose.Schema({ 
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
    asset_name: {
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



module.exports = mongoose.model("AssetMaster", AssetMaster);