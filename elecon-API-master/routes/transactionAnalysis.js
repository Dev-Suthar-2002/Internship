const express = require('express')
const router = express.Router()
const {getCountTransactions} = require("../controllers/transactionAnalysis");
router.get('/getCount', getCountTransactions)





module.exports = router
