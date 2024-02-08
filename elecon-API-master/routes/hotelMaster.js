const express = require('express')
const router = express.Router()
const {createHotel, getHotels, getSpecificHotel, editHotel, deleteHotel} = require("../controllers/hotelMaster");
router.post('/', createHotel)
router.get('/getAll', getHotels)
router.get('/:h_id', getSpecificHotel)
router.post('/:h_id', editHotel)
router.delete('/:h_id', deleteHotel)




module.exports = router
