const express = require('express')
const router = express.Router()
const User = require('../Models/UserModel')
const myCircle = require('../Models/CircleModel')
require('mongoose')
const validateParamId = require('../ValidationCode/validateParamId')
const errorMessage = require('../errorHandler/errorMessage')

exports.GetAll = (req, res) => {
  myCircle
    .find()
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

exports.GetByUID = (req, res) => {
  const { errors, isValid } = validateParamId(req.params.uid)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }

  myCircle
    .findOne({ users: req.params.uid })
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
  var tempId = req.body
  const { errors, isValid } = validateParamId(tempId.following.user_id)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }

  myCircle
    .findOne({ users: tempId.following.user_id })
    .then(user => {
      if (user) {
        tempId.status
          ? user.followers.pop(tempId.followers)
          : user.followers.push(tempId.followers)
        user.save()
        myCircle.findOne({ users: tempId.followers.user_id }).then(nuser => {
          if (nuser) {
            tempId.status
              ? nuser.following.pop(tempId.following)
              : nuser.following.push(tempId.following)
            nuser.save()
            res.status(200).json({
              success: true,
              data: nuser ? nuser : {},
            })
          }
        })
      } else {
        res.status(200).json(errorMessage(user))
      }
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

  myCircle
    .findByIdAndDelete({ _id: req.params.pid })
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

exports.uploadCircle = (req, res) => {
  const { errors, isValid } = validateParamId(req.params.uid)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }

  User.findOne({ _id: req.params.uid }).then(user => {
    if (user) {
      const newCircle = new myCircle({
        following: [],
        followers: [],
        users: user._id,
      })
      newCircle
        .save()
        .then(datas => {
          user.userCircle = newCircle._id //add post to user array
          user.save() //save user array
          res.status(200).json({
            success: true,
            data: datas ? datas : {},
          })
        })
        .catch(err => res.status(200).json(errorMessage(err)))
    }
  })
}

// exports.GetCircleById = (req, res) => {
//   const id = req.params.id

//   const { errors, isValid } = validateParamId(id)
//   // Check validation
//   if (!isValid) {
//     return res.status(200).json(errorMessage(errors))
//   }

//   User.findById(id,{ fullName: 1, profile_pic: 1, about_me: 1, bio: 1, userCircle: 1 },
//   ).populate('userCircle', '_id following followers')
//     .then(data => {
//       res.status(200).json({
//         success: true,
//         data: data ? data : {},
//       })
//     })
//     .catch(err => {
//       res.status(200).json(errorMessage(err))
//     })
// }
