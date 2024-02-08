const mongoose = require("mongoose");



const Notification = new mongoose.Schema({

    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    title: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        default: ""
    },
    is_read:{
        type: Boolean,
        default: false
    },
    is_clear:{
        type: Boolean,
        default: false
    },
    created_date: {
        type: Date,
        default: ""
    }
})



module.exports = mongoose.model("Notification", Notification);