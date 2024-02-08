const { default: mongoose, trusted } = require("mongoose");
const ManPowerBill = require("../models/ManPowerBill");





const createManPowerBill = async(req, res) => {
    try{    

        const {company, division, department, work_type, location} = req.body;
        const {contractor, month_year, no_of_employee} = req.body;
        const {bill_no, bill_date, bill_amount} = req.body;
        const {sgst, cgst, igst, total_amount} = req.body; 
        
        
        const manPowerBill = await ManPowerBill.create({
            company,
            division,
            department,
            work_type,
            location,
            contractor,
            month_year,
            no_of_employee,
            bill_no,
            bill_date: new Date(bill_date),
            bill_amount,
            sgst,
            cgst,
            igst,
            total_amount,
            created_by: "admin",
            created_date: Date.now(),
            updated_by: "admin",
            updated_date: Date.now()

        })

        return res.status(200).json({valid: true, msg:"Man Power bill has been created", data:manPowerBill});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong", error: err});
    }
}

const getManPowerBills = async(req, res) => {
    try{
        // const manPowerBills = await ManPowerBill.find({});

        const manPowerBills = await ManPowerBill.aggregate([
            {
              $lookup: {
                from: "worktypemasters", // Replace with the actual collection name for AssetMaster
                localField: "work_type",
                foreignField: "_id",
                as: "work_type",
              },
            },
            {
              $lookup: {
                from: "locationmasters", // Replace with the actual collection name for VendorMaster
                localField: "location",
                foreignField: "_id",
                as: "location",
              },
            },
            {
              $lookup: {
                from: "vendormasters", // Replace with the actual collection name for VendorMaster
                localField: "contractor",
                foreignField: "_id",
                as: "contractor",
              },
            },
            {
              $lookup: {
                from: "companies", // Replace with the actual collection name for Company
                localField: "company",
                foreignField: "_id",
                as: "company",
              },
            },
            {
              $lookup: {
                from: "divisions", // Replace with the actual collection name for Division
                localField: "division",
                foreignField: "_id",
                as: "division",
              },
            },
            {
              $lookup: {
                from: "departments", // Replace with the actual collection name for Department
                localField: "department",
                foreignField: "_id",
                as: "department",
              },
            },
            {
              $project: {
                created_date: 1,
                created_by: 1,
                updated_date: 1,
                updated_by: 1,
                work_type: { $arrayElemAt: ["$work_type.work_type", 0] },
                location: { $arrayElemAt: ["$location.location_name", 0] },
                contractor: { $arrayElemAt: ["$contractor.name", 0] },
                month_year: 1,
                no_of_employee: 1,
                bill_no: 1,
                bill_date: 1,
                bill_amount: 1,
                sgst: 1,
                cgst: 1,
                igst: 1,
                total_amount: 1,
                company: { $arrayElemAt: ["$company.company_name", 0] },
                division: { $arrayElemAt: ["$division.division_name", 0] },
                department: { $arrayElemAt: ["$department.department_name", 0] },
                // Add other fields as needed
              },
            },
          ]);
        return res.status(200).json({valid: true, msg:"Man Power bill has been fetched", data: manPowerBills, count: manPowerBills.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificManPowerBill = async(req, res) => {
    try{
        const mb_id = req.params.mb_id;
        const manPowerBill = await ManPowerBill.aggregate([
          {
            $lookup: {
              from: "worktypemasters", // Replace with the actual collection name for AssetMaster
              localField: "work_type",
              foreignField: "_id",
              as: "work_type",
            },
          },
          {
            $lookup: {
              from: "locationmasters", // Replace with the actual collection name for VendorMaster
              localField: "location",
              foreignField: "_id",
              as: "location",
            },
          },
          {
            $lookup: {
              from: "vendormasters", // Replace with the actual collection name for VendorMaster
              localField: "contractor",
              foreignField: "_id",
              as: "contractor",
            },
          },
          {
            $lookup: {
              from: "companies", // Replace with the actual collection name for Company
              localField: "company",
              foreignField: "_id",
              as: "company",
            },
          },
          {
            $lookup: {
              from: "divisions", // Replace with the actual collection name for Division
              localField: "division",
              foreignField: "_id",
              as: "division",
            },
          },
          {
            $lookup: {
              from: "departments", // Replace with the actual collection name for Department
              localField: "department",
              foreignField: "_id",
              as: "department",
            },
          },
          {
            $project: {
              created_date: 1,
              created_by: 1,
              updated_date: 1,
              updated_by: 1,
              work_type: { $arrayElemAt: ["$work_type.work_type", 0] },
              location: { $arrayElemAt: ["$location.location_name", 0] },
              contractor: { $arrayElemAt: ["$contractor.name", 0] },
              month_year: 1,
              no_of_employee: 1,
              bill_no: 1,
              bill_date: 1,
              bill_amount: 1,
              sgst: 1,
              cgst: 1,
              igst: 1,
              total_amount: 1,
              company: { $arrayElemAt: ["$company.company_name", 0] },
              division: { $arrayElemAt: ["$division.division_name", 0] },
              department: { $arrayElemAt: ["$department.department_name", 0] },
              // Add other fields as needed
            },
          },
        ]);

        const result = manPowerBill.filter((el) => {
          if(el._id.toString() === mb_id){
            return true
          }
          else{
            return false
          }
        })[0]
        return res.status(200).json({valid: true, msg:"specific Man Power bill has been fetched", data: result});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const editManPowerBill = async(req, res) => {
    try{
        const mb_id = req.params.mb_id;
        const {company, division, department, work_type, location} = req.body;
        const {contractor, month_year, no_of_employee} = req.body;
        const {bill_no, bill_date, bill_amount} = req.body;
        const {sgst, cgst, igst, total_amount} = req.body; 
        
        

        const manPowerBill = await ManPowerBill.findOne({_id: mb_id});
        manPowerBill.company = company
        manPowerBill.division = division
        manPowerBill.department = department
        manPowerBill.work_type = work_type
        manPowerBill.location = location
        

        manPowerBill.contractor = contractor
        manPowerBill.month_year = month_year
        manPowerBill.no_of_employee = no_of_employee
        


        manPowerBill.bill_no = bill_no
        manPowerBill.bill_date = new Date(bill_date)
        manPowerBill.bill_amount = bill_amount


        manPowerBill.sgst = sgst
        manPowerBill.cgst = cgst
        manPowerBill.igst = igst
        manPowerBill.total_amount = total_amount
        manPowerBill.updated_date = Date.now();
        await manPowerBill.save();
        return res.status(200).json({valid: true, msg:"Man Power bill has been updated", data:manPowerBill});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteManPowerBill = async(req, res) => {
    try{
        const mb_id = req.params.mb_id;
        await ManPowerBill.findOneAndDelete({_id: mb_id});
        return res.status(200).json({valid: true, msg:"Man Power bill has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createManPowerBill,
    getManPowerBills,
    editManPowerBill,
    getSpecificManPowerBill,
    deleteManPowerBill
}