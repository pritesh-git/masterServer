const mongoose = require('mongoose')
require('dotenv').config()
const MONGOURI = process.env.MONGOURI
mongoose.Promise = global.Promise

mongoose
  .connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))
