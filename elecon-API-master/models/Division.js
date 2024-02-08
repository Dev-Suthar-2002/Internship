const mongoose = require("mongoose");



const Division = new mongoose.Schema({
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
    division_name: {
        type: String,
        default: ""
    },
    department: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }]
})



module.exports = mongoose.model("Division", Division);