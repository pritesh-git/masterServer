const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const UserSchema = new Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    about_me: {
      type: String,
      required: true,
    },
    hobbies: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
      default: null,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        default: null,
      },
    ],
    userCircle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'mycircle',
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = UserModel = mongoose.model('users', UserSchema)
