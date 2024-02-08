const { default: mongoose, trusted } = require("mongoose");
const vehicleBill = require("../models/vehicleBill");
const cloudinary = require("cloudinary").v2



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const dateInPast = (firstDate, secondDate) => {
    if(firstDate.setHours(0, 0, 0, 0) < secondDate.setHours(0, 0, 0, 0)){
        return true
    }
    else{
        return false
    }
}


const createVehicleBill = async(req, res) => {
    try{    

        const {company, division, department, make_model, employee, approved_by, driver} = req.body;
        const {vehicle_no, purchase_date, issue_date, received_date, engine_no, chassis_no, remarks, condition, usage} = req.body;
        const {sale_date, sale_value, wdv_amount, sale_to} = req.body;
        const {payment_mode, payment_from_bank, cheque_date, cheque_no, cheque_to, transaction_date, transaction_no, transaction_status, payment_to_bank, amount} = req.body; 
        const {rc_book_details, insurance_details, puc_details} = req.files;
        // const {file} = req.files;
        
        // console.log("here is temp file path : ", rc_book_details)
        const rc_book = await cloudinary.uploader.upload(rc_book_details.tempFilePath);
        const insurance = await cloudinary.uploader.upload(insurance_details.tempFilePath)
        const puc = await cloudinary.uploader.upload(puc_details.tempFilePath)

        // console.log(rc_book)
        
        const vBill = await vehicleBill.create({
            company,
            division,
            department,
            make_model,
            employee,
            approved_by,
            driver,
            vehicle_no,
            purchase_date: new Date(purchase_date),
            issue_date: new Date(issue_date),
            received_date: new Date(received_date),
            engine_no,
            chassis_no,
            remarks,
            condition,
            usage,
            sale_date: new Date(sale_date),
            sale_value,
            wdv_amount,
            sale_to,
            payment_mode,
            payment_from_bank,
            cheque_date: new Date(cheque_date),
            cheque_no,
            cheque_to,
            transaction_date: new Date(transaction_date),
            transaction_no,
            transaction_status,
            payment_to_bank,
            amount,
            rc_book_details: rc_book.url,
            insurance_details: insurance.url,
            puc_details: puc.url,
            created_by: "admin",
            created_date: Date.now(),
            updated_by: "admin",
            updated_date: Date.now()

        })

        return res.status(200).json({valid: true, msg:"Vehicle bill has been created"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong", error: err});
    }
}

const getVehicleBills = async(req, res) => {
    try{
        // const vBills = await vehicleBill.find({});
        const vBills = await vehicleBill.aggregate([
            {
              $lookup: {
                from: "vehiclemasters", // Replace with the actual collection name for AssetMaster
                localField: "make_model",
                foreignField: "_id",
                as: "make_model",
              },
            },
            {
              $lookup: {
                from: "employees", // Replace with the actual collection name for VendorMaster
                localField: "employee",
                foreignField: "_id",
                as: "employee",
              },
            },
            {
              $lookup: {
                from: "employees", // Replace with the actual collection name for VendorMaster
                localField: "approved_by",
                foreignField: "_id",
                as: "approved_by",
              },
            },
            {
              $lookup: {
                from: "drivermasters", // Replace with the actual collection name for VendorMaster
                localField: "driver",
                foreignField: "_id",
                as: "driver",
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
                make_model: { $arrayElemAt: ["$make_model.vehicle_name", 0] },
                employee: { $arrayElemAt: ["$employee.emp_name", 0] },
                approved_by: { $arrayElemAt: ["$approved_by.emp_name", 0] },
                driver: { $arrayElemAt: ["$driver.first_name", 0] },
                vehicle_no: 1,
                purchase_date: 1,
                issue_date: 1,
                received_date: 1,
                engine_no: 1,
                asset_no: 1,
                chassis_no: 1,
                remarks: 1,
                condition: 1,
                usage: 1,
                sale_date: 1,
                sale_value: 1,
                wdv_amount: 1,
                sale_to: 1,

                payment_mode: 1,
                payment_from_bank: 1,
                cheque_date: 1,
                cheque_no: 1,
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

        return res.status(200).json({valid: true, msg:"vehicle bill has been fetched", data: vBills, count: vBills.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getAllBillsForSpecific = async(req, res) => {
    try{
      const vb_id = req.params.vb_id;
      const vBills = await vehicleBill.aggregate([
        {
          $lookup: {
            from: "vehiclemasters", // Replace with the actual collection name for AssetMaster
            localField: "make_model",
            foreignField: "_id",
            as: "make_model",
          },
        },
        {
          $lookup: {
            from: "employees", // Replace with the actual collection name for VendorMaster
            localField: "approved_by",
            foreignField: "_id",
            as: "approved_by",
          },
        },
        {
          $lookup: {
            from: "drivermasters", // Replace with the actual collection name for VendorMaster
            localField: "driver",
            foreignField: "_id",
            as: "driver",
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
            make_model: { $arrayElemAt: ["$make_model.vehicle_name", 0] },
            // employee: { $arrayElemAt: ["$employee.emp_name", 0] },
            employee: 1,
            approved_by: { $arrayElemAt: ["$approved_by.emp_name", 0] },
            driver: { $arrayElemAt: ["$driver.first_name", 0] },
            vehicle_no: 1,
            purchase_date: 1,
            issue_date: 1,
            received_date: 1,
            engine_no: 1,
            asset_no: 1,
            chassis_no: 1,
            remarks: 1,
            condition: 1,
            usage: 1,
            sale_date: 1,
            sale_value: 1,
            wdv_amount: 1,
            sale_to: 1,

            payment_mode: 1,
            payment_from_bank: 1,
            cheque_date: 1,
            cheque_no: 1,
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


      const result = vBills.filter((el) => {
        if(el.employee.toString() === vb_id){
          return true
        }
        else{
          return false
        }
        
      })

      return res.status(200).json({valid: true, msg:"vehicle bill has been fetched", data: result, count: result.length});
    }
    catch(err){
      console.log(err);
      res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificVehicleBill = async(req, res) => {
    try{
        const vb_id = req.params.vb_id;
         const vBills = await vehicleBill.aggregate([
        {
          $lookup: {
            from: "vehiclemasters", // Replace with the actual collection name for AssetMaster
            localField: "make_model",
            foreignField: "_id",
            as: "make_model",
          },
        },
        {
          $lookup: {
            from: "employees", // Replace with the actual collection name for VendorMaster
            localField: "approved_by",
            foreignField: "_id",
            as: "approved_by",
          },
        },
        {
          $lookup: {
            from: "drivermasters", // Replace with the actual collection name for VendorMaster
            localField: "driver",
            foreignField: "_id",
            as: "driver",
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
            make_model: { $arrayElemAt: ["$make_model.vehicle_name", 0] },
            employee: { $arrayElemAt: ["$employee.emp_name", 0] },
            // employee: 1,
            approved_by: { $arrayElemAt: ["$approved_by.emp_name", 0] },
            driver: { $arrayElemAt: ["$driver.first_name", 0] },
            vehicle_no: 1,
            purchase_date: 1,
            issue_date: 1,
            received_date: 1,
            engine_no: 1,
            asset_no: 1,
            chassis_no: 1,
            remarks: 1,
            condition: 1,
            usage: 1,
            sale_date: 1,
            sale_value: 1,
            wdv_amount: 1,
            sale_to: 1,

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


      const result = vBills.filter((el) => {
        if(el._id.toString() === vb_id){
          return true
        }
        else{
          return false
        }
      })[0]

      return res.status(200).json({valid: true, msg:"specific vehicle bill has been fetched", data: result});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const editVehicleBill = async(req, res) => {
    try{
        const vb_id = req.params.vb_id;
        const {vehicle_type, make_model, employee, approved_by, driver} = req.body;
        const {vehicle_no, purchase_date, issue_date, received_date, engine_no, chassis_no, remarks, usage} = req.body;
        const {sale_date, sale_value, wdv_amount, sale_to, supplier} = req.body;
        const {payment_mode, payment_from_bank, cheque_date, cheque_no, cheque_to, transaction_date, transaction_no, transaction_status, payment_to_bank, amount} = req.body; 
        // const {rc_book_details, insurance_details, puc_details} = req.files;
        
        // const rc_book = await cloudinary.uploader.upload(rc_book_details.tempFilePath)
        // const insurance = await cloudinary.uploader.upload(insurance_details.tempFilePath)
        // const puc = await cloudinary.uploader.upload(puc_details.tempFilePath)

        const vBill = await vehicleBill.findOne({_id: vb_id});
        // vBill.company = company
        // vBill.division = division
        // vBill.department = department
        vBill.vehicle_type = vehicle_type
        vBill.make_model = make_model
        vBill.employee = employee
        vBill.approved_by = approved_by
        vBill.driver = driver

        vBill.vehicle_no = vehicle_no
        vBill.purchase_date = new Date(purchase_date)
        vBill.issue_date = new Date(issue_date)
        vBill.received_date = new Date(received_date)
        vBill.engine_no = engine_no
        vBill.chassis_no = chassis_no
        vBill.remarks = remarks
        vBill.usage = usage


        vBill.sale_date = new Date(sale_date)
        vBill.sale_value = sale_value
        vBill.wdv_amount = wdv_amount
        vBill.sale_to = sale_to
        vBill.supplier = supplier


        vBill.payment_mode = payment_mode
        vBill.payment_from_bank = payment_from_bank
        vBill.cheque_date = new Date(cheque_date)
        vBill.cheque_no = cheque_no
        vBill.cheque_to = cheque_to
        vBill.transaction_date = new Date(transaction_date)
        vBill.transaction_no = transaction_no
        vBill.transaction_status = transaction_status
        vBill.payment_to_bank = payment_to_bank
        vBill.amount = amount


        // vBill.rc_book_details = rc_book.url
        // vBill.insurance_details = insurance.url
        // vBill.puc_details = puc.url

        vBill.updated_date = Date.now();

        await vBill.save();
        return res.status(200).json({valid: true, msg:"vehicle bill has been updated", data:vBill});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteVehicleBill = async(req, res) => {
    try{
        const vb_id = req.params.vb_id;
        await vehicleBill.findOneAndDelete({_id: vb_id});
        return res.status(200).json({valid: true, msg:"vehicle bill has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createVehicleBill,
    getVehicleBills,
    editVehicleBill,
    getSpecificVehicleBill,
    deleteVehicleBill,
    getAllBillsForSpecific
}