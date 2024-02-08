const express = require('express')
const router = express.Router()
const {createVendor, getVendors, getSpecificVendor, editVendor, deleteVendor} = require("../controllers/vendor");
router.post('/', createVendor)
router.get('/getAll', getVendors)
router.get('/:v_id', getSpecificVendor)
router.post('/:v_id', editVendor)
router.delete('/:v_id', deleteVendor)




module.exports = router
