const Message = require('../models/messageModel')
const User = require('../models/userModel')
const Chat = require('../models/chatModel')

class MessageController {
    async sendMessage(req, res) {
        const {ownId, chatId, content} = req.body
        if (!chatId || !content) {
            return res.statusCode(400)
        }
        const newMessage = {
            sender: ownId,
            content: content,
            chat: chatId,
        }
        try {
            let message = await Message.create(newMessage)
            message = await message.populate('sender', 'name')
            message = await message.populate('chat')
            message = await User.populate(message, {
                path: 'chat.users',
                select: 'name',
            })
            await Chat.findByIdAndUpdate(chatId, {
                latestMessage: message
            })
            res.json(message)
        } catch (e) {
            res.status(400)
            throw new Error(e.message)
        }
    }

    async fetchMessages(req, res) {
        try {
            const messages = await Message.find({chat: req.params.id})
                .populate('sender', 'name')
                .populate('chat')
            res.json(messages)
        } catch (e) {
            res.status(400)
            throw new Error(e.message)
        }
    }
}

module.exports = new MessageController()
