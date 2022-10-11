const express = require('express') //import express to use expressjs functionality
const bodyParser = require('body-parser') // import bodyParser to access user requst in body tag
const cors = require('cors') // import cors to handle cors error
require('dotenv').config() //import dotenv to implement dot envirment concept
const morgan = require('morgan') //import morgan to show each user req and res to console.log
const app = express() //define const app to implement fuction

// Body parser middleware
app.use(bodyParser.json()).use(morgan('combined'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

// app.use(bodyParser.json({limit: '10mb', extended: true}));
// app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

//handle cors error
app.use(cors('Access-Control-Allow-Origin', '*'))

//MongoDb connection
require('./Config/cnctDb')

app.use('/uploads', express.static(__dirname + '/uploads')) // get File Static path
// http://localhost:5000/uploads/postImg/123.jpg
// http://localhost:5000/uploads/userImg/123.jpg

//routes path
app.get('/', function (req, res) {
  console.log('server active')
  res.send('server active')
})
require('./Routes/UserRoute')(app) //route for User actions
require('./Routes/PostRoute')(app) //route for Post actions
require('./Routes/CommentRoute')(app) //route for Comment actions
require('./Routes/CircleRoute')(app) //route for MyCircle actions

//Handle route not found
app.use((req, res, next) => {
  req.status = 404
  const error = new Error('Routes Not Found')
  next(error)
})

//error handle code
app.use((error, req, res, next) => {
  res.status(req.status || 500).send({
    message: error.message,
    stack: error.stack,
  })
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log('Server is running on port: ' + port))
