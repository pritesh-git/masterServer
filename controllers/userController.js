const User = require('../models/userModel')
const myCircle = require('../models/circleModel')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const errorMessage = require('../utils/errorMessage')
const successMessage = require('../utils/successMessage')

const createFormattedData = data => {
  return {
    id: data._id,
    fullName: data.fullName,
    email: data.email,
    profile_pic: data.profile_pic,
    role: data.role,
    bio: data.bio,
    about_me: data.about_me,
    hobbies: data.hobbies,
    active_status: data.active_status,
    create_date: data.create_date,
    posts: data.posts,
    userCircle: data.userCircle,
  }
}

exports.getAllUsers = async (req, res) => {
  const { skip, limit } = req.pagination // Get skip and limit from req.pagination
  try {
    const totalRows = await User.countDocuments({ role: 'user' })
    const users = await User.find(
    { role: 'user' },
    {
      fullName: 1,
      profile_pic: 1,
      about_me: 1,
      bio: 1,
      userCircle: 1,
      email: 1,
      hobbies: 1,
    },
  ).skip(skip)
  .limit(limit)
    .populate('userCircle', '_id following followers')

    if (!users || users.length === 0) {
      return res.status(404).json(errorMessage({ errorType: 'userNotFound' }))
    }

    res.status(200).json(
      successMessage({
        message: 'Fetch successful',
        data: users,
        limit: limit,
        totalRows: totalRows,
      }),
    )
  } catch (error) {
    return res
      .status(500)
      .json(errorMessage({ errorType: 'userFetchError', error: error }))
  }
}

exports.getUserById = async (req, res) => {
  const id = req.params.id

  try {
    const user = await User.findById( { _id: id, role: 'user' }, {
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
    if (!user) {
      return res.status(404).json(errorMessage({ errorType: 'userNotFound' }))
    }

    res.status(200).json(
      successMessage({
        message: 'Fetch successful',
        data: user,
      }),
    )
  } catch (error) {
    return res
      .status(500)
      .json(errorMessage({ errorType: 'userFetchError', error: error }))
  }
}

exports.updateByID = async (req, res) => {
  const id = req.params.id
  const payload = req.body

  const validColumns = [
    'first_name',
    'last_name',
    'fullName',
    'email',
    'bio',
    'hobbies',
    'about_me',
    'active_status'
  ]

  const invalidColumns = Object.keys(payload).filter(
    col => !validColumns.includes(col),
  )
  if (invalidColumns.length > 0) {
    return res.status(400).json(
      errorMessage({
        errorType: `Invalid columns: ${invalidColumns.join(', ')}`,
      }),
    )
  }
  if (Object.keys(payload).length === 0) {
    return res
      .status(400)
      .json(errorMessage({ errorType: 'No valid data to update' }))
  }
  try {
    const user = await User.findOneAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  if (!user) {
    return res.status(404).json(errorMessage({ errorType: 'userNotFound' }))
  }

  res.status(200).json(
    successMessage({
      message: 'Successfully Updated',
      data: createFormattedData(user),
    }),
  )
} catch (error) {
  return res
    .status(500)
    .json(errorMessage({ errorType: 'serverError', error: error }))
}
}

exports.deleteUser = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json(errorMessage({ errorType: 'userNotFound' }))
    }

    // Set active_status to false instead of deleting
    user.active_status = false

    await user.save()

    res
      .status(200)
      .json(successMessage({ message: 'User deactivated successfully' }))
  } catch (error) {
    return res
      .status(500)
      .json(errorMessage({ errorType: 'serverError', error: error }))
  }
}

exports.changePassword = async (req, res) => {
  const userId = req.params.id
  const { oldPassword, newPassword } = req.changePasswordData // Extract validated data from request

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json(errorMessage({ errorType: 'userNotFound' }))
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)

    if (!isMatch) {
      return res
        .status(400)
        .json(errorMessage({ errorType: 'invalidOldPassword' }))
    }

    // Hash the new password and update user's password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    await user.save()

    res
      .status(200)
      .json(successMessage({ message: 'Password changed successfully' }))
  } catch (error) {
    return res
      .status(500)
      .json(errorMessage({ errorType: 'serverError', error: error }))
  }
}

exports.uploadProfile = async (req, res) => {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json(errorMessage({ errorType: 'userNotFound' }))
    }

    user.profile_pic =
      req.file != undefined ? req.file.path.replace(/[\\]/g, '/') : ''

    const updatedUser = await user.save()

    res.status(200).json(
      successMessage({
        message: 'Updated profile successfully',
        data: createFormattedData(updatedUser),
      }),
    )
  } catch (error) {
    return res
      .status(500)
      .json(errorMessage({ errorType: 'serverError', error: error }))
  }
}

exports.registerUser = async (req, res, next) => {
  try {
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(200).json({ message: 'Email already exists' });
    }

    const newUser = new User({
      first_name: req.body.fnm || '<NA>',
      last_name: req.body.lnm || '<NA>',
      fullName: req.body.fullName || req.body.fnm + ' ' + req.body.lnm,
      email: req.body.email,
      password: req.body.password,
      bio: req.body.bio,
      about_me: req.body.about_me,
      hobbies: req.body.hobbies,
    });

    // Handle profile picture upload
    if (req.file) {
      newUser.profile_pic = req.file.path.replace(/[\\]/g, '');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;

    const savedUser = await newUser.save();

    const newCircle = new myCircle({
      following: [],
      followers: [],
      users: savedUser._id,
    });

    try {
      const circleData = await newCircle.save();
      savedUser.userCircle = circleData._id;
      await savedUser.save();
      // Generate a token here and store it in the 'token' variable
      const payload = {
        id: savedUser._id,
      }

      const token = await new Promise((resolve, reject) => {
        jwt.sign(
          payload,
          'authKey',
          {
            expiresIn: '5h',
          },
          (err, token) => {
            if (err) {
              reject(err)
            }
            resolve(token)
          },
        )
      })

      res.status(201).json({
        message: 'Created Successfully',
        data: {
          id: savedUser._id,
          fullName: savedUser.fullName,
          email: savedUser.email,
          circle: {
            _id: circleData._id,
            followers: circleData.followers,
            following: circleData.following,
          },
        },
        token: 'Bearer ' + token,
      });
    } catch (error) {
      return res.status(500).json({ errorType: 'serverError', error: error });
    }
  } catch (error) {
    return res.status(500).json({ errorType: 'serverError', error: error });
  }
};

exports.loginUser = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  try {
    const user = await User.findOne({ email })
    .populate('userCircle')
    if (!user) {
      return res.status(404).json(errorMessage({ errorType: 'invalidUser' }))
    }

    if (user && !user.active_status) {
      return res.status(401).json(errorMessage({ errorType: 'deletedUser' }))
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch || password === user.password) {
      const payload = {
        id: user._id,
      }

      const token = await new Promise((resolve, reject) => {
        jwt.sign(
          payload,
          'authKey',
          {
            expiresIn: '5h',
          },
          (err, token) => {
            if (err) {
              reject(err)
            }
            resolve(token)
          },
        )
      })
      res.status(200).json(
        successMessage({
          message: 'Successfully Login',
          data: createFormattedData(user),
          token: token,
        }),
      )
    } else {
      return res
        .status(400)
        .json(errorMessage({ errorType: 'invalidPassword' }))
    }
  } catch (error) {
    return res
      .status(500)
      .json(errorMessage({ errorType: 'serverError', error: error }))
  }
}