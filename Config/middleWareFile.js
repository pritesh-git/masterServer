let jwt = require('jsonwebtoken')
const errorMessage = require('../errorHandler/errorMessage')

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'] // Express headers are auto converted to lowercase
  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length)
    }
    jwt.verify(token, 'BlogSecretKey', (err, decoded) => {
      if (err) {
        return res.status(400).json(errorMessage('invalidToken'))
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.status(400).json(errorMessage('noToken'))
  }
}
module.exports = {
  checkToken: checkToken,
}
