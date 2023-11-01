// const Validator = require('validator')
const isEmpty = require('is-empty')
const mongoose = require('mongoose')
const errorMessage = require('../utils/errorMessage')

module.exports = (req, res, next) => {
  const id = req.params.id
  let errors = {}
  if (isEmpty(id)) {
    errors.invalidId = 'ID required to proceed this request'
  }
  //  else if (!Validator.isAlphanumeric(id)) {
  //   errors.invalidId = 'ID format is invalid'
  // } else if (!id.match(/^[0-9a-fA-F]{24}$/)) {
  //   errors.invalidId = 'ID format is invalid'
  // }
  else if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.invalidId = 'Invalid ID Provided'
  }

  if (!isEmpty(errors)) {
    return res
      .status(401)
      .json(errorMessage({ errorType: 'invalidId', error: errors.invalidId }))
  }

  next() // Move to the next middleware or route handler
}
