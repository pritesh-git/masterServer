const Validator = require('validator')
const isEmpty = require('is-empty')
const errorMessage = require('../utils/errorMessage')

module.exports = (req, res, next) => {
  const data = req.body
  let errors = {}

  if (isEmpty(data)) {
    errors.data = 'Empty data is passed'
  }

  // Convert empty fields to an empty string so we can use validator functions
  data.fnm = !isEmpty(data.fnm) ? data.fnm : ''
  data.lnm = !isEmpty(data.lnm) ? data.lnm : ''
  data.bio = !isEmpty(data.bio) ? data.bio : ''
  data.email = !isEmpty(data.email) ? data.email : ''
  data.hobbies = !isEmpty(data.hobbies) ? data.hobbies : ''
  data.password = !isEmpty(data.password) ? data.password : ''
  data.about_me = !isEmpty(data.about_me) ? data.about_me : ''

  // fnm checks
  if (Validator.isEmpty(data.fnm)) {
    errors.fnm = 'First Name field is required'
  } else if (!Validator.isAlpha(data.fnm)) {
    errors.fnm = 'First Name must Alphabet'
  }
  // fnm checks
  if (Validator.isEmpty(data.lnm)) {
    errors.lnm = 'Last Name field is required'
  } else if (!Validator.isAlpha(data.lnm)) {
    errors.lnm = 'Last Name must Alphabet'
  }
  //Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required'
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required'
  } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters'
  }
  // Bio checks
  if (Validator.isEmpty(data.bio)) {
    errors.bio = 'Bio field is required'
  } else if (!Validator.isLength(data.bio, { min: 30, max: 200 })) {
    errors.bio = 'Bio must be at least 30 characters'
  }
  // AboutMe checks
  if (Validator.isEmpty(data.about_me)) {
    errors.about_me = 'About Me field is required'
  } else if (!Validator.isLength(data.about_me, { min: 30, max: 200 })) {
    errors.about_me = 'About Me must be at least 30 characters'
  }
  // Hobbies checks
  if (Validator.isEmpty(data.hobbies)) {
    errors.hobbies = 'Hobbies field is required'
  }

  if (!isEmpty(errors)) {
    return res.status(400).json(errorMessage({ errorType: errors }))
  }

  next() // Move to the next middleware or route handler
}
