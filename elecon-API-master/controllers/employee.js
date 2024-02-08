const Employee = require("../models/Employee");
const Visitor = require("../models/Visitor");




const getAllEmployees = async(req, res) => {
    try{
        const employees = await Employee.find({}).populate("company", "company_name").populate("division", "division_name").populate("department", "department_name").populate("hod_id", "emp_name");


        // const employees = await Employee.aggregate([
        //     {
        //         $lookup: {
        //             from: "companies", // Assuming the name of the company collection is "companies"
        //             localField: "company",
        //             foreignField: "_id",
        //             as: "company"
        //         }
        //     },
        //     {
        //         $unwind: "$company" // Convert the "company" array to an object
        //     },
        //     {
        //         $lookup: {
        //             from: "divisions", // Assuming the name of the division collection is "divisions"
        //             localField: "division",
        //             foreignField: "_id",
        //             as: "division"
        //         }
        //     },
        //     {
        //         $unwind: "$division" // Convert the "division" array to an object
        //     },
        //     {
        //         $lookup: {
        //             from: "departments", // Assuming the name of the department collection is "departments"
        //             localField: "department",
        //             foreignField: "_id",
        //             as: "department"
        //         }
        //     },
        //     {
        //         $unwind: "$department" // Convert the "department" array to an object
        //     },
        //     {
        //         $project: {
        //             _id: 1,
        //             created_date: 1,
        //             created_by: 1,
        //             updated_date: 1,
        //             updated_by: 1,
        //             deleted_date: 1,
        //             deleted_by: 1,
        //             emp_name: 1,
        //             // password: 1,
        //             // email: 1,
        //             // role: 1,
        //             // phoneNumber: 1,
        //             // gate_name: 1,
        //             company: "$company.company_name", // Extract company name as a string
        //             division: "$division.division_name",
        //             department: "$department.department_name"
        //         }
        //     }
        // ])
        
        res.status(200).json({valid: true, msg:"data fetched", data:employees});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const getEmployee = async(req, res) => {
    try{
        const _id = req.params.id;
        const employee = await Employee.findOne({_id}).populate("company", "company_name").populate("division", "division_name").populate("department", "department_name").populate("hod_id", "emp_name")
        console.log("in specific emp");
        res.status(200).json({valid: true, msg:"data fetched", data:employee});

    }
    catch(err){

        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}


const forgotPasswordEmail = async(req, res) => {
    try{
        const {username} = req.body;

        const emp = await Employee.findOne({emp_name:username});
        if(!emp){
            return res.status(400).json({error: "emp does not exist"});
        }
        const emp_email = emp.email;
        console.log("emp email is ", emp_email);
        const otp = Math.random().toString().substr(2, 6)


        const sendMail = require("../services/emailService")
        sendMail({
            from: "elecon@gmail.com",
            // to: visitor_email,
            to: emp_email,
            subject: 'For Password Change in Elecon Admin Portal',
            text: `use below OTP to change your password`,
            html: require('../services/emailTemplate')({
                        msg:`your otp is ${otp}`

                  })
          }).then(() => {
            return res.status(201).json({"valid": true, "msg": "email has been send", otp: otp});
            
          }).catch(err => {
            return res.status(500).json({error: 'Error in email sending.'});
          });
    }
    catch(err){
        res.status(500).json({valid: false, msg: "something went wrong"});
    }


}


const changePassword = async(req, res) => {
    try{
        
        const {username, newPassword} = req.body;
        console.log("here in change password", username);
        const emp = await Employee.findOne({emp_name:username});
        emp.password = newPassword;
        await emp.save()
        return res.status(201).json({"valid": true, "msg": "password has been changed"});

    }
    catch(err){
        res.status(500).json({valid: false, msg: "something went wrong"});
    }
}


const getAllHOD = async(req, res) => {
    try{
        const allHOD = await Employee.find({role: "hod"}, {emp_name:1});
        return res.status(201).json({"valid": true, "msg": "all hod fetched", data: allHOD});
    }
    catch(err){
        res.status(500).json({valid: false, msg: "something went wrong"});
    }

}

const countEmpBasedOnRole = async(req, res) => {
    try{
        const counts = await Employee.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    role: "$_id",
                    count: 1
                }
            }
        ]);
        const result = counts.map((c) => {
            return {
                label: c.role,
                value: c.count
            }
        })
        return res.status(201).json({"valid": true, "msg": "all hod fetched", data: result});
    }
    catch(err){
        res.status(500).json({valid: false, msg: "something went wrong"});
    }
}

const getHODEmps = async(req, res) => {
    try{
        const h_id = req.params.h_id;
        const result = await Employee.find({});
        // console.log(result)
        const finalRes = result.filter((el) => {
           if(el.hod_id && el.hod_id.toString() === h_id){
            return true;
           }
           else{
            return false;
           }
        })
        return res.status(201).json({"valid": true, "msg": "data fetched", data: finalRes, total: finalRes.length});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({valid: false, msg: "something went wrong"});
    }


}


const getEmpByCDD = async(req, res) => {
    try{
        const {company, division, department} = req.body;
        console.log(company, division, department);
        // console.log("here in get emp by cdd");
        var emps = await Employee.find({})
        // console.log(emps);
        emps = emps.filter((el) => {
            if((el.company && el?.company.toString() === company) && (el.department && el?.department.toString() === department) && (el.division && el?.division.toString() === division)){
                return true;
            }
            else{
                return false;
            }
        }) 
        return res.status(201).json({"valid": true, "msg": "data fetched", data: emps, total: emps.length});


    }
    catch(err){
        console.log(err);
        return res.status(500).json({valid: false, msg: "something went wrong"});
    }
}


module.exports = {
    getAllEmployees,
    getEmployee,
    forgotPasswordEmail,
    changePassword,
    getAllHOD,
    countEmpBasedOnRole,
    getHODEmps,
    getEmpByCDD
}