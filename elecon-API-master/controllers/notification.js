const { default: mongoose } = require("mongoose");
const Notification = require("../models/Notification");



const createNotification = async(req, res) => {
    try{
        
        const {title, message} = req.body;
        const {sender_id, receiver_id} = req.body;
        const notification = await Notification.create({title, message, sender_id, receiver_id, created_date: new Date()})

        return res.status(200).json({valid: true, msg: "Notification has been created", data: notification});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }
}

const getNotification = async(req, res) => {
    try{
        const emp_id = req.params.emp_id;
        const notifications = await Notification.find({receiver_id: emp_id}).populate("sender_id");
        return res.status(200).json({valid: true, msg: "Notification has been created", data: notifications.reverse(), count: notifications.length});
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}

const getUnreadNotification = async(req, res) => { 
    try{
        const emp_id = req.params.emp_id;
        const notifications = await Notification.find({
            $and: [
                {receiver_id: emp_id},
                {is_read: false},
            ]
        }).populate("sender_id");
        return res.status(200).json({valid: true, msg: "Notification has been created", data: notifications.reverse(), count: notifications.length});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const getReadNotification = async(req, res) => { 
    try{
        const emp_id = req.params.emp_id;
        const notifications = await Notification.find({
            $and: [
                {receiver_id: emp_id},
                {is_read: true},
            ]
        }).populate("sender_id");
        return res.status(200).json({valid: true, msg: "Notification has been created", data: notifications.reverse(), count: notifications.length});

    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}


const readNotification = async(req, res) => {
    try{
        const n_id = req.params.n_id;
        const notification = await Notification.findOne({_id: n_id});
        notification.is_read = true;
        await notification.save()
        return res.status(200).json({valid: true, msg: "Notification read"});

        
    }
    catch(err){
        console.log("here in error", err);
        res.status(500).json({valid: false, msg:"something went wrong"});
    }

}














module.exports = {
    createNotification,
    getNotification,
    getUnreadNotification,
    getReadNotification,
    readNotification
}