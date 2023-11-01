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
  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required'
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required'
  } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be between 6 and 30 characters'
  }

  if (!isEmpty(errors)) {
    return res.status(400).json(errorMessage({ error: errors }))
  }

  next() // Move to the next middleware or route handler
}
