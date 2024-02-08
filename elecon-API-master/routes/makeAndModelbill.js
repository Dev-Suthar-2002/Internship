const express = require('express')
const router = express.Router()
const {createMAndMBill, getMAndMBills, getAllBillForSpecific, getSpecificMAndMBill, editMAndMBill, deleteMAndMBill} = require("../controllers/makeAndModelBill");
router.post('/', createMAndMBill)
router.get('/getAll', getMAndMBills)
router.get('/:mb_id/getAll', getAllBillForSpecific)
router.get('/:mb_id', getSpecificMAndMBill)
router.post('/:mb_id', editMAndMBill)
router.delete('/:mb_id', deleteMAndMBill)




module.exports = router
