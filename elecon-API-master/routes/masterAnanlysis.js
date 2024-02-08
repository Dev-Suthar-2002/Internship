const express = require('express')
const router = express.Router()
const {getCountMaster} = require("../controllers/masterAnalysis");
router.get('/getCount', getCountMaster)





module.exports = router
