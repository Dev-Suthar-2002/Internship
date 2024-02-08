const mongoose = require("mongoose");



const Accessories = new mongoose.Schema({
    acc_name: {
        type: String,
        default: ""
    },
    acc_type: {
        type: String,
        default:""
    },
    model_no: {
        type: String,
        default: ""
    },
    is_returnable: {
        type: Boolean,
        default: false
    },
})



module.exports = mongoose.model("Accessories", Accessories);