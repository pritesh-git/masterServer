const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const CommentSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
    },
    comment: {
      type: String,
      required: true,
    },
    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = CommentModel = mongoose.model('comments', CommentSchema)
