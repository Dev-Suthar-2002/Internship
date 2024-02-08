const express = require('express')
const router = express.Router()
const {createSimCardBill, deleteSimCardBill, editSimCardBill, getSimCardBills, getSpecificSimCardBill} = require("../controllers/SimCardBill");
router.post('/', createSimCardBill)
router.get('/getAll', getSimCardBills)
router.get('/:scb_id', getSpecificSimCardBill)
router.post('/:scb_id', editSimCardBill)
router.delete('/:scb_id', deleteSimCardBill)




module.exports = router
