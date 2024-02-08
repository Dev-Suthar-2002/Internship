const express = require('express')
const router = express.Router()
const {createVehicle, getVehicles, getSpecificVehicle, editVehicle, deleteVehicle} = require("../controllers/vehicleMaster");
router.post('/', createVehicle)
router.get('/getAll', getVehicles)
router.get('/:v_id', getSpecificVehicle)
router.post('/:v_id', editVehicle)
router.delete('/:v_id', deleteVehicle)




module.exports = router
