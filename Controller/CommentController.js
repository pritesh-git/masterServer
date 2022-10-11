const express = require('express')
const router = express.Router()
const Post = require('../Models/PostModel')
const Comment = require('../Models/CommentModel')
const errorMessage = require('../errorHandler/errorMessage')
// const PostRoute = require("../Routes/PostRoute");
require('mongoose')

exports.GetAll = (req, res) => {
  Comment.find()
    .then(data => {
      res.status(200).json({
        success: true,
        data: data ? data : {},
      })
    })
    .catch(err => {
      res.status(200).json(errorMessage(err))
    })
}

exports.uploadComment = (req, res) => {
  const { errors, isValid } = validateParamId(req.params.pid)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }

  Post.findOne({ _id: req.params.pid }).then(post => {
    if (post) {
      const newComment = new Comment({
        fullName: req.body.fullName,
        profile_pic: req.body.profile_pic || null,
        comment: req.body.comment,
        posts: post._id,
      })
      newComment
        .save()
        .then(comment => {
          post.comments.push(newComment._id) //add comment to post array
          post.save() //save post array
          res.status(200).json({
            success: true,
            data: comment ? comment : {},
          })
        })
        .catch(err => res.status(200).json(errorMessage(err)))
    } else {
      return res.status(200).json(errorMessage('postUnavailable'))
    }
  })
}

exports.GetByID = (req, res) => {
  const { errors, isValid } = validateParamId(req.params.pid)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }

  Comment.findOne({ posts: req.params.pid })
    .then(data => {
      res.status(200).json({
        success: true,
        data: data ? data : {},
      })
    })
    .catch(err => {
      res.status(200).json(errorMessage(err))
    })
}

exports.updateByID = (req, res) => {
  const { errors, isValid } = validateParamId(req.params.cid)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }

  let tempData = req.body
  Comment.findOneAndUpdate({ _id: req.params.cid }, tempData, {
    new: true,
    runValidators: true,
  })
    .then(data => {
      res.status(200).json({
        success: true,
        data: data ? data : {},
      })
    })
    .catch(err => {
      res.status(200).json(errorMessage(err))
    })
}

exports.DeleteByID = (req, res) => {
  const { errors, isValid } = validateParamId(req.params.cid)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }

  Comment.findByIdAndDelete({ _id: req.params.cid })
    .then(data => {
      res.status(200).json({
        success: true,
        data: data ? data : {},
      })
    })
    .catch(err => {
      res.status(200).json(errorMessage(err))
    })
}
