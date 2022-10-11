module.exports = function (app) {
  const middleware = require('../Config/middleWareFile')
  const user = require('../Controller/UserController')
  const multer = require('multer')

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/userImg/')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname)
    },
  })

  const upload = multer({ storage: storage })

  app.post('/login', user.LoginUser)
  app.post('/newUser', upload.single('profile_pic'), user.registerUser)
  app.put(
    '/newProfilePic/:id',
    upload.single('profile_pic'),
    user.uploadProfile,
  )

  //check token validation in below routes
  app.get('/users', middleware.checkToken, user.GetAll)
  app.get('/user/:id', middleware.checkToken, user.GetByID)
  app.put('/updateUser/:id', middleware.checkToken, user.updateByID)
  app.put('/changePassword/:id', middleware.checkToken, user.chngePassword)
  app.delete('/deleteUser/:id', middleware.checkToken, user.DeleteByID)
}
