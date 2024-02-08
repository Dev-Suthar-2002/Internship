const express = require('express')
const router = express.Router()
const {createNotification, getNotification, getReadNotification, getUnreadNotification, readNotification} = require("../controllers/notification");
router.post('/', createNotification)
router.get('/all/:emp_id', getNotification)
router.get('/read/:emp_id', getReadNotification)
router.get('/unread/:emp_id', getUnreadNotification)
router.post('/readNotification/:n_id', readNotification)




module.exports = router
