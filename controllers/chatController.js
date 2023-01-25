const Chat = require('../models/chatModel')
const User = require('../models/userModel')

class ChatController {
    async createChat(req, res) {
        const {ownId, userId, nameChat} = req.body

        if (!userId || !ownId) {
            return res.statusCode(400).send({message: 'Не отправлены индификаторы'})
        }

        let chatDate = {
            chatName: nameChat,
            users: [ownId, userId]
        }

        try {
            const createdChat = await Chat.create(chatDate)
            const fullChat = await Chat.findOne({_id: createdChat._id})
                .populate('users')

            res.status(200).send(fullChat)
        } catch (e) {
            res.status(400).send({message: 'Чат не создан'})
        }
    }

    async fetchChats(req, res) {
        const {ownId, userId} = req.query
        //const {ownId, userId} = req.body

        try {
            Chat.find({
                $and: [
                    {users: {$elemMatch: {$eq: ownId}}},
                    {users: {$elemMatch: {$eq: userId}}},
                ]
            })
                .populate('users')
                .populate('latestMessage')
                .sort({updatedAt: -1})
                .then(async (results) => {
                    results = await User.populate(results, {
                        path: 'latestMessage.sender',
                        select: 'name'
                    })
                    res.status(200).send(results)
                })
        } catch (e) {
            res.status(400).send({message: 'Чаты для этих юзеров не найдены'})
        }
    }
}

module.exports = new ChatController()
