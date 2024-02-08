const { default: mongoose } = require("mongoose");
const SubDepartment = require("../models/SubDepartment");
const Department = require("../models/Department");
const Company = require("../models/Company");





const createSubDepartment = async(req, res) => {
    try{    

        const {sub_department_name, gl_code} = req.body;
        const sub_department = await SubDepartment({sub_department_name, gl_code});
        await sub_department.save();
        const {d_id} = req.body;
        const department = await Department.findOne({_id: d_id});
        department.sub_department.push(sub_department._id);
        department.updated_date = Date.now();
        await department.save();
        res.status(200).json({valid: true, msg:"sub department has been created", data:sub_department});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const updateSubDepartment = async(req, res) => {
    try{
        const s_id = req.params.s_id;
        const {sub_department_name, gl_code} = req.body;
        const {department} = req.body;

        const old_department = await Department.findOne({sub_department: {$in : [s_id]}})
        old_department.sub_department = old_department.sub_department.filter((el) => {
            if(el.toString() === s_id){
                return false
            }
            else{
                return true
            }

        })

        await old_department.save()

        const dept = await Department.findOne({_id: department})
        dept.sub_department.push(s_id)
        await dept.save()


        const subDepartment = await SubDepartment.findOne({_id: s_id});
        subDepartment.sub_department_name = sub_department_name;
        subDepartment.gl_code = gl_code;
        subDepartment.updated_date = Date.now();
        await subDepartment.save();
        res.status(200).json({valid: true, msg:"sub department has been updated", data:subDepartment});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const getSpecificSubDepartment = async(req, res) => {
    try{
        const s_id = req.params.s_id;
        
        const subDepartment = await SubDepartment.findOne({_id: s_id})
        res.status(200).json({valid: true, msg:"sub department has been updated", data:subDepartment});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}

const deleteSubDepartment = async(req, res) => {
    try{
        const s_id = req.params.s_id;
        await SubDepartment.findByIdAndDelete({_id: s_id});
        res.status(200).json({valid: true, msg:"sub department has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}



const getAllSubDepartment = async(req, res) => {
    console.log("here in get all subd");
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
        });
        console.log(companies);
        const result = [];
        companies.forEach((company) => {
            company.division.forEach((division) => {

                division.department.forEach((department) => {

                    department.sub_department.forEach((sub_department) => {
                        const t = {};
                        t['sub_department'] = sub_department.sub_department_name;
                        t['department'] = department.department_name;
                        t['division'] = division.division_name;
                        t['company'] = company.company_name;
                        t['gl_code'] = sub_department.gl_code
                        t['_id'] = sub_department._id
                        result.push(t);
                    })

                })

            })

        })
        res.status(200).json({valid: true, msg:"sub department has been deleted", data:result, count: result.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


module.exports = {
    createSubDepartment,
    updateSubDepartment,
    getSpecificSubDepartment,
    deleteSubDepartment,
    getAllSubDepartment
}