const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`mongoDB connect: ${connect.connection.host}`)
    } catch (e) {
        console.log(`Error: ${e.message}`)
        process.exit()
    }
}

module.exports = connectDb