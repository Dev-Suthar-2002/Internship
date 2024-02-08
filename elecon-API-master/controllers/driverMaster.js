const { default: mongoose } = require("mongoose");
const DriverMaster = require("../models/DriverMaster");

function diff_years(dt2, dt1) 
{

    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff/365.25));

}



const createDriver = async(req, res) => {
    try{    
        const {contractor, first_name, middle_name, last_name, email_id, address, city, pincode, state, phone_no, emergancy_contact_person, emergancy_contact_no, birth_date, join_date, license_no, license_exp_date, releave_date} = req.body;
        const {company, division, department} = req.body;

        if(diff_years(new Date(birth_date), new Date()) < 20){
            return res.status(500).json({valid: false, msg:"driver age should be greater than 20"});
        }
        if(new Date(license_exp_date).getTime() <= new Date(join_date).getTime()){
            return res.status(500).json({valid: false, msg:"driver exp date of license should be more"});
        }
        const driver = await DriverMaster.create({contractor, email_id, first_name, middle_name, last_name, address, city, pincode, state, phone_no, emergancy_contact_person, emergancy_contact_no, birth_date: new Date(birth_date), join_date: new Date(join_date), license_no, license_exp_date: new Date(license_exp_date), releave_date: new Date(releave_date), company, division, department,created_by: "admin", created_date: Date.now(), updated_by:"admin", updated_date: Date.now()});
        return res.status(200).json({valid: true, msg:"driver has been created", data:driver});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getDrivers = async(req, res) => {
    try{
        const drivers = await DriverMaster.aggregate([
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
                    contractor: 1,
                    first_name: 1,
                    middle_name: 1,
                    last_name: 1,
                    address: 1,
                    city: 1,
                    email_id: 1,
                    pincode: 1,
                    state: 1,
                    phone_no: 1,
                    emergancy_contact_person: 1,
                    emergancy_contact_no: 1,
                    license_no: 1,
                    birth_date: 1,
                    join_date: 1,
                    license_exp_date: 1,
                    releave_date: 1,
                    company: "$company.company_name", // Extract company name as a string
                    division: "$division.division_name",
                    department: "$department.department_name"
                }
            }
        ])
        return res.status(200).json({valid: true, msg:"drivers has been fetched", data:drivers, count: drivers.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificDriver = async(req, res) => {
    try{
        const d_id = req.params.d_id;
        const driver = await DriverMaster.findOne({_id: d_id}).populate("company", "company_name").populate("division", "division_name").populate("department", "department_name");
        return res.status(200).json({valid: true, msg:"driver has been fetched", data:driver});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const editDriver = async(req, res) => {
    try{
        const d_id = req.params.d_id;

        const {contractor, email_id, first_name, middle_name, last_name, address, city, pincode, state, phone_no, emergancy_contact_person, emergancy_contact_no, birth_date, join_date, license_no, license_exp_date, releave_date} = req.body;
        const {company, division, department} = req.body;
        const driver = await DriverMaster.findOne({_id: d_id});
        driver.contractor = contractor  
        driver.first_name = first_name 
        driver.middle_name = middle_name 
        driver.last_name = last_name 
        driver.address = address 
        driver.city = city 
        driver.pincode = pincode 
        driver.state = state 
        driver.phone_no = phone_no 
        driver.email_id = email_id 
        driver.emergancy_contact_person = emergancy_contact_person 
        driver.emergancy_contact_no = emergancy_contact_no 
        driver.birth_date = new Date(birth_date)
        driver.join_date = new Date(join_date)
        driver.license_no = license_no 
        driver.license_exp_date = new Date(license_exp_date)
        driver.releave_date = new Date(releave_date) 
        driver.company = company
        driver.division = division 
        driver.department = department 
        driver.updated_date = Date.now();
        await driver.save();
        return res.status(200).json({valid: true, msg:"driver has been updated", data:driver});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteDriver = async(req, res) => {
    try{
        const d_id = req.params.d_id;
        await DriverMaster.findByIdAndDelete({_id: d_id});
        return res.status(200).json({valid: true, msg:"driver has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createDriver,
    getDrivers,
    getSpecificDriver,
    editDriver,
    deleteDriver

}