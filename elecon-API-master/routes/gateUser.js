const express = require('express')
const router = express.Router()
const {getTodayVisitorForGateUser, getInTimeVisitorForGateUser, getOutTimeVisitorForGateUser} = require("../controllers/gateUser");
router.post('/getTodayVisitorForGateUser', getTodayVisitorForGateUser)
router.post('/getInTimeVisitorForGateUser', getInTimeVisitorForGateUser)
router.post('/getOutTimeVisitorForGateUser', getOutTimeVisitorForGateUser)


module.exports = router
