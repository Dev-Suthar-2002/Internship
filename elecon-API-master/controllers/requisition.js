const { default: mongoose } = require("mongoose");
const Requisition = require("../models/Requisition");







const createRequisition = async(req, res) => {
    try{
        const {company, division, department, employee} = req.body;
        const {title, activity, problem_desc} = req.body;
        const requisition = await Requisition.create({company, division, department, employee, title, activity, problem_desc, requisition_date: Date.now(), created_date: Date.now(), created_by:"admin", updated_by:"admin", updated_date:Date.now()})

        return res.status(200).json({valid: true, msg:"requisition has been created", data: requisition});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}


const getAllRequisitions = async(req, res) => {
    try{
        // const requisitions = await Requisition.find({});
        const requisitions = await Requisition.aggregate([
            
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
                title: 1,
                activity: 1,
                problem_desc: 1,
                requisition_date: 1,
                status: 1,
                is_escalated: 1,
                is_resend: 1,
                approval_remarks: 1,
                closure_remarks: 1,
                company: { $arrayElemAt: ["$company.company_name", 0] },
                emp_name: { $arrayElemAt: ["$employee.emp_name", 0] },
                emp_email: { $arrayElemAt: ["$employee.email", 0] },
                division: { $arrayElemAt: ["$division.division_name", 0] },
                department: { $arrayElemAt: ["$department.department_name", 0] },
                // Add other fields as needed
              },
            },
          ]);

          return res.status(200).json({valid: true, msg:"requisition has been fetched", data: requisitions});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}


const getAllRequisitionsForSpecific = async(req, res) => {
    try{
        // const requisitions = await Requisition.find({});
        const {emp_id} = req.params
        const requisitions = await Requisition.aggregate([
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
                title: 1,
                activity: 1,
                problem_desc: 1,
                requisition_date: 1,
                employee: 1,
                status: 1,
                is_escalated: 1,
                is_resend: 1,

                company: { $arrayElemAt: ["$company.company_name", 0] },
                division: { $arrayElemAt: ["$division.division_name", 0] },
                department: { $arrayElemAt: ["$department.department_name", 0] },
                // Add other fields as needed
                },
            },
          ]);

          const result = requisitions.filter((el) => {
            if(el.employee.toString() === emp_id){
                return true
            }
            else{
                return false;
            }

          })

          return res.status(200).json({valid: true, msg:"requisition has been fetched", data: result.reverse()});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}



const editRequisition = async(req, res) => {
    try{
        const {r_id} = req.params;
        const {company, division, department, employee} = req.body;
        const {title, activity, problem_desc, requisition_date} = req.body;
        
        const requisition = await Requisition.findOne({_id: r_id})
        requisition.company = company
        requisition.division = division
        requisition.department = department
        requisition.employee = employee
        requisition.title = title
        requisition.activity = activity
        requisition.problem_desc = problem_desc
        requisition.requisition_date = new Date(requisition_date)
        requisition.updated_date = Date.now()

        await requisition.save()
        return res.status(200).json({valid: true, msg:"requisition has been updated", data: requisition});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});

    }
}


const changeStatus = async(req, res) => {
    try{
      const r_id = req.params.r_id;
      const {status} = req.body;
      const r = await Requisition.findOne({_id: r_id})
      r.status = status;
      await r.save()
      return res.status(200).json({valid: true, msg:"requisition has been updated", data: r});

    }
    catch(err){
      console.log(err);
      res.status(500).json({valid: false, msg:"something went wrong"});
    }
}




const escalateRequisition = async(req, res) => {
  try{
    const r_id = req.params.r_id;
    const r = await Requisition.findOne({_id: r_id})
    r.requisition_date = Date.now()
    r.updated_date = Date.now()
    r.created_date = Date.now()
    r.is_escalated = true
    await r.save()
    return res.status(200).json({valid: true, msg:"requisition has been escalate", data: r});
  }
  catch(err){
    console.log(err);
    res.status(500).json({valid: false, msg:"something went wrong"});
  }
}

const resendRequisition = async(req, res) => {
  try{
    const r_id = req.params.r_id
    // console.log(typeof r_id);
    const r = await Requisition.findOne({_id: r_id})
    r.is_resend = true;
    r.requisition_date = Date.now()
    r.created_date = Date.now()
    r.updated_date = Date.now()
    await r.save();
    return res.status(200).json({valid: true, msg:"requisition has been resend"});

  }
  catch(err){
    console.log(err);
    res.status(500).json({valid: false, msg:"something went wrong"});
  }
}

const remindRequisition = async(req, res) => {
  try{
      const r_id = req.params.r_id
      const r = await Requisition.findOne({_id: r_id}).populate({
          path:"employee",
          populate:{
              path:"hod_id"
          }
      }) 
      const fromEmail = r?.employee?.email
      const toEmail = r?.employee.hod_id?.email

      const sendMail = require("../services/emailService")
      sendMail({
          from: fromEmail,
          // to: visitor_email,
          to: toEmail,
          subject: 'Reminder Of My Requisition',
          text: `Reminder Of My Requisition`,
          html: require('../services/emailTemplate')({
                      msg:`title is ${r.title} \n message is ${r.problem_desc}`

                })
        }).then(() => {
          return res.status(201).json({"valid": true, "msg": "email has been send to HOD For Reminder"});
          
        }).catch(err => {
          return res.status(500).json({error: 'Error in email sending.'});
      });
  }
  catch(err){
      console.log(err);
      res.status(500).json({valid: false, msg:"somthing went wrong"});
  }

}


const deleteRequisition = async(req, res) => {
    try{
        const {r_id} = req.params;
        await Requisition.findByIdAndDelete({_id: r_id});
        return res.status(200).json({valid: true, msg:"requisition has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}


const getAllEscalatedRequisitions = async(req, res) => {
  try{
    const requisitions = await Requisition.aggregate([
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
        $lookup: {
          from: "employees", // Replace with the actual collection name for Department
          localField: "employee",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $match: {
          is_escalated: true
        }
      },
      {
        $project: {
          created_date: 1,
          created_by: 1,
          updated_date: 1,
          updated_by: 1,
          title: 1,
          activity: 1,
          problem_desc: 1,
          requisition_date: 1,
          // employee: 1,
          status: 1,
          is_escalated: 1,
          is_resend: 1,
          company: { $arrayElemAt: ["$company.company_name", 0] },
          division: { $arrayElemAt: ["$division.division_name", 0] },
          department: { $arrayElemAt: ["$department.department_name", 0] },
          emp_name: { $arrayElemAt: ["$employee.emp_name", 0] },
          emp_email: { $arrayElemAt: ["$employee.email", 0] },
           
          // Add other fields as needed
          },
      },
    ]);
    return res.status(200).json({valid: true, msg:"Escalated requisition has been fetched", data: requisitions});
  }
  catch(err){
    console.log(err);
    res.status(500).json({valid: false, msg:"something went wrong"});
  }
}


const getRequisitionForHod = async(req, res) => {
  try{
    // console.log(req.params)
    const hod_id = req.params.hod_id;
    const r = await Requisition.find({}).populate("employee", "emp_name hod_id email").populate("company", "company_name").populate("division", "division_name").populate("department", "department_name");
    // console.log(r);

    const all_r = r.filter((el) => {
      if((el.employee.hod_id).toString() === hod_id && el.is_escalated === false){
        return true
      }
      else{
        return false
      }
    })

    

    

    return res.status(200).json({valid: true, msg: "got all data", data: all_r.reverse(), count: all_r.length});

  } 
  catch(err){
    console.log(err);
    res.status(500).json({valid: false, msg:"something went wrong"});
  }
}


const approveRequisition = async(req, res) => {
  try{
    const r_id = req.params.r_id;
    const {remarks} = req.body;
    const r = await Requisition.findOne({_id: r_id});
    r.approval_remarks = remarks;
    r.status = "approved"
    r.updated_date = Date.now()
    await r.save()
    return res.status(200).json({valid: true, msg: "Requisition Approved"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({valid: false, msg:"something went wrong"});
  }
}


const closeRequisition = async(req, res) => {
  try{
    const r_id = req.params.r_id;
    const {remarks} = req.body;
    console.log("here in close remarks");
    const r = await Requisition.findOne({_id: r_id});
    r.closure_remarks = remarks;
    r.status = "declined"
    r.updated_date = Date.now()
    await r.save()
    return res.status(200).json({valid: true, msg: "Requisition Declined"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({valid: false, msg:"something went wrong"});
  }
}


const getSpecificRequisition = async(req, res) => {
  try{  
    const r_id = req.params.r_id;
    const requisitions = await Requisition.aggregate([
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
        $lookup: {
          from: "employees", // Replace with the actual collection name for Department
          localField: "employee",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $project: {
          title: 1,
          activity: 1,
          problem_desc: 1,
          requisition_date: 1,
          // employee: 1,
          status: 1,
          is_escalated: 1,
          is_resend: 1,
          approval_remarks: 1,
          closure_remarks: 1,
          company: { $arrayElemAt: ["$company.company_name", 0] },
          division: { $arrayElemAt: ["$division.division_name", 0] },
          department: { $arrayElemAt: ["$department.department_name", 0] },
          emp_name: { $arrayElemAt: ["$employee.emp_name", 0] },
          emp_email: { $arrayElemAt: ["$employee.email", 0] },
           
          // Add other fields as needed
          },
      },
    ]);

    const result = requisitions.filter((el) => {
      if(el._id.toString() === r_id){
        return true
      }
      else{
        return false
      }
    })
    return res.status(200).json({valid: true, msg:"Escalated requisition has been fetched", data: result[0]});


  }
  catch(err){
    console.log(err);
    res.status(500).json({valid: false, msg:"something went wrong"});

  }
}


module.exports = {
    createRequisition,
    getAllRequisitions,
    getAllRequisitionsForSpecific,
    editRequisition,
    deleteRequisition,
    changeStatus,
    escalateRequisition,
    resendRequisition,
    remindRequisition,
    getAllEscalatedRequisitions,
    getRequisitionForHod,
    approveRequisition,
    closeRequisition,
    getSpecificRequisition
}