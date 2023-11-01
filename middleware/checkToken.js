const jwt = require('jsonwebtoken')
const errorMessage = require('../utils/errorMessage')

const checkToken = (req, res, next) => {
  try {
    let token = req.headers['x-access-token'] || req.headers['authorization']
    if (token) {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7)
      }
      jwt.verify(token, 'authKey', (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json(errorMessage({ errorType: 'invalidToken', error: err }))
        } else {
          req.decoded = decoded
          next()
        }
      })
    } else {
      return res.status(401).json(errorMessage({ errorType: 'noToken' }))
    }
  } catch (error) {
    return res
      .status(500)
      .json(errorMessage({ errorType: 'serverError', error: error }))
  }
}

module.exports = checkToken
