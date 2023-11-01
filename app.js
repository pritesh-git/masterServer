const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')

dotenv.config({ path: `./config/.env.${process.env.NODE_ENV}` })

const app = express()
require('./config/db')

// Middleware
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors('Access-Control-Allow-Origin', '*'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.set('view engine', 'ejs')

// Middleware for handling 304: Not Modified
app.use('/*', (req, res, next) => {
  res.setHeader('Last-Modified', new Date().toUTCString())
  next()
})

// Routes
app.get('/', (req, res) => {
  console.log('Server is live')
  res.send('Server is live')
})

require('./routes/userRoute')(app) // Route for User actions
// require('./routes/postRoute')(app) //Route for Post actions
// require('./routes/commentRoute')(app) //Route for Comment actions
// require('./routes/circleRoute')(app) //Route for MyCircle actions

// Custom error handler for 404 Not Found
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

// Custom error handler for other errors
app.use((err, req, res, next) => {
  const statusCode = err.status || 500
  const message = err.message || 'Internal Server Error'
  res.status(statusCode).send(message)
  next(err)
})

// Handle unhandled rejections and exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at', promise, `reason: ${reason}`)
  process.exit(1)
})

process.on('uncaughtException', error => {
  console.error('Unhandled Exception:', error.message)
  process.exit(1)
})

// Set the port number for the server
const port = process.env.PORT || 5000

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
