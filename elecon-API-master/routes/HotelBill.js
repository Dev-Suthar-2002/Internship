const express = require('express')
const router = express.Router()
const {createHotelBill, deleteHotelBill, getSpecificEmpHotelBills, editHotelBill, getHotelBills, getSpecificHotelBill} = require("../controllers/HotelBill");
router.post('/', createHotelBill)
router.get('/getAll', getHotelBills)
router.get('/:emp_id/getAll', getSpecificEmpHotelBills)
router.get('/:hb_id', getSpecificHotelBill)
router.post('/:hb_id', editHotelBill)
router.delete('/:hb_id', deleteHotelBill)




module.exports = router
