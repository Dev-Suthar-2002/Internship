const { default: mongoose } = require("mongoose");
const MakeAndModelMaster = require("../models/MakeAndModelMaster");








const createMAndM = async(req, res) => {
    try{    
        const {make_and_model_name, company, division, department} = req.body;
        const m_m = await  MakeAndModelMaster.create({make_and_model_name, company, division, department, created_by: "admin", created_date: Date.now(), updated_by:"admin", updated_date: Date.now()});
        return res.status(200).json({valid: true, msg:"make and model has been created", data:m_m});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getMAndMs = async(req, res) => {
    try{
        // const m_ms = await MakeAndModelMaster.find({});
        const m_ms = await MakeAndModelMaster.aggregate([
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
                    make_and_model_name: 1,
                    company: "$company.company_name", // Extract company name as a string
                    division: "$division.division_name",
                    department: "$department.department_name"
                }
            }
        ])
        return res.status(200).json({valid: true, msg:"make and models has been fetched", data:m_ms, count: m_ms.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificMAndM = async(req, res) => {
    try{
        const m_id = req.params.m_id;
        const m_m = await MakeAndModelMaster.findOne({_id: m_id}).populate("company", "company_name").populate("division", "division_name").populate("department", "department_name");
        return res.status(200).json({valid: true, msg:"make and model has been fetched", data:m_m});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const editMAndM = async(req, res) => {
    try{
        const m_id = req.params.m_id;

        const {make_and_model_name, company, division, department} = req.body;
        const m_m = await MakeAndModelMaster.findOne({_id: m_id});
        m_m.make_and_model_name = make_and_model_name 
        m_m.company = company 
        m_m.division = division 
        m_m.department = department 
        m_m.updated_date = Date.now();
        await m_m.save();
        return res.status(200).json({valid: true, msg:"make and model has been updated", data:m_m});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteMAndM = async(req, res) => {
    try{
        const m_id = req.params.m_id;
        await MakeAndModelMaster.findByIdAndDelete({_id: m_id});
        return res.status(200).json({valid: true, msg:"make and model has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createMAndM,
    getMAndMs,
    getSpecificMAndM,
    editMAndM,
    deleteMAndM

}