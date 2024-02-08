const { default: mongoose, trusted } = require("mongoose");
const HotelBill = require("../models/HotelBill");


const dateInPast = (firstDate, secondDate) => {
    if(firstDate.setHours(0, 0, 0, 0) < secondDate.setHours(0, 0, 0, 0)){
        return true
    }
    else{
        return false
    }
}


const createHotelBill = async(req, res) => {
    try{    

        const {company, division, department, booked_by, hotel} = req.body;
        const {guest_name, purpose, requisition_date, stay_to_date, stay_from_date} = req.body;
        const {bill_no, total_days, amount, billing_date} = req.body; 

        if(dateInPast(new Date(stay_to_date), new Date()) || dateInPast(new Date(stay_from_date), new Date()) || (new Date(stay_from_date) > new Date(stay_to_date))){
            return res.status(500).json({valid: false, msg:"check your dates"});
        }

        const hotelBill = await HotelBill.create({company, division, department, booked_by, hotel, guest_name, purpose, requisition_date, stay_from_date: new Date(stay_from_date), stay_to_date: new Date(stay_to_date), bill_no, total_days, amount, billing_date: new Date(billing_date), created_by:"admin", created_date: Date.now(), updated_by: "admin", updated_date: Date.now()});
        return res.status(200).json({valid: true, msg:"hotel bill has been created", data: hotelBill});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getHotelBills = async(req, res) => {
    try{
        // const hotelBills = await HotelBill.find({});
        const hotelBills = await HotelBill.find({})
        .populate("company", "company_name") // Replace "company_name" with the actual field name in your Company model
        .populate("division", "division_name") // Replace "division_name" with the actual field name in your Division model
        .populate("department", "department_name") // Replace "department_name" with the actual field name in your Department model
        .populate("booked_by", "emp_name") // Replace "employee_name" with the actual field name in your Employee model
        .populate("hotel", "name") 

        // hotelBills = hotelBills.map((el) => {
        //     return {...el, company: el.company.company_name, division: el.division.division_name, department: el.department.department_name, booked_by: el.booked_by.emp_name, hotel: el.hotel.name}

        // })

        const result = hotelBills.map((el) => {
            const t = el.toObject();
            return {...t, company: t.company.company_name, division: t.division.division_name, department: t.department.department_name, booked_by: t.booked_by.emp_name, hotel: t.hotel.name}
        })
        
        
    return res.status(200).json({valid: true, msg:"hotel bill has been fetched", data: result, count: result.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}


const getSpecificEmpHotelBills = async(req, res) => {
    try{
        const emp_id = req.params.emp_id;
        const hotelBills = await HotelBill.find({booked_by: emp_id})
        .populate("company", "company_name") // Replace "company_name" with the actual field name in your Company model
        .populate("division", "division_name") // Replace "division_name" with the actual field name in your Division model
        .populate("department", "department_name") // Replace "department_name" with the actual field name in your Department model
        .populate("booked_by", "emp_name") // Replace "employee_name" with the actual field name in your Employee model
        .populate("hotel", "name") 

        // hotelBills = hotelBills.map((el) => {
        //     return {...el, company: el.company.company_name, division: el.division.division_name, department: el.department.department_name, booked_by: el.booked_by.emp_name, hotel: el.hotel.name}

        // })

        const result = hotelBills.map((el) => {
            const t = el.toObject();
            return {...t, company: t.company.company_name, division: t.division.division_name, department: t.department.department_name, booked_by: t.booked_by.emp_name, hotel: t.hotel.name}
        })
        
        
        return res.status(200).json({valid: true, msg:"hotel bill has been fetched", data: result, count: result.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificHotelBill = async(req, res) => {
    try{
        const hb_id = req.params.hb_id;
        const hotelBill = await HotelBill.findOne({_id: hb_id})
        .populate("company", "company_name") // Replace "company_name" with the actual field name in your Company model
        .populate("division", "division_name") // Replace "division_name" with the actual field name in your Division model
        .populate("department", "department_name") // Replace "department_name" with the actual field name in your Department model
        .populate("booked_by", "emp_name") // Replace "employee_name" with the actual field name in your Employee model
        .populate("hotel", "name")

        // const result = {...hotelBill, company: hotelBill.company.company_name, division: hotelBill.division.division_name, department: hotelBill.department.department_name, booked_by: hotelBill.booked_by.emp_name, hotel: hotelBill.hotel.name}
        
        
        
        return res.status(200).json({valid: true, msg:"hotel bill has been fetched", data: hotelBill});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const editHotelBill = async(req, res) => {
    try{
        const hb_id = req.params.hb_id;
        const {company, division, department, booked_by, hotel} = req.body;
        const {guest_name, purpose, requisition_date, stay_to_date, stay_from_date} = req.body;
        const {bill_no, total_days, amount, billing_date} = req.body; 
        const hotelBill = await HotelBill.findOne({_id: hb_id});
        hotelBill.company = company
        hotelBill.division = division
        hotelBill.department = department
        hotelBill.booked_by = booked_by
        hotelBill.hotel = hotel

        hotelBill.guest_name = guest_name
        hotelBill.purpose = purpose
        hotelBill.requisition_date = new Date(requisition_date)
        hotelBill.stay_to_date = new Date(stay_to_date)
        hotelBill.stay_from_date = new Date(stay_from_date)

        hotelBill.bill_no = bill_no
        hotelBill.total_days = total_days
        hotelBill.amount = amount
        hotelBill.billing_date = new Date(billing_date)


        hotelBill.updated_date = Date.now();

        await hotelBill.save();
        return res.status(200).json({valid: true, msg:"hotel bill has been updated", data:hotelBill});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteHotelBill = async(req, res) => {
    try{
        const hb_id = req.params.hb_id;
        await HotelBill.findOneAndDelete({_id: hb_id});
        return res.status(200).json({valid: true, msg:"hotel bill has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createHotelBill,
    getHotelBills,
    editHotelBill,
    getSpecificHotelBill,
    deleteHotelBill,
    getSpecificEmpHotelBills
}