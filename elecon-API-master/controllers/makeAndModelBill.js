const { default: mongoose, trusted } = require("mongoose");
const cloudinary = require("cloudinary").v2
const makeAndModelBill = require("../models/makeAndModelBill");

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


const createMAndMBill = async(req, res) => {
    try{    

        const {company, division, department, make_model, employee, approved_by} = req.body;
        const {vehicle_no, purchase_date, issue_date, received_date, engine_no, chassis_no, remarks, condition, usage} = req.body;
        const {sale_date, sale_value, wdv_amount, sale_to} = req.body;
        const {payment_mode, payment_from_bank, cheque_date, cheque_no, cheque_to, transaction_date, transaction_no, transaction_status, payment_to_bank, amount} = req.body; 
        const {rc_book_details, insurance_details, puc_details} = req.files;
        
        const rc_book = await cloudinary.uploader.upload(rc_book_details.tempFilePath)
        const insurance = await cloudinary.uploader.upload(insurance_details.tempFilePath)
        const puc = await cloudinary.uploader.upload(puc_details.tempFilePath)
        
        const modelBill = await makeAndModelBill.create({
            company,
            division,
            department,
            make_model,
            employee,
            approved_by,
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

        return res.status(200).json({valid: true, msg:"make and model bill has been created", data:modelBill});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong", error: err});
    }
}

const getMAndMBills = async(req, res) => {
    try{
        // const modelBills = await makeAndModelBill.find({});

        const modelBills = await makeAndModelBill.aggregate([
            {
              $lookup: {
                from: "makeandmodelmasters", // Replace with the actual collection name for AssetMaster
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
                make_model: { $arrayElemAt: ["$make_model.make_and_model_name", 0] },
                employee: { $arrayElemAt: ["$employee.emp_name", 0] },
                approved_by: { $arrayElemAt: ["$approved_by.emp_name", 0] },
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
        return res.status(200).json({valid: true, msg:"make and model bill has been fetched", data: modelBills, count: modelBills.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificMAndMBill = async(req, res) => {
    try{
      const mb_id = req.params.mb_id;

      const modelBill = await makeAndModelBill.aggregate([
          {
            $lookup: {
              from: "makeandmodelmasters", // Replace with the actual collection name for AssetMaster
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
          // {
          //   $match: {
          //     _id: mb_id
          //   }
          // },
          {
            $project: {
              created_date: 1,
              created_by: 1,
              updated_date: 1,
              updated_by: 1,
              make_model: { $arrayElemAt: ["$make_model.make_and_model_name", 0] },
              employee: { $arrayElemAt: ["$employee.emp_name", 0] },
              // employee: 1,
              approved_by: { $arrayElemAt: ["$approved_by.emp_name", 0] },
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

              rc_book_details: 1,
              insurance_details: 1,
              puc_details: 1,

              
              company: { $arrayElemAt: ["$company.company_name", 0] },
              division: { $arrayElemAt: ["$division.division_name", 0] },
              department: { $arrayElemAt: ["$department.department_name", 0] },
              // Add other fields as needed
            },
          },
        ]);

        const result = modelBill.filter((el) => {
          if(el._id.toString() === mb_id){
            return true
          }
          else{
            return false
          }
        })[0]
        return res.status(200).json({valid: true, msg:"specific model bill has been fetched dasd", data: result});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const getAllBillForSpecific = async(req, res) => {
    try{
        const mb_id = req.params.mb_id;

        const modelBills = await makeAndModelBill.aggregate([
            {
              $lookup: {
                from: "makeandmodelmasters", // Replace with the actual collection name for AssetMaster
                localField: "make_model",
                foreignField: "_id",
                as: "make_model",
              },
            },
            // {
            //   $lookup: {
            //     from: "employees", // Replace with the actual collection name for VendorMaster
            //     localField: "employee",
            //     foreignField: "_id",
            //     as: "employee",
            //   },
            // },
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
                make_model: { $arrayElemAt: ["$make_model.make_and_model_name", 0] },
                // employee: { $arrayElemAt: ["$employee.emp_name", 0] },
                employee: 1,
                approved_by: { $arrayElemAt: ["$approved_by.emp_name", 0] },
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

          const result = modelBills.filter((el) => {
            if(el.employee.toString() === mb_id){
                return true;
            }
            else{
                return false
            }

          })

          return res.status(200).json({valid: true, msg:"make and model bill has been fetched", data: result, count: result.length});


        
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const editMAndMBill = async(req, res) => {
    try{
        const mb_id = req.params.mb_id;
        const {make_model, employee, approved_by} = req.body;
        const {vehicle_no, purchase_date, issue_date, received_date, engine_no, chassis_no, remarks} = req.body;
        const {sale_date, sale_value, wdv_amount, sale_to} = req.body;
        const {payment_mode, payment_from_bank, cheque_date, cheque_no, cheque_to, transaction_date, transaction_no, transaction_status, payment_to_bank, amount} = req.body; 
        // const {rc_book_details, insurance_details, puc_details} = req.files;
        
        // const rc_book = await cloudinary.uploader.upload(rc_book_details.tempFilePath)
        // const insurance = await cloudinary.uploader.upload(insurance_details.tempFilePath)
        // const puc = await cloudinary.uploader.upload(puc_details.tempFilePath)

        const modelBill = await makeAndModelBill.findOne({_id: mb_id});
        // modelBill.company = company
        // modelBill.division = division
        // modelBill.department = department
        modelBill.make_model = make_model
        modelBill.employee = employee
        modelBill.approved_by = approved_by

        modelBill.vehicle_no = vehicle_no
        modelBill.purchase_date = new Date(purchase_date)
        modelBill.issue_date = new Date(issue_date)
        modelBill.received_date = new Date(received_date)
        modelBill.engine_no = engine_no
        modelBill.chassis_no = chassis_no
        modelBill.remarks = remarks


        modelBill.sale_date = new Date(sale_date)
        modelBill.sale_value = sale_value
        modelBill.wdv_amount = wdv_amount
        modelBill.sale_to = sale_to


        modelBill.payment_mode = payment_mode
        modelBill.payment_from_bank = payment_from_bank
        modelBill.cheque_date = new Date(cheque_date)
        modelBill.cheque_no = cheque_no
        modelBill.cheque_to = cheque_to
        modelBill.transaction_date = new Date(transaction_date)
        modelBill.transaction_no = transaction_no
        modelBill.transaction_status = transaction_status
        modelBill.payment_to_bank = payment_to_bank
        modelBill.amount = amount


        // modelBill.rc_book_details = rc_book.url
        // modelBill.insurance_details = insurance.url
        // modelBill.puc_details = puc.url

        modelBill.updated_date = Date.now();

        await modelBill.save();
        return res.status(200).json({valid: true, msg:"model bill has been updated", data:modelBill});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteMAndMBill = async(req, res) => {
    try{
        const mb_id = req.params.mb_id;
        await makeAndModelBill.findOneAndDelete({_id: mb_id});
        return res.status(200).json({valid: true, msg:"model bill has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createMAndMBill,
    getMAndMBills,
    editMAndMBill,
    getSpecificMAndMBill,
    deleteMAndMBill,
    getAllBillForSpecific
}