const Validator = require('validator')
const isEmpty = require('is-empty')

module.exports = validatePasswords = data => {
  let errors = {}
  // Convert empty fields to an empty string so we can use validator functions
  data.oldPassword = !isEmpty(data.oldPassword) ? data.oldPassword : ''
  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : ''

  //Check Password
  if (
    Validator.isEmpty(data.oldPassword) ||
    Validator.isEmpty(data.newPassword)
  ) {
    errors.password = 'Password field is required'
  } else if (data.oldPassword.length <= 5 || data.newPassword.length <= 5) {
    errors.password = 'Password length should be more then 5 char'
  } else if (data.oldPassword === data.newPassword) {
    errors.password =
      'New Password Match The Old One,Please Enter Different Password'
  }
  return {
    passwordErrors: errors,
    passwordIsValid: isEmpty(errors),
  }
}
