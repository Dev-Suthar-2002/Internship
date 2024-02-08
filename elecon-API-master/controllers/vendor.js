const { default: mongoose } = require("mongoose");
const VendorMaster = require("../models/VendorMaster");





const createVendor = async(req, res) => {
    try{    
        const {name, phone_no, email_id, address1, address2, city, state, pincode, vendor_code} = req.body;
        const {company_id, division_id, department_id} = req.body;
        const vendor = await VendorMaster.create({name, phone_no, email_id, address1, address2, city, state, pincode, company: company_id, division: division_id, department: department_id, vendor_code, created_by: "admin", created_date: Date.now(), updated_by:"admin", updated_date: Date.now()});
        return res.status(200).json({valid: true, msg:"vendor has been created", data:vendor});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getVendors = async(req, res) => {
    try{
        // const vendors = await VendorMaster.find({}).populate("company").populate("division").populate("department");
        const vendors = await VendorMaster.aggregate([
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
                    name: 1,
                    phone_no: 1,
                    email_id: 1,
                    company: "$company.company_name", // Extract company name as a string
                    division: "$division.division_name",
                    department: "$department.department_name"
                }
            }
        ])
        return res.status(200).json({valid: true, msg:"vendor has been fetched", data:vendors, count: vendors.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificVendor = async(req, res) => {
    try{
        const v_id = req.params.v_id;
        const vendor = await VendorMaster.findOne({_id: v_id}).populate("company", "company_name").populate("division", "division_name").populate("department", "department_name");
        return res.status(200).json({valid: true, msg:"vendor has been fetched", data:vendor});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const editVendor = async(req, res) => {
    try{
        const v_id = req.params.v_id;

        const {name, phone_no, email_id, address1, address2, city, state, pincode, vendor_code} = req.body;
        const {company, division, department} = req.body;
        const vendor = await VendorMaster.findOne({_id: v_id});
        vendor.name = name 
        vendor.phone_no = phone_no 
        vendor.email_id = email_id 
        vendor.address1 = address1 
        vendor.address2 = address2 
        vendor.city = city 
        vendor.state = state 
        vendor.pincode = pincode 
        vendor.vendor_code = vendor_code 
        vendor.company = company
        vendor.division = division
        vendor.department = department
        vendor.updated_date = Date.now();
        await vendor.save();
        return res.status(200).json({valid: true, msg:"vendor has been updated", data:vendor});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteVendor = async(req, res) => {
    try{
        const v_id = req.params.v_id;
        await VendorMaster.findByIdAndDelete({_id: v_id});
        return res.status(200).json({valid: true, msg:"vendor has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createVendor,
    getVendors,
    getSpecificVendor,
    editVendor,
    deleteVendor
}