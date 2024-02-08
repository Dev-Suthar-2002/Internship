const express = require('express')
const router = express.Router()
const {createCompany, getCompanies, deleteCompany, updateCompany, getCompaniesWithDivisionAndDept, getSpecificCompany, getDivisionByCompany} = require("../controllers/company");
router.get('/getDivisionByCompany/:c_id', getDivisionByCompany)
router.post('/', createCompany)
router.get('/getAll', getCompanies)
router.post('/:c_id', updateCompany)
router.get('/:c_id', getSpecificCompany)
router.delete('/:c_id', deleteCompany)
router.get('/all/companies', getCompaniesWithDivisionAndDept)



module.exports = router
