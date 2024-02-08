const express = require('express')
const router = express.Router()
const {createDriver, getDrivers, getSpecificDriver, editDriver, deleteDriver} = require("../controllers/driverMaster");
router.post('/', createDriver)
router.get('/getAll', getDrivers)
router.get('/:d_id', getSpecificDriver)
router.post('/:d_id', editDriver)
router.delete('/:d_id', deleteDriver)




module.exports = router
