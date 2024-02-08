const { default: mongoose } = require("mongoose");
const Division = require("../models/Division");
const Company = require("../models/Company");




const createDivision = async(req, res) => {
    try{    

        const {division_name, departmentId} = req.body;
        const division = await Division({division_name, created_by:"admin", created_date: Date.now(), updated_by: "admin", updated_date: Date.now()});
        if(departmentId !== ""){
            division.department.push(departmentId);
        }
        await division.save();

        const {c_id} = req.body;
        const company = await Company.findOne({_id: c_id});
        company.division.push(division._id);
        await company.save();
        res.status(200).json({valid: true, msg:"division has been created", data:division});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const getSpecificDivision = async(req, res) => {
    try{
        const d_id = req.params.d_id;
        const division = await Division.findOne({_id: d_id});
        res.status(200).json({valid: true, msg: "division has been fetched", data: division});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }

}

const updateDivision = async(req, res) => {
    try{
        const d_id = req.params.d_id;
        const {division_name} = req.body;
        const division = await Division.findOne({_id: d_id});
        division.division_name = division_name;
        division.updated_date = Date.now();
        await division.save();
        res.status(200).json({valid: true, msg: "division has been updated", data: division});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }

}

const getAllDivision = async(req, res) => {
    try{

        const divisions = await Division.find({}, {_id: 1, division_name: 1});

        // const companies = await Company.find({}).populate({
        //     path: "division",
        //     model: "Division",
        //     populate:{
        //         path:"department",
        //         model:"Department",
        //         populate: {
        //             path: "sub_department",
        //             model: "SubDepartment"
        //         }
        //     }
        // });

        // const result = [];
        // companies.forEach((company) => {
        //     company.division.forEach((division) => {
        //         const t = {};
        //         t['division'] = division.division_name;
        //         t['company'] = company.company_name;
        //         result.push(t);
        //     })
        // })
        res.status(200).json({valid: true, msg:"division has been fetched", data:divisions, count: divisions.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const getDepartmentByDivision = async(req, res) => {
    try{    
        const d_id = req.params.d_id;
        const departments = await Division.findOne({_id: d_id}, {_id: 0, department: 1}).populate("department")

        res.status(200).json({valid: true, msg: "fetched departments", data: departments, count: departments.department.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}

const deleteDivision = async(req, res) => {
    try{
        const d_id = req.params.d_id;
        await Division.findByIdAndDelete({_id:d_id});
        res.status(200).json({valid: true, msg: "division has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


module.exports = {
    createDivision,
    getAllDivision,
    getSpecificDivision,
    updateDivision,
    // addDepartment,
    deleteDivision,
    getDepartmentByDivision
}