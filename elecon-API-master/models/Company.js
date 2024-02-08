const mongoose = require("mongoose");



const Company = new mongoose.Schema({
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
    company_name: {
        type: String,
        default: ""
    },
    division: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Division"
    }]
})



module.exports = mongoose.model("Company", Company);