const Router = require('express')
const router = new Router()
const userRouter = require('./userRoutes')
const chatRoutes = require('./chatRoutes')
const messageRoutes = require('./messageRoutes')

router.use('/user', userRouter)
router.use('/chat', chatRoutes)
router.use('/message', messageRoutes)

module.exports = router