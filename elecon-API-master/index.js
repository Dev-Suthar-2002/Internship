const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload")

const connectDB = require("./db/connect");
const PORT = 5000 || process.env.PORT;





const corsOptions = {
  // origin: process.env.ALLOWED_CLIENTS.split(',')
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
// console.log(corsOptions.origin);

app.use(fileUpload({
  useTempFiles: true
}))
app.use(cors(corsOptions));
app.use(cookieParser());

const employee = require("./routes/employee");
const admin = require("./routes/admin");
const visitor = require("./routes/visitor")
const auth = require("./routes/auth");
const gateUser = require("./routes/gateUser");
const grievance = require("./routes/grievance");
const notification = require("./routes/notification")
const company = require("./routes/company");
const division = require("./routes/division")
const department = require("./routes/department")
const sub_department = require("./routes/subdepartment");


// master 

const vendor = require("./routes/vendor");
const hotel = require("./routes/hotelMaster");
const asset = require("./routes/assetMaster");
const vehicle = require("./routes/vehicleMaster");
const makeAndModel = require("./routes/makeAndModelMaster");
const location = require("./routes/locationMaster");
const workType = require("./routes/workTypeMaster")
const driver = require("./routes/driverMaster");



app.use(express.json({limit: "100mb"}));


//routes
app.use("/api/v1/employee", employee);
app.use("/api/v1/admin", admin);
app.use("/api/v1/visitor", visitor);
app.use("/api/v1/auth", auth);
app.use("/api/v1/gateUser", gateUser);
app.use("/api/v1/grievance", grievance);
app.use("/api/v1/notification", notification);
app.use("/api/v1/company", company);
app.use("/api/v1/division", division);
app.use("/api/v1/department", department);
app.use("/api/v1/sub_department", sub_department);


// master routes
app.use("/api/v1/vendor", vendor);
app.use("/api/v1/hotel", hotel);
app.use("/api/v1/asset", asset);
app.use("/api/v1/makeAndModel", makeAndModel);
app.use("/api/v1/vehicle", vehicle);
app.use("/api/v1/location", location);
app.use("/api/v1/workType", workType);
app.use("/api/v1/driver", driver);


// bill imports 

const HotelBill = require("./routes/HotelBill")
const SimCardBill = require("./routes/SimCardBill")
const AssetBill = require("./routes/AssetBill")
const modelBill = require("./routes/makeAndModelbill");
const vehicleBill = require("./routes/VehicleBill");
const manPowerBill = require("./routes/ManPowerBill");


//bill routes 

app.use("/api/v1/bill/hotel", HotelBill);
app.use("/api/v1/bill/simcard", SimCardBill);
app.use("/api/v1/bill/asset", AssetBill);
app.use("/api/v1/bill/makeAndModel", modelBill);
app.use("/api/v1/bill/vehicle", vehicleBill);
app.use("/api/v1/bill/manPower", manPowerBill);


// analysis 

const masterAnalysis = require("./routes/masterAnanlysis");
const transactionAnalysis = require("./routes/transactionAnalysis");

app.use("/api/v1/master/analysis", masterAnalysis);
app.use("/api/v1/transaction/analysis", transactionAnalysis);





// requisition module


const requisition = require("./routes/requisition")

app.use("/api/v1/requisition", requisition)


















app.post("/api/v1/admin/login", (req, res) => {
    try{
        const {username, password} = req.body;

        if(username === "admin" && password === "admin"){

            const token = jwt.sign({ role: "admin", username},
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {
              expiresIn: "30d",
            })

            res.cookie("token", token, {
                expires: new Date(Date.now() + ( 30 * 24 * 60 * 60 * 1000)), // ms
                httpOnly: false
            })

            res.status(200).json({valid: true, msg: "log in as an admin"});
        }
        else{
            res.status(200).json({valid: false, msg: "you cant login as an admin"});
        }

    }   
    catch(err){
        console.log(err);
    }
})













const start = async () => {
    console.log("this time");
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
start();


