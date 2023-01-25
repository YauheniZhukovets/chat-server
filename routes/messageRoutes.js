const express = require('express')
const messageController = require('../controllers/messageController');
const router = express.Router()

router.post('/', messageController.sendMessage)
router.get('/:id',messageController.fetchMessages )

module.exports = router
