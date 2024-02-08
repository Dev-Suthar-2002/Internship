const { default: mongoose, trusted } = require("mongoose");
const AssetBill = require("../models/AssetBill");


const dateInPast = (firstDate, secondDate) => {
    if(firstDate.setHours(0, 0, 0, 0) < secondDate.setHours(0, 0, 0, 0)){
        return true
    }
    else{
        return false
    }
}


const createAssetBill = async(req, res) => {
    try{    

        const {company, division, department, item, vendor, issued_to, approved_by} = req.body;
        const {issue_date, purchase_date, condition, sale_date, wdv_amount, sale_value, cjo_no} = req.body;
        const {payment_mode, payment_from_bank, cheque_date, cheque_no, cheque_to, transaction_date, transaction_no, transaction_status, payment_to_bank, amount} = req.body; 

        console.log("this create asset bill is called called");
        const assetBill = await AssetBill.create({company, division, department, item, vendor, issued_to, approved_by, issue_date: new Date(issue_date), purchase_date: new Date(purchase_date), condition, sale_date: new Date(sale_date), wdv_amount, sale_value, cjo_no, payment_mode, payment_from_bank, cheque_date: new Date(cheque_date), cheque_no, cheque_to, transaction_date: new Date(transaction_date), transaction_no, transaction_status, payment_to_bank, amount, created_by:"admin", created_date: Date.now(), updated_by: "admin", updated_date: Date.now()});
        return res.status(200).json({valid: true, msg:"asset bill has been created", data: assetBill});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getAssetBills = async(req, res) => {
    try{
        const assets = await AssetBill.aggregate([
            {
              $lookup: {
                from: "assetmasters", // Replace with the actual collection name for AssetMaster
                localField: "item",
                foreignField: "_id",
                as: "item",
              },
            },
            {
              $lookup: {
                from: "vendormasters", // Replace with the actual collection name for VendorMaster
                localField: "vendor",
                foreignField: "_id",
                as: "vendor",
              },
            },
            {
              $lookup: {
                from: "employees", // Replace with the actual collection name for Employee
                localField: "issued_to",
                foreignField: "_id",
                as: "issued_to",
              },
            },
            {
              $lookup: {
                from: "employees", // Replace with the actual collection name for Employee
                localField: "approved_by",
                foreignField: "_id",
                as: "approved_by",
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
                item: { $arrayElemAt: ["$item.asset_name", 0] },
                vendor: { $arrayElemAt: ["$vendor.name", 0] },
                issued_to: { $arrayElemAt: ["$issued_to.emp_name", 0] },
                approved_by: { $arrayElemAt: ["$approved_by.emp_name", 0] },
                purchase_date: 1,
                issue_date: 1,
                condition: 1,
                sale_date: 1,
                wdv_amount: 1,
                sale_value: 1,
                cjo_no: 1,
                payment_mode: 1,
                payment_from_bank: 1,
                cheque_date: 1,
                cheque_no: 1,
                cheque_to: 1,
                transaction_date: 1,
                transaction_no: 1,
                transaction_status: 1,
                payment_to_bank: 1,
                amount: 1,
                company: { $arrayElemAt: ["$company.company_name", 0] },
                division: { $arrayElemAt: ["$division.division_name", 0] },
                department: { $arrayElemAt: ["$department.department_name", 0] },
                // Add other fields as needed
              },
            },
          ]);
        return res.status(200).json({valid: true, msg:"asset bill has been fetched", data: assets, count: assets.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificAssetBill = async(req, res) => {
    try{
        const ab_id = req.params.ab_id;
        const asset = await AssetBill.aggregate([
          {
            $lookup: {
              from: "assetmasters", // Replace with the actual collection name for AssetMaster
              localField: "item",
              foreignField: "_id",
              as: "item",
            },
          },
          {
            $lookup: {
              from: "vendormasters", // Replace with the actual collection name for VendorMaster
              localField: "vendor",
              foreignField: "_id",
              as: "vendor",
            },
          },
          {
            $lookup: {
              from: "employees", // Replace with the actual collection name for Employee
              localField: "issued_to",
              foreignField: "_id",
              as: "issued_to",
            },
          },
          {
            $lookup: {
              from: "employees", // Replace with the actual collection name for Employee
              localField: "approved_by",
              foreignField: "_id",
              as: "approved_by",
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
              item: { $arrayElemAt: ["$item.asset_name", 0] },
              vendor: { $arrayElemAt: ["$vendor.name", 0] },
              issued_to: { $arrayElemAt: ["$issued_to.emp_name", 0] },
              approved_by: { $arrayElemAt: ["$approved_by.emp_name", 0] },
              purchase_date: 1,
              issue_date: 1,
              condition: 1,
              sale_date: 1,
              wdv_amount: 1,
              sale_value: 1,
              cjo_no: 1,
              payment_mode: 1,
              payment_from_bank: 1,
              cheque_date: 1,
              cheque_no: 1,
              cheque_to: 1,
              transaction_date: 1,
              transaction_no: 1,
              transaction_status: 1,
              payment_to_bank: 1,
              amount: 1,
              company: { $arrayElemAt: ["$company.company_name", 0] },
              division: { $arrayElemAt: ["$division.division_name", 0] },
              department: { $arrayElemAt: ["$department.department_name", 0] },
              // Add other fields as needed
            },
          },
        ]);

        const result = asset.filter((el) => {
          if(el._id.toString() === ab_id){
            return true
          }
          else{
            return false
          }
        })[0]
        return res.status(200).json({valid: true, msg:"specific asset bill has been fetched", data: result});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const editAssetBill = async(req, res) => {
    try{
        const ab_id = req.params.ab_id;
        const {item, vendor, approved_by} = req.body;
        const {issue_date, purchase_date, condition, sale_date, wdv_amount, sale_value, cjo_no} = req.body;
        const {payment_mode, payment_from_bank, cheque_date, cheque_no, cheque_to, transaction_date, transaction_no, transaction_status, payment_to_bank, amount} = req.body; 
        const assetBill = await AssetBill.findOne({_id: ab_id});
        // assetBill.company = company
        // assetBill.division = division
        // assetBill.department = department
        assetBill.item = item
        assetBill.vendor = vendor
        // assetBill.issued_to = issued_to
        assetBill.approved_by = approved_by

        assetBill.issue_date = new Date(issue_date)
        assetBill.purchase_date = new Date(purchase_date)
        assetBill.condition = condition
        assetBill.sale_date = new Date(sale_date)
        assetBill.wdv_amount = wdv_amount
        assetBill.sale_value = sale_value
        assetBill.cjo_no = cjo_no

        assetBill.payment_mode = payment_mode
        assetBill.payment_from_bank = payment_from_bank
        assetBill.cheque_date = new Date(cheque_date)
        assetBill.cheque_no = cheque_no
        assetBill.cheque_to = cheque_to
        assetBill.transaction_date = new Date(transaction_date)
        assetBill.transaction_no = transaction_no
        assetBill.transaction_status = transaction_status
        assetBill.payment_to_bank = payment_to_bank
        assetBill.amount = amount


        assetBill.updated_date = Date.now();

        await assetBill.save();
        return res.status(200).json({valid: true, msg:"asset bill has been updated", data:assetBill});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteAssetBill = async(req, res) => {
    try{
        const ab_id = req.params.ab_id;
        await AssetBill.findOneAndDelete({_id: ab_id});
        return res.status(200).json({valid: true, msg:"asset bill has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createAssetBill,
    getAssetBills,
    editAssetBill,
    getSpecificAssetBill,
    deleteAssetBill
}