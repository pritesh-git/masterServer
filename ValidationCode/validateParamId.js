const Validator = require('validator')
const isEmpty = require('is-empty')
const mongoose = require('mongoose')

module.exports = validateParamId = id => {
  let errors = {}
  // Convert empty fields to an empty string so we can use validator functions
  id = !isEmpty(id) ? id : ''
  // Checks id
  if (Validator.isEmpty(id)) {
    errors.id = 'Id is required'
  } else if (!Validator.isAlphanumeric(id)) {
    errors.id = 'Id is invalid'
  } else if (
    !id.match(/^[0-9a-fA-F]{24}$/) ||
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    errors.id = 'Id is invalid'
  }
  return {
    errors,
    isValid: isEmpty(errors),
  }
}
