const mongoose = require('mongoose')

const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || 27017
const dbName = process.env.DB_NAME || 'mydatabase'
const dbUsername = process.env.DB_USERNAME || 'admin'
const dbPassword = process.env.DB_PASSWORD || ''

// const dbURI = `mongodb+srv://${dbHost}:${dbPort}/${dbName}`;
const dbURI = `mongodb+srv://${dbUsername}:${dbPassword}@blogpost.feqwxhe.mongodb.net/?retryWrites=true&w=majority`

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // autoReconnect: true, // Enable auto-reconnect
  // reconnectTries: Number.MAX_VALUE, // Retry connection indefinitely
  // reconnectInterval: 5000, // Retry connection every 5 second
}

const connectToMongoDB = async () => {
  try {
    // database URL to trigger connection
    await mongoose.connect(dbURI, connectOptions)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
    // Retry connection after 5 second
    setTimeout(connectToMongoDB, 5000)
  }
}

connectToMongoDB()

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('MongoDB connection successful')
})

module.exports = { connectToMongoDB }
