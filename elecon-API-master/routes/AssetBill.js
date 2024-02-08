const express = require('express')
const router = express.Router()
const {createAssetBill, deleteAssetBill, editAssetBill, getAssetBills, getSpecificAssetBill} = require("../controllers/AssetBill");
router.post('/', createAssetBill)
router.get('/getAll', getAssetBills)
router.get('/:ab_id', getSpecificAssetBill)
router.post('/:ab_id', editAssetBill)
router.delete('/:ab_id', deleteAssetBill)




module.exports = router
