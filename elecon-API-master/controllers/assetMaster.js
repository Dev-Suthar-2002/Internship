const { default: mongoose } = require("mongoose");
const AssetMaster = require("../models/AssetMaster");







const createAsset = async(req, res) => {
    try{    
        const {asset_name, company, division, department} = req.body;
        const asset = await  AssetMaster.create({asset_name, created_by: "admin", company, division, department,created_date: Date.now(), updated_by:"admin", updated_date: Date.now()});
        return res.status(200).json({valid: true, msg:"asset has been created", data:asset});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getAssets = async(req, res) => {
    try{
        // const assets = await AssetMaster.find({}).populate("company", "company_name").populate("division", "division_name").populate("department", "department_name");
        const assets = await AssetMaster.aggregate([
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
                    asset_name: 1,
                    company: "$company.company_name", // Extract company name as a string
                    division: "$division.division_name",
                    department: "$department.department_name"
                }
            }
        ])
        return res.status(200).json({valid: true, msg:"assets has been fetched", data:assets, count: assets.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificAsset = async(req, res) => {
    try{
        const a_id = req.params.a_id;
        const asset = await AssetMaster.findOne({_id: a_id}).populate("company", "company_name").populate("division", "division_name").populate("department", "department_name");
        return res.status(200).json({valid: true, msg:"asset has been fetched", data:asset});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const editAsset = async(req, res) => {
    try{
        const a_id = req.params.a_id;

        const {asset_name, company, division, department} = req.body;
        const asset = await AssetMaster.findOne({_id: a_id});
        asset.asset_name = asset_name 
        asset.company = company 
        asset.division = division 
        asset.department = department 
        asset.updated_date = Date.now();
        await asset.save();
        return res.status(200).json({valid: true, msg:"asset has been updated", data:asset});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteAsset = async(req, res) => {
    try{
        const a_id = req.params.a_id;
        await AssetMaster.findByIdAndDelete({_id: a_id});
        return res.status(200).json({valid: true, msg:"asset has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createAsset,
    getAssets,
    getSpecificAsset,
    editAsset,
    deleteAsset

}