const express = require('express')
const router = express.Router()
const {createAsset, getAssets, getSpecificAsset, editAsset, deleteAsset} = require("../controllers/assetMaster");
router.post('/', createAsset)
router.get('/getAll', getAssets)
router.get('/:a_id', getSpecificAsset)
router.post('/:a_id', editAsset)
router.delete('/:a_id', deleteAsset)




module.exports = router
