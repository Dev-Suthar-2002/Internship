const express = require('express')
const router = express.Router()
const {createManPowerBill, getManPowerBills, getSpecificManPowerBill, editManPowerBill, deleteManPowerBill} = require("../controllers/ManPowerBill");
router.post('/', createManPowerBill)
router.get('/getAll', getManPowerBills)
router.get('/:mb_id', getSpecificManPowerBill)
router.post('/:mb_id', editManPowerBill)
router.delete('/:mb_id', deleteManPowerBill)




module.exports = router
