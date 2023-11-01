const multer = require('multer')
const user = require('../controllers/userController')
const checkToken = require('../middleware/checkToken')
const validateParamId = require('../middleware/validateParamId')
const validateLoginInput = require('../middleware/validateLoginInput')
const validateRegistrationInput = require('../middleware/validateRegisterInput')
const validatePasswordChange = require('../middleware/validatePasswords')
const {
  setRole,
  filterExt,
  limitPagination,
  handleFileUploadError,
  generateCustomFilename,
} = require('../middleware/requestHandler')

// Multer to upload image file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/userImg/')
  },
  filename: generateCustomFilename, // Use the middleware function for filename
})

const uploadPic = multer({
  storage,
  fileFilter: filterExt,
}).single('profile_pic')

module.exports = app => {
  app.post('/login', validateLoginInput, user.loginUser)
  app.get('/users', checkToken, limitPagination, user.getAllUsers)
  app.get('/user/:id', checkToken, validateParamId, user.getUserById)
  app.put('/updateUser/:id', checkToken, validateParamId, user.updateByID)
  app.delete('/deleteUser/:id', checkToken, validateParamId, user.deleteUser)
  app.post(
    '/registerUser',
    validateRegistrationInput,
    setRole('user'),
    uploadPic,
    handleFileUploadError,
    user.registerUser,
  )
  app.put(
    '/newProfilePic/:id',
    checkToken,
    uploadPic,
    handleFileUploadError,
    user.uploadProfile,
  )
  app.post(
    '/changePassword/:id',
    checkToken,
    validatePasswordChange,
    user.changePassword,
  )
}
