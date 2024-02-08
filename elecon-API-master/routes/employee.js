const express = require('express')
const router = express.Router()
const {getAllEmployees, getEmployee, forgotPasswordEmail, getHODEmps,countEmpBasedOnRole, changePassword, getAllHOD, getEmpByCDD} = require("../controllers/employee");
router.get('/getAllHOD', getAllHOD)
router.get('/getAll', getAllEmployees)
router.get('/:id', getEmployee)
router.post('/forgotPasswordEmail', forgotPasswordEmail)
router.post('/changePassword', changePassword)
router.get('/analysis/countBasedOnRole', countEmpBasedOnRole)
router.get('/analysis/hodEmps/:h_id', getHODEmps)
router.post('/cdd/getAll', getEmpByCDD)


module.exports = router
