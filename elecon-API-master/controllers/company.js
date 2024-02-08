const { default: mongoose } = require("mongoose");
const Company = require("../models/Company");



const createCompany = async(req, res) => {
    try{    

        const {company_name, divisonId} = req.body;
        const company = await Company({company_name,created_by: "admin", created_date: Date.now(), updated_by: "admin", updated_date: Date.now()});
        if(divisonId !== ""){
            company.division.push(divisonId);
        }
        await company.save();
        res.status(200).json({valid: true, msg:"company has been created", data:company});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const getSpecificCompany = async(req, res) => {
    try{
        const c_id = req.params.c_id;
        const company = await Company.findOne({_id: c_id});
        res.status(200).json({valid: true, msg:"company has been fetched", data:company});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const updateCompany = async(req, res) => {
    try{
        const c_id = req.params.c_id;
        const {company_name} = req.body;
        const company = await Company.findOne({_id: c_id});
        company.company_name = company_name;
        company.updated_date = Date.now();
        await company.save()
        res.status(200).json({valid: true, msg:"company has been updated", data:company});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


// const addDivision = async(req, res) => {
//     try{
//         const c_id = req.params.c_id;
//         const {divisionId} = req.body;
//         const company = await Company.findOne({_id: c_id});
//         company.division.push(divisionId)
//         company.updated_date = Date.now();
//         await company.save()
//         return res.status(200).json({valid: true, msg:"company has been updated", data:company});
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({valid: false, msg:"somthing went wrong"});
//     }

// }

const deleteCompany = async(req, res) => {
    try{
        const c_id = req.params.c_id;
        await Company.findOne({_id:c_id});
        return res.status(200).json({valid: true, msg:"company has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}



const getCompanies = async(req, res) => {
    try{
        const companies = await Company.find({}, {_id: 1, company_name: 1});
        res.status(200).json({valid: true, msg: "yes", data: companies});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }

}




const getDivisionByCompany = async(req, res) => {
    console.log("here in divison company")
    try{    
        const c_id = req.params.c_id;
        const divisions = await Company.findOne({_id: c_id}, {_id: 0, division: 1}).populate("division")

        res.status(200).json({valid: true, msg: "yes", data: divisions});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }

}



const getCompaniesWithDivisionAndDept = async(req, res) => {
    try{
        const result = await Company.find({}).populate({
            path:"division",
            populate:{
                path:"department"
            }
        }) 
        res.status(200).json({valid: true, msg: "yes", data: result});
    }
    catch(err){
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}






module.exports = {
    createCompany,
    getCompanies,
    deleteCompany,
    updateCompany,
    getSpecificCompany,
    getDivisionByCompany,
    getCompaniesWithDivisionAndDept
}