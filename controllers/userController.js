const User = require('../models/userModel')

class UserController {
    async login(req, res) {

        const {name} = req.body

        if (!name) {
            res.status(400).send({message: 'Введите имя'})
        }

        const candidate = await User.findOne({name})
        let user

        if (!candidate) {
            user = await User.create({
                name
            })
        }

        if (user) {
            res.status(201, {message: 'Пользователь создан'}).json({
                _id: user._id,
                name: user.name
            })
        }
        if (candidate) {
            res.status(201, {message: 'Пользователь найден'}).json({
                _id: candidate._id,
                name: candidate.name
            })
        }
    }

    async getAllUsers(req, res) {
        const users = await User.find({ name: { $regex: req.query.search, $options: "i" } })
        res.send(users)
    }
}

module.exports = new UserController()
