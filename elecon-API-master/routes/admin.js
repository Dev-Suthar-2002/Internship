const express = require('express')
const router = express.Router()
const {createEmployee, updateEmployee, deleteEmployee} = require("../controllers/admin");
router.post('/createEmployee', createEmployee)
router.post('/updateEmployee/:id', updateEmployee)
router.delete('/deleteEmployee/:id', deleteEmployee)


module.exports = router
