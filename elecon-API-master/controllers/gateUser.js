const Employee = require("../models/Employee");
const Visitor = require("../models/Visitor");




const getTodayVisitorForGateUser = async(req, res) => {
    try{
        const {entry_gate} = req.body;
        var start = new Date()
        start.setHours(0,0,0,0)
        var end = new Date()
        end.setHours(23, 59, 59, 999)
        console.log("here in gateuser today data");

        const visitors = await Visitor.find({
            $and: [
                {entry_gate: entry_gate},
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

const getInTimeVisitorForGateUser = async(req, res) => {
    try{
        const {entry_gate} = req.body;
        var start = new Date()
        start.setHours(0,0,0,0)
        var end = new Date()
        end.setHours(23, 59, 59, 999)

        const visitors = await Visitor.find({
            $and: [
                {entry_gate: entry_gate},
                {to_date: {$gte: start}},
                {from_date: {$lte: end}}
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

const getOutTimeVisitorForGateUser = async(req, res) => {
    try{
        const {entry_gate} = req.body;
        var start = new Date()
        start.setHours(0,0,0,0)
        var end = new Date()
        end.setHours(23, 59, 59, 999)

        const visitors = await Visitor.find({
            $and: [
                {entry_gate: entry_gate},
                {to_date: {$gte: start}},
                {from_date: {$lte: end}}
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










module.exports = {
    getTodayVisitorForGateUser,
    getInTimeVisitorForGateUser,
    getOutTimeVisitorForGateUser
}