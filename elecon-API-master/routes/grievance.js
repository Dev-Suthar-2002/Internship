const express = require('express')
const router = express.Router()
const {createGrievance, getAllGrievanceForEmp,getCountOfGrievanceOfHOD, getAllEscalatedGrievances, approveGrievance, closeGrievance, escalateGrievance, remindGrievance, resendGrievance,getPrintData, getAllGrievance,getCountOfGrievanceOfEmp, resolvedAnalysis, getDataForActivityGrievance, countOfAllGrievance, countOfEmpGrievance, updateGrievance, getSpecificGrievance ,updateStatus, deleteGrievance, getAllGrievanceForHOD} = require("../controllers/grievance");
router.post('/:emp_id', createGrievance)
router.get('/:emp_id', getAllGrievanceForEmp)
router.get('/', getAllGrievance)
router.post('/:g_id/update', updateGrievance)
router.post('/:g_id/status', updateStatus)
router.post('/:g_id/approve', approveGrievance)
router.post('/:g_id/close', closeGrievance)
router.post('/:g_id/resend', resendGrievance)
router.post('/:g_id/remind', remindGrievance)
router.post('/:g_id/escalate', escalateGrievance)
router.delete('/:g_id', deleteGrievance)
router.get('/admin/escalated/getAll', getAllEscalatedGrievances)
router.get('/hod/:hod_id', getAllGrievanceForHOD)
router.get('/specific/:g_id', getSpecificGrievance)
router.get('/analysis/countStatus', countOfAllGrievance);
router.get('/analysis/empCountGrievance', countOfEmpGrievance);
router.get('/analysis/resolved', resolvedAnalysis);
router.get('/analysis/grouped', getDataForActivityGrievance);
router.get('/analysis/count/:emp_id', getCountOfGrievanceOfEmp);
router.get('/analysis/hodcount/:emp_id', getCountOfGrievanceOfHOD);
router.get('/analysis/print/all/get', getPrintData);




module.exports = router
