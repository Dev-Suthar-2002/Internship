const express = require('express')
const router = express.Router()
const {createMAndM, getMAndMs, getSpecificMAndM, editMAndM, deleteMAndM} = require("../controllers/makeAndModelMaster");
router.post('/', createMAndM)
router.get('/getAll', getMAndMs)
router.get('/:m_id', getSpecificMAndM)
router.post('/:m_id', editMAndM)
router.delete('/:m_id', deleteMAndM)




module.exports = router
