const { default: mongoose, trusted } = require("mongoose");
const SimCardBill = require("../models/SimCardBill");


// const dateInPast = (firstDate, secondDate) => {
//     if(firstDate.setHours(0, 0, 0, 0) < secondDate.setHours(0, 0, 0, 0)){
//         return true
//     }
//     else{
//         return false
//     }
// }


const createSimCardBill = async(req, res) => {
    try{    

        const {company, division, department, employee, approved_by} = req.body;
        const {service_provider, requisition_date, tarriff_plan_no, mobile_no, data_card_no, issue_date_simcard, issue_date_datacard, amount} = req.body;

        const simCardBill = await SimCardBill.create({company, division, department, employee, approved_by, service_provider, requisition_date, issue_date_simcard: new Date(issue_date_simcard), issue_date_datacard: new Date(issue_date_datacard), tarriff_plan_no, mobile_no, data_card_no, amount, created_by:"admin", created_date: Date.now(), updated_by: "admin", updated_date: Date.now()});
        return res.status(200).json({valid: true, msg:"sim card bill has been created", data: simCardBill});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSimCardBills = async(req, res) => {
    try{
        // const simCardBills = await SimCardBill.find({});
        const simCardBills = await SimCardBill.aggregate([
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
            // from here 
            {
                $lookup: {
                    from: "employees", // Assuming the name of the department collection is "departments"
                    localField: "employee",
                    foreignField: "_id",
                    as: "employee"
                }
            },
            {
                $unwind: "$employee" // Convert the "department" array to an object
            },
            {
                $lookup: {
                    from: "employees", // Assuming the name of the department collection is "departments"
                    localField: "approved_by",
                    foreignField: "_id",
                    as: "approved"
                }
            },
            {
                $unwind: "$approved_by" // Convert the "department" array to an object
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
                    service_provider: 1,
                    requisition_date: 1,
                    tarriff_plan_no: 1,
                    mobile_no: 1,
                    data_card_no: 1,
                    issue_date_simcard: 1,
                    issue_date_datacard: 1,
                    amount: 1,
                    company: "$company.company_name", // Extract company name as a string
                    division: "$division.division_name",
                    department: "$department.department_name",
                    employee: "$employee.emp_name",
                    approved_by: "$approved.emp_name",
                }
            }
        ])
        return res.status(200).json({valid: true, msg:"sim card bill has been fetched", data: simCardBills, count: simCardBills.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getSpecificSimCardBill = async(req, res) => {
    try{
        const scb_id = req.params.scb_id;
        // const simCardBill = await SimCardBill.findOne({_id: scb_id}).populate("company", "company_name").populate("division", "division_name").populate("department", "department_name").populate("employee", "emp_name").populate("approved_by", "emp_name");
        const simCardBill = await SimCardBill.aggregate([
            
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
                employee: { $arrayElemAt: ["$employee.emp_name", 0] },
                approved_by: { $arrayElemAt: ["$approved_by.emp_name", 0] },
                service_provider: 1,
                requisition_date: 1,
                tarriff_plan_no: 1,
                mobile_no: 1,
                data_card_no: 1,
                issue_date_simcard: 1,
                issue_date_datacard: 1,
                amount: 1,
                
                
                
                company: { $arrayElemAt: ["$company.company_name", 0] },
                division: { $arrayElemAt: ["$division.division_name", 0] },
                department: { $arrayElemAt: ["$department.department_name", 0] },
                // Add other fields as needed
              },
            },
          ]);

          const result = simCardBill.filter((el) => {
            if(el._id.toString() === scb_id){
                return true
            }
            else{
                return false
            }
          })[0]
        return res.status(200).json({valid: true, msg:"specific sim card bill has been fetched", data: result});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const editSimCardBill = async(req, res) => {
    try{
        const scb_id = req.params.scb_id;
        // const {company, division, department, employee, approved_by} = req.body;
        const {service_provider, requisition_date, tarriff_plan_no, mobile_no, data_card_no, issue_date_simcard, issue_date_datacard, amount} = req.body;
        const simCardBill = await SimCardBill.findOne({_id: scb_id});


        simCardBill.service_provider = service_provider
        simCardBill.requisition_date = new Date(requisition_date)
        simCardBill.tarriff_plan_no = tarriff_plan_no
        simCardBill.mobile_no = mobile_no
        simCardBill.data_card_no = data_card_no
        simCardBill.issue_date_simcard = new Date(issue_date_simcard)
        simCardBill.issue_date_datacard = new Date(issue_date_datacard)

        simCardBill.amount = amount
        simCardBill.updated_date = Date.now()
        

        await simCardBill.save();
        return res.status(200).json({valid: true, msg:"sim card bill has been updated", data:simCardBill});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const deleteSimCardBill = async(req, res) => {
    try{
        const scb_id = req.params.scb_id;
        await SimCardBill.findOneAndDelete({_id: scb_id});
        return res.status(200).json({valid: true, msg:"sim card bill has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


module.exports = {
    createSimCardBill,
    getSimCardBills,
    getSpecificSimCardBill,
    editSimCardBill,
    deleteSimCardBill
}