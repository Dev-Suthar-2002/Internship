const { default: mongoose } = require("mongoose");
const Grievance = require("../models/Grievance");
const Employee = require("../models/Employee");


const createGrievance = async(req, res) => {
    try{
        const emp_id = req.params.emp_id;
        const {title, message, grievance_type} = req.body;
        const grievance = await Grievance.create({title, message, grievance_type, by_whom_id: emp_id, grievance_date: new Date(), created_by: "employee", created_date: Date.now(), updated_by: "employee", updated_date: Date.now()});

        return res.status(200).json({valid: true, msg: "Grievance has been created", data: grievance});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const getAllGrievance = async(req, res) => {
    try{
        const result = await Grievance.find({}).populate("by_whom_id");
        return res.status(200).json({valid: true, msg: "all grievances has been fetched", data: result.reverse(), count: result.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong asd"});
    }
}


const getAllGrievanceForEmp = async(req, res) => {
    try{
        const emp_id = req.params.emp_id
        const result = await Grievance.find({by_whom_id: emp_id});
        console.log("this API called ", result);
        return res.status(200).json({valid: true, msg: "all grievances has been fetched", data: result.reverse(), count: result.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }

}


const updateGrievance = async(req, res) => {
    try{
        const g_id = req.params.g_id;
        const {title, message, grievance_type} = req.body;
        const g = await Grievance.findOne({_id: g_id});
        g.title = title;
        g.message = message;
        g.grievance_type = grievance_type
        await g.save()
        return res.status(200).json({valid: true, msg: "grievance has been updated", data: g});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const updateStatus = async(req, res) => {
    try{
        const g_id = req.params.g_id;
        const {status} = req.body;
        const g = await Grievance.findOne({_id: g_id});
        g.status = status;
        await g.save()
        return res.status(200).json({valid: true, msg: "status has been updated", data: g});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


// new controllers 


const approveGrievance = async(req, res) => {
    try{
        const g_id = req.params.g_id;
        const {remarks} = req.body;
        const g = await Grievance.findOne({_id: g_id});
        g.status = "approved"
        g.approval_remarks = remarks
        g.updated_date = Date.now()
        await g.save()
        return res.status(200).json({valid: true, msg: "Grievance Approved"});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});

    }
}

const closeGrievance = async(req, res) => {
    try{
        const g_id = req.params.g_id;
        const {remarks} = req.body;
        const g = await Grievance.findOne({_id: g_id});
        g.status = "declined"
        g.approval_remarks = remarks
        g.updated_date = Date.now()
        await g.save()
        return res.status(200).json({valid: true, msg: "Grievance Declined"});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});

    }
}


const deleteGrievance = async(req, res) => {
    try{
        const g_id = req.params.g_id;
        await Grievance.findOneAndDelete({_id: g_id});
        return res.status(200).json({valid: true, msg: "Grievance has been deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const getAllGrievanceForHOD = async(req, res) => {
    try{
        const hod_id = req.params.hod_id
        console.log(hod_id);
        const gs = await Grievance.find({}).populate("by_whom_id");
        console.log("gs is : ", gs)
        const allG = gs.filter((el) => {
            if((el.by_whom_id.hod_id).toString() === hod_id && el.is_escalated === false){
                return true;
            }
            else{
                return false;
            }
        })
        return res.status(200).json({valid: true, msg: "got all data", data: allG.reverse(), count: allG.length});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }

}


const getSpecificGrievance = async(req, res) => {
    try{

        const g_id = req.params.g_id;
        const result = await Grievance.findOne({_id:g_id}).populate("by_whom_id");
        return res.status(200).json({valid: true, msg: "got data", data: result});


    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }

}


const countOfAllGrievance = async(req, res) => {
    try{
        const result = await Grievance.aggregate([
            {
                $group : {
                    _id: "$status",
                    count: {$sum: 1}
                }
            }
        ])

        return res.status(200).json({valid: true, msg: "got data", data: result});

        
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const countOfEmpGrievance = async(req, res) => {
    try{
        const result = await Grievance.find({}).populate("by_whom_id");

        

        let mp = new Map();
        result.forEach((el) => {
            const temp = el?.by_whom_id?.emp_name
            if(mp.has(temp)){
                mp.set(temp, mp.get(temp) + 1)
            }
            else{
                mp.set(temp, 1);
            }
        })

        const emps = await Employee.find({role: "employee"});

        

        const ans = emps.map((el) => {
            if(mp.has(el?.emp_name)){
                return {label: el?.emp_name, value: mp.get(el?.emp_name)};
            }
            else{
                return {label: el?.emp_name, value: 0};
            }
        })


        return res.status(200).json({valid: true, msg: "got data", data: ans});
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }

}


const resolvedAnalysis = async(req, res) => {
    try{
        const all = await Grievance.find({});
        
        const total = all.length;
        const resolvedCount = all.reduce((total, el) => {
            if(el?.status !== "pending"){
                return total + 1;
            }
            else{
                return total + 0;
            }
        }, 0)

        const resolvedPercentage = parseInt((resolvedCount/total)*100, 10);
        return res.status(200).json({valid: true, msg: "got data", data: {total, resolvedCount, resolvedPercentage : parseInt(resolvedPercentage, 10), pendingCount: total - resolvedCount}});



    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }

}


const getDataForActivityGrievance = async(req, res) => {
    try{
        const result = await Grievance.aggregate([
            {
              $group: {
                _id: {
                  by_whom_id: "$by_whom_id", // Group by the employee who submitted the grievance
                  status: "$status" // Group by the grievance status
                },
                count: { $sum: 1 } // Count the number of grievances for each combination of to_whom_id and status
              }
            }

        ])

        let mp = new Map();
        // const generatedData = [];
        result.forEach((el) => {
            console.log(el);
            // console.log(toString(el.to_whom_id._id));
            mp.set(`${el._id.by_whom_id.toString()} ${el._id.status}`,  el.count)

        })

        console.log(mp);
        const emps = await Employee.find({});
        const t = new mongoose.Types.ObjectId("64f5a2daecd3be7fcf407a0d")
        console.log(t)
        console.log("here in dasdas", mp.get(`64f5a2daecd3be7fcf407a0d declined`));
        
        const ans = emps.map((emp) => { 
            let p = 0
            let a = 0
            let d = 0
            if(mp.has(`${emp._id} pending`)){
                p = mp.get(`${emp._id} pending`)
            }
            if(mp.has(`${emp._id} approved`)){
                a = mp.get(`${emp._id} approved`)
            }
            if(mp.has(`${emp._id} declined`)){
                d = mp.get(`${emp._id} declined`)
            }

            return {name: emp.emp_name, data: [p, a, d], role: emp.role};
        })

        const labels = []
        const pending = []
        const declined = []
        const approved = []
        const res1 = ans.filter((el)=> {
            if(el.role === "employee"){
                labels.push(el.name);
                pending.push(el.data[0])
                approved.push(el.data[1])
                declined.push(el.data[2])
                return true;
            }
        }) 

        const generatedData = [
            {name: "Pending", data: pending},
            {name: "Approved", data: approved},
            {name: "Declined", data: declined},
        ]

        return res.status(200).json({valid: true, msg: "got data", data: generatedData, res1, labels});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}



const getCountOfGrievanceOfEmp = async(req, res) => {
    try{
        const emp_id = req.params.emp_id;
        const all = await Grievance.find({by_whom_id: emp_id});
        let pendingCount = 0;
        let approvedCount = 0;
        let declinedCount = 0;
        all.forEach((el) => {
            if(el.status === "pending"){
                pendingCount += 1;
            }
            else if(el.status === "declined"){
                declinedCount += 1;
            }
            else{
                approvedCount += 1;
            }
        })

        const pendingPer = parseInt((pendingCount/all.length)*100, 10);
        const approvedPer = parseInt((approvedCount/all.length)*100, 10);
        const declinedPer = parseInt((declinedCount/all.length)*100, 10);

        return res.status(200).json({valid: true, msg: "got data", data: {
            pendingCount,
            approvedCount,
            declinedCount,
            pendingPer,
            approvedPer,
            declinedPer
        }});


    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const getCountOfGrievanceOfHOD = async(req, res) => {
    try{
        const emp_id = req.params.emp_id;
        const gs = await Grievance.find({}).populate("by_whom_id");
        console.log("gs is : ", gs)
        const all = gs.filter((el) => {
            if((el.by_whom_id.hod_id).toString() === emp_id){
                return true;
            }
            else{
                return false;
            }
        })
        let pendingCount = 0;
        let approvedCount = 0;
        let declinedCount = 0;
        all.forEach((el) => {
            if(el.status === "pending"){
                pendingCount += 1;
            }
            else if(el.status === "declined"){
                declinedCount += 1;
            }
            else{
                approvedCount += 1;
            }
        })

        const pendingPer = parseInt((pendingCount/all.length)*100, 10);
        const approvedPer = parseInt((approvedCount/all.length)*100, 10);
        const declinedPer = parseInt((declinedCount/all.length)*100, 10);

        return res.status(200).json({valid: true, msg: "got data", data: {
            pendingCount,
            approvedCount,
            declinedCount,
            pendingPer,
            approvedPer,
            declinedPer
        }});


    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const getPrintData = async(req, res) => {
    try{
        const result = await Grievance.find({}).populate({
            path:"by_whom_id",
            populate:{
                path:"hod_id"
            }
        }) 

        return res.status(200).json({valid: true, msg: "got data", data: result})
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const resendGrievance = async(req, res) => {
    try{
        const g_id = req.params.g_id;
        const g = await Grievance.findOne({_id: g_id});
        g.grievance_date = new Date();
        g.is_resend = true
        g.updated_date = Date.now()

        await g.save()
        return res.status(200).json({valid: true, msg: "resend the grievance"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}

const remindGrievance = async(req, res) => {
    try{
        const g_id = req.params.g_id
        const g = await Grievance.findOne({_id: g_id}).populate({
            path:"by_whom_id",
            populate:{
                path:"hod_id"
            }
        }) 
        const fromEmail = g?.by_whom_id?.email
        const toEmail = g?.by_whom_id.hod_id?.email

        const sendMail = require("../services/emailService")
        sendMail({
            from: fromEmail,
            // to: visitor_email,
            to: toEmail,
            subject: 'Reminder Of My Grievance',
            text: `Reminder Of My Grievance`,
            html: require('../services/emailTemplate')({
                        msg:`title is ${g.title} \n message is ${g.message}`

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


const escalateGrievance = async(req, res) => {
    try{
        const g_id = req.params.g_id
        const {remarks} = req.body;
        const g = await Grievance.findOne({_id: g_id}) 
        g.grievance_date = new Date()
        g.is_escalated = true;
        g.updated_date = Date.now()
        await g.save()
        return res.status(201).json({"valid": true, "msg": "Grievance has been escalated"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"somthing went wrong"});
    }
}


const getAllEscalatedGrievances = async(req, res) => {
    try{
        const grievances = await Grievance.aggregate([
            {
              $lookup: {
                from: "employees", // Replace with the actual collection name for Department
                localField: "by_whom_id",
                foreignField: "_id",
                as: "by_whom_id",
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
                message: 1,
                grievance_type: 1,
                grievance_date: 1,
                // employee: 1,
                status: 1,
                is_escalated: 1,
                is_resend: 1,
                approval_remarks: 1,
                closure_remarks: 1,
                emp_name: { $arrayElemAt: ["$by_whom_id.emp_name", 0] },
                emp_email: { $arrayElemAt: ["$by_whom_id.email", 0] },
                 
                // Add other fields as needed
                },
            },
          ]);
          return res.status(200).json({valid: true, msg:"Escalated grievances has been fetched", data: grievances.reverse()});
        }
        catch(err){
            console.log(err);
            res.status(500).json({valid: false, msg:"somthing went wrong"});
        }
    
    
}

module.exports = {
    createGrievance,
    getAllGrievanceForEmp,
    getAllGrievance,
    updateGrievance,
    updateStatus,
    deleteGrievance,
    getAllGrievanceForHOD,
    getSpecificGrievance,
    countOfAllGrievance,
    countOfEmpGrievance,
    resolvedAnalysis,
    getDataForActivityGrievance,
    getCountOfGrievanceOfEmp,
    getCountOfGrievanceOfHOD,
    getPrintData,
    resendGrievance,
    remindGrievance,
    escalateGrievance,
    approveGrievance,
    closeGrievance,
    getAllEscalatedGrievances
}