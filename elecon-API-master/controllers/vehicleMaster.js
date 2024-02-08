const { default: mongoose } = require("mongoose");
const VehicleMaster = require("../models/VehicleMaster");








const createVehicle = async(req, res) => {
    try{    
        const {vehicle_name, company, division, department} = req.body;
        const vehicle = await  VehicleMaster.create({vehicle_name, company, division, department, created_by: "admin", created_date: Date.now(), updated_by:"admin", updated_date: Date.now()});
        return res.status(200).json({valid: true, msg:"vehicle has been created", data:vehicle});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getVehicles = async(req, res) => {
    try{
        // const vehicles = await VehicleMaster.find({});
        const vehicles = await VehicleMaster.aggregate([
            {
                $lookup: {
                    from: "companies", // Assuming the name of the company collection is "companies"
                    localField: "company",
                    foreignField: "_id",
                    as: "company"
                }
            },
            {
                $unwind: "$company" // Convert the "company" array to an object
            },
            {
                $lookup: {
                    from: "divisions", // Assuming the name of the division collection is "divisions"
                    localField: "division",
                    foreignField: "_id",
                    as: "division"
                }
            },
            {
                $unwind: "$division" // Convert the "division" array to an object
            },
            {
                $lookup: {
                    from: "departments", // Assuming the name of the department collection is "departments"
                    localField: "department",
                    foreignField: "_id",
                    as: "department"
                }
            },
            {
                $unwind: "$department" // Convert the "department" array to an object
            },
            {
                $project: {
                    _id: 1,
                    created_date: 1,
                    created_by: 1,
                    updated_date: 1,
                    updated_by: 1,
                    deleted_date: 1,
                    deleted_by: 1,
                    vehicle_name: 1,
                    company: "$company.company_name", // Extract company name as a string
                    division: "$division.division_name",
                    department: "$department.department_name"
                }
            }
        ])
        return res.status(200).json({valid: true, msg:"vehicles has been fetched", data:vehicles, count: vehicles.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificVehicle = async(req, res) => {
    try{
        const v_id = req.params.v_id;
        const vehicle = await VehicleMaster.findOne({_id: v_id}).populate("company", "company_name").populate("division", "division_name").populate("department", "department_name");
        return res.status(200).json({valid: true, msg:"vehicle has been fetched", data:vehicle});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const editVehicle = async(req, res) => {
    try{
        const v_id = req.params.v_id;

        const {vehicle_name, company, division, department} = req.body;
        const vehicle = await VehicleMaster.findOne({_id: v_id});
        vehicle.vehicle_name = vehicle_name 
        vehicle.company = company 
        vehicle.division = division 
        vehicle.department = department 
        vehicle.updated_date = Date.now();
        await vehicle.save();
        return res.status(200).json({valid: true, msg:"vehicle has been updated", data:vehicle});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteVehicle = async(req, res) => {
    try{
        const v_id = req.params.v_id;
        await VehicleMaster.findByIdAndDelete({_id: v_id});
        return res.status(200).json({valid: true, msg:"vehicle has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createVehicle,
    getVehicles,
    getSpecificVehicle,
    editVehicle,
    deleteVehicle

}