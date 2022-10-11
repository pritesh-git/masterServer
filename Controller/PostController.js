const express = require('express')
const router = express.Router()
const User = require('../Models/UserModel')
const Post = require('../Models/PostModel')
require('mongoose')
const validateParamId = require('../ValidationCode/validateParamId')
const errorMessage = require('../errorHandler/errorMessage')

exports.GetAll = (req, res) => {
  Post.find({}, { __v: 0, updatedAt: 0 })
    .populate('comments')
    .then(data => {
      res.status(200).json({
        success: true,
        data: data ? data : [],
      })
    })
    .catch(err => {
      res.status(200).json(errorMessage(err))
    })
}

exports.GetByPID = (req, res) => {
  const { errors, isValid } = validateParamId(req.params.pid)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }
  Post.findById({ _id: req.params.pid }, { __v: 0, updatedAt: 0 })
    .populate('comments')
    .then(data => {
      res.status(200).json({
        success: true,
        data: data ? data : [],
      })
    })
    .catch(err => {
      res.status(200).json(errorMessage(err))
    })
}

exports.GetByUID = (req, res) => {
  const { errors, isValid } = validateParamId(req.params.uid)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }
  Post.find({ users: req.params.uid }, { __v: 0, updatedAt: 0 })
    .populate('comments')
    .then(data => {
      res.status(200).json({
        success: true,
        data: data ? data : [],
      })
    })
    .catch(err => {
      res.status(200).json(errorMessage(err))
    })
}
exports.updateByID = (req, res) => {
  const { errors, isValid } = validateParamId(req.params.pid)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }
  let tempData = req.body
  Post.findOneAndUpdate({ _id: req.params.pid }, tempData, {
    new: true,
    runValidators: true,
  })
    .then(data => {
      res.status(200).json({
        success: true,
        data: { message: 'Updated Successfully' },
      })
    })
    .catch(err => {
      res.status(200).json(errorMessage(err))
    })
}

exports.DeleteByID = (req, res) => {
  const { errors, isValid } = validateParamId(req.params.pid)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }
  Post.findByIdAndDelete({ _id: req.params.pid })
    .then(data => {
      res.status(200).json({
        success: true,
        data: { message: 'Deleted Succesfully' },
      })
    })
    .catch(err => {
      res.status(200).json(errorMessage(err))
    })
}

exports.uploadPost = (req, res) => {
  const { errors, isValid } = validateParamId(req.params.uid)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }
  User.findOne({ _id: req.params.uid }).then(user => {
    if (user) {
      const newPost = new Post({
        fullName: req.body.fullName,
        title: req.body.title,
        profile_pic: req.body.profile_pic || null,
        post_img:
          req.file != undefined ? req.file.path.replace(/[\\]/g, '/') : null,
        content: req.body.content,
        LikeCount: '0',
        CommentCount: '0',
        ShareCount: '0',
        users: user._id,
      })
      newPost
        .save()
        .then(post => {
          user.posts.push(newPost._id) //add post to user array
          user.save() //save user array
          res.status(200).json({
            success: true,
            data: post ? post : [],
          })
        })
        .catch(err => res.status(200).json(errorMessage(err)))
    }
  })
}
