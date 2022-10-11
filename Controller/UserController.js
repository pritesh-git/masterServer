const express = require('express')
const router = express.Router()
const User = require('../Models/UserModel')
const myCircle = require('../Models/CircleModel')
require('mongoose')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const errorMessage = require('../errorHandler/errorMessage')
// Load input validation
const validateRegisterInput = require('../ValidationCode/validateRegisterInput')
const validateLoginInput = require('../ValidationCode/validateLoginInput')
const validateParamId = require('../ValidationCode/validateParamId')
const validatePasswords = require('../ValidationCode/validatePasswords')

exports.GetAll = (req, res) => {
  User.find(
    {},
    {
      fullName: 1,
      profile_pic: 1,
      about_me: 1,
      bio: 1,
      userCircle: 1,
      email: 1,
      hobbies: 1,
    },
  )
    .populate('userCircle', '_id following followers')
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

exports.GetByID = (req, res) => {
  const id = req.params.id

  const { errors, isValid } = validateParamId(id)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }

  User.findById(id, {
    userCircle: 0,
    first_name: 0,
    last_name: 0,
    password: 0,
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
  })
    .populate(
      'posts',
      '_id title post_img content LikeCount CommentCount ShareCount createdAt',
    )
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
  const payload = req.body
  const id = req.params.id

  const { errors, isValid } = validateParamId(id)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }

  User.findOneAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .then(data => {
      const responseData = {
        fullName: data.fullName,
        email: data.email,
        bio: data.bio,
        about_me: data.about_me,
        hobbies: data.hobbies,
        createdAt: data.createdAt,
      }
      res.status(200).json({
        success: true,
        data: responseData,
      })
    })
    .catch(err => {
      res.status(200).json(errorMessage(err))
    })
}

exports.DeleteByID = (req, res) => {
  const id = req.params.id

  User.findByIdAndDelete(id)
    .then(data => {
      res.status(200).json({
        success: true,
        data: data,
      })
    })
    .catch(err => {
      res.status(200).json(errorMessage(err))
    })
}

exports.chngePassword = (req, res) => {
  const { errors, isValid } = validateParamId(req.params.id)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }
  const { passwordErrors, passwordIsValid } = validatePasswords(req.body)
  // Check validation
  if (!passwordIsValid) {
    return res.status(200).json(errorMessage(passwordErrors))
  }
  let tempData = req.body

  //Check user is valid or not
  User.findById({ _id: req.params.id }).then(nuser => {
    if (nuser) {
      //bycrpt,coz for password we have to undergo old password check and new password bycrpt proccess
      bcrypt
        .compare(tempData.oldPassword, nuser.password)
        .then(isMatch => {
          if (isMatch) {
            bcrypt.genSalt(10, (err, salt) => {
              if (err) throw err

              bcrypt.hash(tempData.newPassword, salt, (err, hash) => {
                if (err) throw err

                nuser.password = hash
                nuser
                  .save()
                  .then(data => {
                    res.status(200).json({
                      success: true,
                      data: {
                        message: 'Password Changed Successfully',
                      },
                    })
                  })
                  .catch(err => {
                    return res.status(200).json(errorMessage(err))
                  })
              })
            })
          } else {
            return res.status(200).json(errorMessage('invalidOldPassword'))
          }
        })
        .catch(err => {
          return res.status(200).json(errorMessage(err))
        })
    } else {
      errorMessage({ kind: 'ObjectId', value: req.params.id })
    }
  })
}

exports.uploadProfile = (req, res, next) => {
  var tempId = req.params.id
  const { errors, isValid } = validateParamId(tempId)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }
  User.findById(tempId).then(user => {
    if (user) {
      user.profile_pic =
        req.file != undefined ? req.file.path.replace(/[\\]/g, '/') : ''
      user
        .save()
        .then(data => {
          res.status(200).json({
            success: true,
            data: data,
          })
        })
        .catch(err => {
          res.status(200).json(errorMessage(err))
        })
    } else {
      return res.status(200).json(errorMessage(user))
    }
  })
}

exports.registerUser = (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(200).json(errorMessage('Email already exists'))
    } else {
      const newUser = new User({
        first_name: req.body.fnm || '<NA>',
        last_name: req.body.lnm || '<NA>',
        fullName: req.body.fullName || req.body.fnm + ' ' + req.body.lnm,
        profile_pic:
          req.file != undefined ? req.file.path.replace(/[\\]/g, '/') : '',
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
        about_me: req.body.about_me,
        hobbies: req.body.hobbies,
      })

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          // Create JWT Payload
          const payload = {
            id: Math.floor(Math.random() * 100) + 1,
          }
          // Sign token
          jwt.sign(
            payload,
            'BlogSecretKey',
            {
              expiresIn: 604800, // 1 week in seconds
            },
            (err, token) => {
              newUser
                .save()
                .then(user => {
                  const newCircle = new myCircle({
                    following: [],
                    followers: [],
                    users: user._id,
                  })
                  newCircle //add UserObject to Cirlce collection
                    .save()
                    .then(datas => {
                      user.userCircle = newCircle._id //add userCircle to user array
                      user.save() //save user array
                      res.status(200).json({
                        success: true,
                        data: {
                          id: user._id,
                          fullName: user.fullName,
                          email: user.email,
                          circle: {
                            _id: datas._id,
                            followers: datas.followers,
                            following: datas.following,
                          },
                        },
                        token: 'Bearer ' + token,
                      })
                    })
                    .catch(err => res.status(200).json(errorMessage(err)))
                })
                .catch(err => res.status(200).json(errorMessage(err)))
            },
          )
        })
      })
    }
  })
}

exports.LoginUser = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body)
  // Check validation
  if (!isValid) {
    return res.status(200).json(errorMessage(errors))
  }

  const email = req.body.email
  const password = req.body.password

  // Find user by email
  User.findOne({ email })
    .populate('userCircle')
    .then(user => {
      // Check if user exists
      if (!user) {
        return res.status(200).json(errorMessage('Email not Found'))
      }
      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        // isMatch return true if bcrypt code matched
        // so we use OR in if coz password in case stored without bycrpted
        if (isMatch || password == user.password) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user._id,
          }
          // Sign token
          jwt.sign(
            payload,
            'BlogSecretKey',
            {
              expiresIn: '5h', // 5 hour expire token
            },
            (err, token) => {
              res.status(200).json({
                success: true,
                data: {
                  id: user._id,
                  email: user.email,
                  fullName: user.fullName,
                  profile_pic: user.profile_pic,
                  circle: {
                    //inner collection will be t1.indexKey.t2IndexKey
                    _id: user.userCircle._doc._id,
                    followers: user.userCircle._doc.followers,
                    following: user.userCircle._doc.following,
                  },
                },
                token: 'Bearer ' + token,
              })
            },
          )
        } else {
          return res
            .status(200)
            .json(
              errorMessage(
                'Invalid Password: You have Entered Invalid Password',
              ),
            )
        }
      })
    })
}
