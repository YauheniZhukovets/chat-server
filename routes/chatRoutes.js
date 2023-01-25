const express = require('express')
const chatController = require('../controllers/chatController');
const router = express.Router()

router.post('/', chatController.createChat)
router.get('/fetch', chatController.fetchChats)

module.exports = router
