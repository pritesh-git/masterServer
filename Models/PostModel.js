const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const PostSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
    },
    post_img: {
      type: String,
    },
    content: {
      type: String,
    },
    LikeCount: {
      type: String,
    },
    CommentCount: {
      type: String,
    },
    ShareCount: {
      type: String,
    },
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = PostModel = mongoose.model('posts', PostSchema)
