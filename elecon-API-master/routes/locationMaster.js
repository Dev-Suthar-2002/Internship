const express = require('express')
const router = express.Router()
const {createLocation, getLocations, getSpecificLocation, editLocation, deleteLocation} = require("../controllers/locationMaster");
router.post('/', createLocation)
router.get('/getAll', getLocations)
router.get('/:l_id', getSpecificLocation)
router.post('/:l_id', editLocation)
router.delete('/:l_id', deleteLocation)




module.exports = router
