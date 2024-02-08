const { default: mongoose } = require("mongoose");
const LocationMaster = require("../models/LocationMaster");







const createLocation = async(req, res) => {
    try{    
        const {location_name, company, division, department} = req.body;
        const location = await  LocationMaster.create({location_name, company, division, department, created_by: "admin", created_date: Date.now(), updated_by:"admin", updated_date: Date.now()});
        return res.status(200).json({valid: true, msg:"location has been created", data:location});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getLocations = async(req, res) => {
    try{
        // const locations = await LocationMaster.find({});
        const locations = await LocationMaster.aggregate([
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
                    location_name: 1,
                    company: "$company.company_name", // Extract company name as a string
                    division: "$division.division_name",
                    department: "$department.department_name"
                }
            }
        ])
        return res.status(200).json({valid: true, msg:"locations has been fetched", data:locations, count: locations.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificLocation = async(req, res) => {
    try{
        const l_id = req.params.l_id;
        const location = await LocationMaster.findOne({_id: l_id}).populate("company", "company_name").populate("division", "division_name").populate("department", "department_name");
        return res.status(200).json({valid: true, msg:"location has been fetched", data:location});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const editLocation = async(req, res) => {
    try{
        const l_id = req.params.l_id;

        const {location_name, company, division, department} = req.body;
        
        const location = await LocationMaster.findOne({_id: l_id});
        location.location_name = location_name 
        location.company = company 
        location.division = division 
        location.department = department 
        location.updated_date = Date.now();
        await location.save();
        return res.status(200).json({valid: true, msg:"location has been updated", data:location});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteLocation = async(req, res) => {
    try{
        const l_id = req.params.l_id;
        await LocationMaster.findByIdAndDelete({_id: l_id});
        return res.status(200).json({valid: true, msg:"location has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createLocation,
    getLocations,
    getSpecificLocation,
    editLocation,
    deleteLocation

}