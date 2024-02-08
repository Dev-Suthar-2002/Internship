const { default: mongoose } = require("mongoose");
const Employee = require("../models/Employee");
const Department = require("../models/Department");


const createEmployee = async(req, res) => {
    try{
        const {emp_name, role, gate_name, password, email, phoneNumber} = req.body;
        const {company, division, department} = req.body;
        const {emp_id} = req.body;

        console.log("here emp id id id", typeof emp_id);

        const c1 = await Employee.findOne({emp_id});
        if(c1){
            return res.status(500).json({valid: false, msg:"something went wrong"});
        }
        
        const c2 = await Employee.findOne({emp_name});
        if(c2){
            console.log("here in c2", c2)
            return res.status(500).json({valid: false, msg:"something went wrong"});
        }
        var dept = ""
        if(department !== ""){
            dept = await Department.findOne({_id: department});
        }
        const employee = await Employee.create({emp_id, emp_name, role, gate_name,email, phoneNumber, password, hod_id: ((dept !== "") ? dept?.hod_id : ""), company, division, department, created_date: new Date(), created_by: "admin", updated_by: new Date(), updated_by:"admin"});

        const sendMail = require("../services/emailService")
        sendMail({
            from: "elecon@gmail.com",
            // to: visitor_email,
            to: employee.email,
            subject: 'Created Your Account',
            text: `use below Credentials to login`,
            html: require('../services/emailTemplate')({
                        msg:`Your Username is ${emp_name} and password is ${password}`

                  })
          }).then(() => {
            return res.status(201).json({"valid": true, "msg": "email has been send employee has been created", data: employee});
            
          }).catch(err => {
            return res.status(500).json({error: 'Error in email sending.'});
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const updateEmployee = async(req, res) => {
    try{
        const _id = req.params.id;
        console.log("update employee called")
        const { emp_name, role, gate_name, password, email, phoneNumber, hod_id} = req.body;
        const {emp_id} = req.body;
        const {company, division, department} = req.body;
        const emp = await Employee.findOne({_id});
        emp.emp_id = emp_id
        emp.company = company
        emp.division = division
        emp.department = department
        emp.emp_name = emp_name;
        emp.role = role;
        emp.phoneNumber = phoneNumber;
        emp.email = email;
        emp.hod_id = hod_id;
        emp.gate_name = gate_name
        emp.password = password
        emp.updated_date = new Date()
        emp.updated_by = "admin"
        
        await emp.save();

        console.log("after updating the employee");
        res.status(200).json({valid: true, msg:"employee has been updated", data: emp});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const deleteEmployee = async(req, res) => {
    try{
        const _id = req.params.id;
        
        const emp = await Employee.findByIdAndDelete({_id});
        res.status(200).json({valid: true, msg:"employee has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}



module.exports = {
    createEmployee,
    updateEmployee,
    deleteEmployee
}