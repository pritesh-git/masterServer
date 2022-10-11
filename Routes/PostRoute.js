module.exports = function (app) {
  const middleware = require('../Config/middleWareFile')
  const post = require('../Controller/PostController')
  const multer = require('multer')

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/postImg/')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname)
    },
  })

  const upload = multer({ storage: storage })

  app.post(
    '/post/:uid',
    middleware.checkToken,
    upload.single('post_img'),
    post.uploadPost,
  )
  app.get('/posts', middleware.checkToken, post.GetAll)
  app.get('/post/:pid', middleware.checkToken, post.GetByPID)
  app.get('/userPost/:uid', middleware.checkToken, post.GetByUID)
  app.put('/updatePost/:pid', middleware.checkToken, post.updateByID)
  app.delete('/deletePost/:pid', middleware.checkToken, post.DeleteByID)
}
