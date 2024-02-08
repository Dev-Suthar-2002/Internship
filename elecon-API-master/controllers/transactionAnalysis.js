const { default: mongoose } = require("mongoose");
const HotelBill = require("../models/HotelBill");
const SimCardBill = require("../models/SimCardBill");
const AssetBill = require("../models/AssetBill");
const makeAndModelBill = require("../models/makeAndModelBill");
const vehicleBill = require("../models/vehicleBill");
const ManPowerBill = require("../models/ManPowerBill");








const getCountTransactions = async(req, res) => {
    try{
        const hotelBills = await HotelBill.find({});
        const simCardBills = await SimCardBill.find({});
        const assetBills = await AssetBill.find({});
        const staffVehicleBills = await makeAndModelBill.find({})
        const commercialVehicleBills = await vehicleBill.find({});
        const manPowerBills = await ManPowerBill.find({});
        

        const result = [
            {title: "Hotel Booking", total: hotelBills.length},
            {title: "Sim Card Allocation", total: simCardBills.length},
            {title: "Asset Transactions", total: assetBills.length},
            {title: "Staff Vehicle Bills", total: staffVehicleBills.length},
            {title: "Commercial Vehicle Bills", total: commercialVehicleBills.length},
            {title: "Man Power Bills", total: manPowerBills.length},
           
        ]

        return res.status(200).json({valid: true, msg:"transaction count has been done", data: result});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}





module.exports = {
    getCountTransactions

}