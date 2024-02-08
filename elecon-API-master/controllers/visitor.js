const Accessories = require("../models/Accessories");
const Employee = require("../models/Employee");
const Visitor = require("../models/Visitor")

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
}



// this API is only used when employee will create the user 
const createVisitor = async(req, res) => {
    try{

        // const {acc_name, acc_type, model_no, is_returnable} = req.body;
        // const accessories = await Accessories.create({acc_name, acc_type, model_no, is_returnable})
        const {name, phone_no, email_id, gender, is_professional, guest_company, designation, id_proof, id_number, place, visit_type, purpose, entry_gate, appointment_half} = req.body;
        // insert created by and other fields
        const {emp_id, to_whom_id} = req.body; // actual emp_id --> _id

        // to_whom_id for created_by

        // console.log("here in backend id_proof", id_proof)


        // to_date and from date 
        var {to_date, from_date} = req.body; // format yyyy-mm-dd"
        const to_d = new Date(to_date)
        let curr_date = new Date()
        curr_date = new Date(formatDate(curr_date));
        
        
        
        if(from_date === ""){
            from_date = to_date;
        }
        
        const from_d = new Date(from_date);

        console.log("to date ", to_d);
        console.log("from date ", from_d);
        console.log("curr date ", curr_date);
        if(to_d >= curr_date && from_d >= curr_date){
            
            const visitor = await Visitor.create({name, phone_no, email_id, gender, is_professional, designation, id_proof, id_number, place, visit_type, purpose, entry_gate, appointment_half, guest_company, created_date: new Date(), created_by: emp_id, updated_date: new Date(), updated_by: emp_id, to_date: to_d, from_date: from_d, to_whom_id});
    
            const emp = await Employee.findOne({_id:emp_id});
            emp.visitors.push(visitor._id);
            await emp.save()
            res.status(200).json({valid: true, msg:"visitor has been created", visitor, emp});
        }
        else{
            throw new Error("please write valid date");
        }
        
    }   
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}


// this API will be used when gate user wants to add the accessoried for specific visitor
const addAccessories = async(req, res) => {
    try{
        const visitor_id = req.params.id;
        const {acc_name, acc_type, model_no, is_returnable} = req.body;

        console.log(visitor_id)
        const acc = await Accessories.create({acc_name, acc_type, model_no, is_returnable});
        

        const vis = await Visitor.findOne({_id: visitor_id});

        vis.accessories_id.push(acc._id);

        await vis.save();

        res.status(200).json({valid: true, msg:"Accessories has been updated", visitor: vis, accessories: acc});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const updateVisitor = async(req, res) => {
    try{
        const visitor_id = req.params.id;

        const {name, phone_no, email_id, gender, is_professional, guest_company, designation, id_proof, id_number, place, visit_type, purpose, entry_gate, appointment_half} = req.body;
        const {to_date, from_date } = req.body;
        const {emp_id, to_whom_id} = req.body;
        const to_d = ((to_date === "") ? "" : new Date(to_date))
        const from_d = ((from_date === "") ? "" : new Date(from_date))
        

        const vis = await Visitor.findOne({_id: visitor_id});
        vis.name = name;
        vis.phone_no = phone_no;
        vis.email_id = email_id;
        vis.gender = gender;
        vis.is_professional = is_professional;
        vis.designation = designation;
        vis.id_proof = id_proof;
        vis.id_number = id_number
        vis.guest_company = guest_company
        vis.place = place
        vis.visit_type = visit_type
        vis.purpose = purpose
        vis.entry_gate = entry_gate
        vis.appointment_half = appointment_half;
        if(to_d !== "")vis.to_date = to_d
        if(from_d !== "")vis.from_date = from_d
        // created_date: new Date(), created_by: to_whom_id, updated_date: new Date(), updated_by: to_whom_id, to_date: to_d, from_date: from_d, requisition_id
        vis.updated_date = new Date();
        vis.updated_by = emp_id
        await vis.save()

        res.status(200).json({valid: true, msg:"visitor has been updated", visitor: vis});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}


const getAllVisitor = async(req, res) => {
    try{
        const visitors = await Visitor.find({}, {in_time: 1, to_whom_id: 1});
        let c = 0;
        visitors.forEach((v) => {
            if(v.in_time !== null)c++;
        })
        res.status(200).json({valid: true, msg:"data has been fetched", data:visitors, count: visitors.length, intimec: c});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}


const getTodayVisitor = async(req, res) => {
    try{
        var start = new Date()
        start.setHours(0,0,0,0)
        var end = new Date()
        end.setHours(23, 59, 59, 999)

        const visitors = await Visitor.find({
            $and: [
                {to_date: {$gte: start}},
                {from_date: {$lte: end}}
            ]
        })
        res.status(200).json({valid: true, msg:"data has been fetched", data:visitors, count: visitors.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}






const getTodayVisitorForEmp = async(req, res) => {
    try{
        const emp_id = req.params.emp_id
        var start = new Date()
        start.setHours(0,0,0,0)
        var end = new Date()
        end.setHours(23, 59, 59, 999)

        console.log("start : ", start)
        console.log("end : ", end)

        var visitors = await Visitor.find({
            $and: [
                {to_whom_id: emp_id},
                {to_date: {$gte: start}},
                {from_date: {$gte: start}}
            ]
        })

        // visitors = visitors.filter((el) => {
            
        //     // console.log("here is the condition : ");
        //     // console.log(el.from_date)
        //     // console.log(end);
        //     // console.log((el.from_date <= end));
        //     // console.log(el.name);
        //     if(el.to_date >= start && el.from_date >= start){
        //         return true;
        //     }
        //     else{
        //         return false
        //     }

        // })
        console.log("here in today emp in : ", visitors);
        res.status(200).json({valid: true, msg:"data has been fetched", data:visitors, count: visitors.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}


const getInTimeVisitorForEmp = async(req, res) => {
    try{
        const emp_id = req.params.emp_id
        var start = new Date()
        start.setHours(0,0,0,0)
        var end = new Date()
        end.setHours(23, 59, 59, 999)

        const visitors = await Visitor.find({
            $and: [
                {to_whom_id: emp_id},
                {to_date: {$gte: start}},
                {from_date: {$gte: start}}
            ]
        })

        // got all visitors for today
        const curr_datetime = new Date()
        const inVisitors = visitors.filter((visitor) => {
            if(visitor.in_time && !visitor.out_time){
                return curr_datetime > visitor.in_time
            }
        })

        res.status(200).json({valid: true, msg:"data has been fetched", data:inVisitors, count: inVisitors.length});


    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}


const getOutTimeVisitorForEmp = async(req, res) => {
    try{
        const emp_id = req.params.emp_id
        var start = new Date()
        start.setHours(0,0,0,0)
        var end = new Date()
        end.setHours(23, 59, 59, 999)

        const visitors = await Visitor.find({
            $and: [
                {to_whom_id: emp_id},
                {to_date: {$gte: start}},
                {from_date: {$gte: start}}
            ]
        })

        // got all visitors for today
        const curr_datetime = new Date()
        const outVisitors = visitors.filter((visitor) => {
            if(visitor.in_time && visitor.out_time){
                return curr_datetime > visitor.out_time

            }
        })

        res.status(200).json({valid: true, msg:"data has been fetched", data:outVisitors, count: outVisitors.length});


    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}


const getRemainingVisitorForEmp = async(req, res) => {
    try{
        const emp_id = req.params.emp_id
        var start = new Date()
        start.setHours(0,0,0,0)
        var end = new Date()
        end.setHours(23, 59, 59, 999)

        const visitors = await Visitor.find({
            $and: [
                {to_whom_id: emp_id},
                {to_date: {$gte: start}},
                {from_date: {$gte: start}}
            ]
        })

        // got all visitors for today
        // const curr_datetime = new Date()
        const reVisitors = visitors.filter((visitor) => {
            if(!visitor.in_time && !visitor.out_time){
                return true
            }
        })

        res.status(200).json({valid: true, msg:"data has been fetched", data:reVisitors, count: reVisitors.length});


    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}


const inTime = async(req, res) => {
    try{
        const vis_id = req.params.id
        const emp = await Visitor.findOne({_id: vis_id});
        emp.in_time = new Date()

        await emp.save()

        res.status(200).json({valid: true, msg: "visitor has arrived", emp})
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg: "something went wrong"});
    }
}

const outTime = async(req, res) => {
    try{
        const vis_id = req.params.id
        const emp = await Visitor.findOne({_id: vis_id});
        if(emp.in_time){
            emp.out_time = new Date()
            await emp.save()
            res.status(200).json({valid: true, msg: "visitor has departed", emp})

        }
        else{
            res.status(404).json({valid: false, msg: "visitor never arrived"});
        }


    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg: "something went wrong"});
    }
}


const getAccessories = async(req, res) => {
    try{
        const visitorId = req.params.id;
        const acc = await Visitor.findOne({_id: visitorId});
        console.log("here in backend get acc");
        const allAcc = await Accessories.find({_id: {
            $in: acc.accessories_id
        }})

        console.log("after op");
        res.status(200).json({valid: true, msg: "acc have been fetched", data:allAcc});
        console.log("afteasdsadasdas");

    }
    catch(err){
        console.log("here in err")
        console.log(err)
        res.status(500).json({valid: false, msg: "something went wrong"});
    }
}


const deleteVisitor = async(req, res) => {
    try{
        const visitor_id = req.params.id;
        const visitor = await Visitor.findByIdAndDelete({_id: visitor_id});
        res.status(200).json({valid: true, msg: "visitor has been deleted"});
    }
    catch(err){
        res.status(500).json({valid: false, msg: "something went wrong"});
    }
}


const getVisitor = async(req, res) => {
    try{    
        const id = req.params.id
        const visitor = await Visitor.findOne({_id:id});
        res.status(200).json({valid: true, msg: "got visitor", data:visitor});
        

    }
    catch(err){
        res.status(500).json({valid: false, msg: "something went wrong"});
    }
}



const getVisitorForDate = async(req, res) => {
    try{
        const {date} = req.body;
        // console.log("date : ", date);
        // const gotDate = new Date(date);
        var start = new Date(date)
        start.setHours(0,0,0,0)
        var end = new Date(date)
        end.setHours(23, 59, 59, 999)
        console.log(start);
        console.log(end);
        const visitors = await Visitor.find({
            $and : [
                {to_date: {$gte: start}},
                {from_date: {$gte: start}}
            ]
        }).populate("to_whom_id");
        res.status(200).json({valid: true, msg: "got visitor", data: visitors, count: visitors.length});


    }
    catch(err){
        res.status(500).json({valid: false, msg: "something went wrong"});
    }

}


const getVisitorCountMonthVise = async(req, res) => {
    
    try{
        // const result = await Visitor.aggregate([
        //     {
        //       $match: {
        //         from_date: { $exists: true },
        //         to_date: { $exists: true },
        //       },
        //     },
        //     {
        //       $group: {
        //         _id: {
        //           year: { $year: "$from_date" },
        //           month: { $month: "$from_date" },
        //         },
        //         count: { $sum: 1 },
        //       },
        //     },
        //   ]);
        const currentYearStartDate = new Date();
        currentYearStartDate.setMonth(currentYearStartDate.getMonth() - 11);
        currentYearStartDate.setDate(1); // Set the day to 1st of the month

        const allMonthsVisitorCounts = await Visitor.aggregate([
            {
                $match: {
                    in_time: {
                        $gte: currentYearStartDate, // Start date for the first day of the current 12 months
                        $lte: new Date() // Current date
                    }
                }
            },
            {
                $group: {
                    _id: {
                        to_whom_id: "$to_whom_id",
                        month: { $month: "$in_time" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.to_whom_id": 1, "_id.month": 1 }
            },
            {
                $group: {
                    _id: "$_id.to_whom_id",
                    counts: {
                        $push: {
                            month: "$_id.month",
                            count: "$count"
                        }
                    }
                }
            }
        ]);
        
        // Create an object to hold the counts for each to_whom_id
        const t = await Visitor.find({}, {to_whom_id:1, _id:0}).populate("to_whom_id", "emp_name");
        const emps = {}
        t.forEach((el) => {
            if(!emps[el.to_whom_id._id]){
                emps[el.to_whom_id._id] = el.to_whom_id.emp_name
            }
        })

        const countsArray = Array.from({ length: 12 }, () => 0);
        const countsByToWhomId = {};
        
        // Initialize the counts for each to_whom_id with arrays of 12 zeros
        allMonthsVisitorCounts.forEach((item) => {
            const toWhomId = emps[item._id.toString()]; // Convert ObjectId to string
            const monthIndex = item.counts[0].month - 1; // Adjust month index to be zero-based
            countsArray[monthIndex] += item.counts[0].count;
            if (!countsByToWhomId[toWhomId]) {
                countsByToWhomId[toWhomId] = Array.from({ length: 12 }, () => 0);
            }
            countsByToWhomId[toWhomId][item.counts[0].month - 1] += item.counts[0].count;
        });

        countsByToWhomId["all"] = countsArray

        const finalResult = []
        for(key in countsByToWhomId){
            finalResult.push({
                year: key,
                data: [{
                    name:"Visitor Count",
                    data: countsByToWhomId[key]
                }]
            })
        }

        
        
        
        return res.status(200).json({valid: true, msg: "got visitor", data: finalResult, t: allMonthsVisitorCounts});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg: "something went wrong"});
    }
}



const getCountForEmp = async(req, res) => {
    try{
        const to_whom_id = req.params.to_whom_id;
        const fromDate = new Date();
        const toDate = new Date()
        fromDate.setMonth(fromDate.getMonth() - 1)
        const visitors = await Visitor.find({$and:[
            {to_whom_id: to_whom_id},
            {from_date: {$gte: fromDate}},
            {toDate: {$lte: toDate}},
        ]});

        let yetToVisit = 0
        let visitSoFar = 0

        visitors.forEach((visitor) => {
            if(visitor.in_time !== null && visitor.out_time !== null){
                visitSoFar += 1;
            }
            else if(visitor.in_time === null && visitor.out_time === null){
                yetToVisit += 1;
            }
        })
        
        

        return res.status(200).json({valid: true, msg: "got data", data: {
            yetToVisit,
            visitSoFar,
            totalCount: visitors.length
        }});
        // return res.status(200).json({valid: true, msg: "got data", data: visitors});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg: "something went wrong"});
    }

}







module.exports = {
    createVisitor,
    addAccessories,
    updateVisitor,
    getAllVisitor,
    getTodayVisitor,
    getTodayVisitorForEmp,
    getInTimeVisitorForEmp,
    getOutTimeVisitorForEmp,
    inTime,
    outTime,
    getRemainingVisitorForEmp,
    getAccessories,
    deleteVisitor,
    getVisitor,
    getVisitorForDate,
    getVisitorCountMonthVise,
    getCountForEmp
}