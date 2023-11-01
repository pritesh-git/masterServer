const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const CircleSchema = new Schema({
  followers: [
    {
      user_id: {
        type: String,
        required: true,
      },
      user_pic: {
        type: String,
        required: true,
      },
      user_name: {
        type: String,
        required: true,
      },
    },
  ],
  following: [
    {
      user_id: {
        type: String,
        required: true,
      },
      user_pic: {
        type: String,
        required: true,
      },
      user_name: {
        type: String,
        required: true,
      },
    },
  ],
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
})

module.exports = CircleModel = mongoose.model('mycircle', CircleSchema)
