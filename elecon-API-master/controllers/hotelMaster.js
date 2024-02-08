const { default: mongoose } = require("mongoose");
const HotelMaster = require("../models/HotelMaster");






const createHotel = async(req, res) => {
    try{    
        const {name, phone_no, email_id, address1, address2, city, state, pincode, district} = req.body;
        const {company, division, department} = req.body;
        const hotel = await HotelMaster.create({name, phone_no, email_id, address1, address2, city, state, pincode, district, company, division, department,created_by: "admin", created_date: Date.now(), updated_by:"admin", updated_date: Date.now()});
        return res.status(200).json({valid: true, msg:"hotel has been created", data:hotel});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getHotels = async(req, res) => {
    try{
        // const hotels = await HotelMaster.find({}).populate("company").populate("division").populate("department");
        const hotels = await HotelMaster.aggregate([
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
                    name: 1,
                    city: 1,
                    company: "$company.company_name", // Extract company name as a string
                    division: "$division.division_name",
                    department: "$department.department_name"
                }
            }
        ])
        return res.status(200).json({valid: true, msg:"hotels has been fetched", data:hotels, count: hotels.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificHotel = async(req, res) => {
    try{
        const h_id = req.params.h_id;
        const hotel = await HotelMaster.findOne({_id: h_id}).populate("company", "company_name").populate("division", "division_name").populate("department", "department_name");
        return res.status(200).json({valid: true, msg:"hotel has been fetched", data:hotel});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const editHotel = async(req, res) => {
    try{
        const h_id = req.params.h_id;

        const {name, phone_no, email_id, address1, address2, city, state, pincode, district} = req.body;
        const {company, division, department} = req.body;
        const hotel = await HotelMaster.findOne({_id: h_id});
        hotel.name = name 
        hotel.phone_no = phone_no 
        hotel.email_id = email_id 
        hotel.address1 = address1 
        hotel.address2 = address2 
        hotel.city = city 
        hotel.state = state 
        hotel.pincode = pincode 
        hotel.district = district 
        hotel.company = company 
        hotel.division = division 
        hotel.department = department 
        hotel.updated_date = Date.now();
        await hotel.save();
        return res.status(200).json({valid: true, msg:"hotel has been updated", data:hotel});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteHotel = async(req, res) => {
    try{
        const h_id = req.params.h_id;
        await HotelMaster.findByIdAndDelete({_id: h_id});
        return res.status(200).json({valid: true, msg:"hotel has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createHotel,
    getHotels,
    getSpecificHotel,
    editHotel,
    deleteHotel

}