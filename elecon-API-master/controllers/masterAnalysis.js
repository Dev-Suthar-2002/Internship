const { default: mongoose } = require("mongoose");
const LocationMaster = require("../models/LocationMaster");
const Company = require("../models/Company");
const Division = require("../models/Division");
const Department = require("../models/Department");
const SubDepartment = require("../models/SubDepartment");
const VendorMaster = require("../models/VendorMaster");
const HotelMaster = require("../models/HotelMaster");
const AssetMaster = require("../models/AssetMaster");
const DriverMaster = require("../models/DriverMaster");
const MakeAndModelMaster = require("../models/MakeAndModelMaster");
const VehicleMaster = require("../models/VehicleMaster");
const WorkTypeMaster = require("../models/WorkTypeMaster");







const getCountMaster = async(req, res) => {
    try{
        const companies = await Company.find({});
        const divisions = await Division.find({});
        const departments = await Department.find({});
        const subDepartments = await SubDepartment.find({})
        const vendors = await VendorMaster.find({});
        const hotels = await HotelMaster.find({});
        const items = await AssetMaster.find({})
        const drivers = await DriverMaster.find({})
        const models = await MakeAndModelMaster.find({})
        const vehicles = await VehicleMaster.find({})
        const locations = await LocationMaster.find({})
        const workTypes = await WorkTypeMaster.find({})

        const result = [
            {title: "Companies", total: companies.length},
            {title: "Divisions", total: divisions.length},
            {title: "Departments", total: departments.length},
            {title: "Sub Departments", total: subDepartments.length},
            {title: "Vendors", total: vendors.length},
            {title: "Hotels", total: hotels.length},
            {title: "Assets", total: items.length},
            {title: "Drivers", total: drivers.length},
            {title: "Make And Models", total: models.length},
            {title: "Vehicles", total: vehicles.length},
            {title: "Locations", total: locations.length},
            {title: "Work Types", total: workTypes.length},
        ]

        return res.status(200).json({valid: true, msg:"master count has been done", data: result});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}





module.exports = {
    getCountMaster

}