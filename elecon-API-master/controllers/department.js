const { default: mongoose } = require("mongoose");
const Department = require("../models/Department");
const Division = require("../models/Division");
const Company = require("../models/Company");
const Employee = require("../models/Employee");





const createDepartment = async(req, res) => {
    try{    

        const {department_name, subdepartmentId} = req.body;
        const {hod_id} = req.body;
        const {division_id} = req.body;
        const department = await Department({department_name, hod_id, created_by: "admin", created_date: Date.now(), updated_by: "admin", updated_date: Date.now()});
        if(subdepartmentId !== ""){
            department.sub_department.push(subdepartmentId);
        }
        await department.save();

        const division = await Division.findOne({_id: division_id});
        division.department.push(department._id);
        division.updated_date = Date.now();
        await division.save();

        const emp = await Employee.findOne({_id:hod_id});
        emp.department = department._id
        await emp.save();
        res.status(200).json({valid: true, msg:"department has been created", data:department});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const getSpecificDepartment = async(req, res) => {
    try{
        const d_id = req.params.d_id;
        const department = await Department.findOne({_id: d_id});
        res.status(200).json({valid: true, msg:"department has been fetched", data:department});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}

const updateDepartment = async(req, res) => {
    try{
        const d_id = req.params.d_id;
        const {department_name} = req.body;
        const {hod_id} = req.body;
        const {division_id} = req.body;

        // const old_divsion_id;
        const old_division = await Division.findOne({department: {$in: [d_id]}});
        old_division.department = old_division.department.filter((el) => {
            if(el.toString() === d_id){
                return false
            }
            else{
                return true;
            }

        })
        console.log("old divsion");
        console.log(old_division);
        await old_division.save();

        const division = await Division.findOne({_id:  division_id});
        division.department.push(d_id);
        await division.save();

        console.log("new division");
        console.log(division);



        const department = await Department.findOne({_id: d_id});
        department.department_name = department_name;
        department.hod_id = hod_id;
        department.updated_date = Date.now();
        await department.save();
        res.status(200).json({valid: true, msg:"department has been fetched", data:department});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}

const getAllDepartment = async(req, res) => {
    try{
        const companies = await Company.find({}).populate({
            path: "division",
            model: "Division",
            populate:{
                path:"department",
                model:"Department",
                populate: {
                    path: "sub_department",
                    model: "SubDepartment"
                }
            }
        }).populate("hod_id", "emp_name");

        const result = [];
        companies.forEach((company) => {
            company.division.forEach((division) => {

                division.department.forEach((department) => {
                    const t = {};
                    t['department'] = department.department_name;
                    t['division'] = division.division_name;
                    t['company'] = company.company_name;
                    t['_id'] = department._id;
                    t['hod_name'] = department.hod_id.emp_name;
                    
                    result.push(t);
                })

            })

        })
        res.status(200).json({valid: true, msg:"department has been fetched", data:result, count: result.length});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const deleteDepartment = async(req, res) => {
    try{
        const d_id = req.params.d_id;
        await Department.findByIdAndDelete({_id: d_id});
        res.status(200).json({valid: true, msg:"department has been fetched"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }

}




module.exports = {
    createDepartment,
    getSpecificDepartment,
    updateDepartment,
    deleteDepartment,
    getAllDepartment
}