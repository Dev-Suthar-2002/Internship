const express = require('express')
const router = express.Router()
const {createWorkType, getWorkTypes, getSpecificWorkType, editWorkType, deleteWorkType} = require("../controllers/workTypeMaster");
router.post('/', createWorkType)
router.get('/getAll', getWorkTypes)
router.get('/:w_id', getSpecificWorkType)
router.post('/:w_id', editWorkType)
router.delete('/:w_id', deleteWorkType)




module.exports = router
