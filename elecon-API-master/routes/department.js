const express = require('express')
const router = express.Router()
const {createDepartment, getSpecificDepartment, updateDepartment, getAllDepartment, deleteDepartment} = require("../controllers/department");
router.post('/', createDepartment)
router.get('/getAll', getAllDepartment)
router.get('/:d_id', getSpecificDepartment)
router.post('/:d_id', updateDepartment)
router.delete('/:d_id', deleteDepartment)



module.exports = router
