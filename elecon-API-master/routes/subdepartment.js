const express = require('express')
const router = express.Router()
const {createSubDepartment, deleteSubDepartment, getAllSubDepartment, getSpecificSubDepartment, updateSubDepartment} = require("../controllers/subdepartment");
router.post('/', createSubDepartment)
router.get('/getAll', getAllSubDepartment);
router.get('/:s_id', getSpecificSubDepartment);
router.post('/:s_id', updateSubDepartment);
router.delete('/:s_id', deleteSubDepartment);





module.exports = router
