const Employee = require("../models/Employee")
const jwt = require("jsonwebtoken")


const login = async(req, res) => {
    try{
        const {username, password} = req.body;
        
        if(username === "admin" && password === "admin"){
            const token = jwt.sign({ role: "admin", id: null},
            process.env.JWT_ACCESS_TOKEN_SECRET, {
                expiresIn:"7d"
            })
            
            console.log("cookie set");
            return res.status(200).json({valid:true, msg: "user has been found", user: {role:"admin"}, accessToken: token})
        }
        
        const emp = await Employee.findOne({emp_name: username});
        if(emp?.password === password){
            
            const token = jwt.sign({ role: emp.role, id: emp._id},
                process.env.JWT_ACCESS_TOKEN_SECRET, {
                    expiresIn: "7d"
                })

            // res.cookie("token", token, {
            //     expires: new Date(Date.now() + ( 30 * 24 * 60 * 60 * 1000)), // ms
            //     httpOnly: false
            // })
            console.log("cookie set");
            res.status(200).json({valid:true, msg: "user has been found", user: emp, accessToken: token})
        }
        else{
            res.status(500).json({valid: false, msg: "user does not exist"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({valid: false, msg: "user does not exist"});
    }
}


module.exports = {
    login
}