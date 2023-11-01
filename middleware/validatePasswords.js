const Validator = require('validator')
const isEmpty = require('is-empty')

module.exports = (req, res, next) => {
  const data = req.body
  let errors = {}
  if (isEmpty(data)) {
    errors.data = 'Empty data is passed'
  }

  data.oldPassword = !isEmpty(data.oldPassword) ? data.oldPassword : ''
  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : ''

  if (Validator.isEmpty(data.oldPassword)) {
    errors.oldPassword = 'Old password is required'
  }

  if (Validator.isEmpty(data.newPassword)) {
    errors.newPassword = 'New password is required'
  } else if (!Validator.isLength(data.newPassword, { min: 6, max: 30 })) {
    errors.newPassword = 'Password must be between 6 and 30 characters'
  }

  if (!isEmpty(errors)) {
    return res.status(400).json(errorMessage({ error: errors }))
  }

  req.changePasswordData = data // Store validated data in request for controller use
  next() // Move to the next middleware or route handler
}
