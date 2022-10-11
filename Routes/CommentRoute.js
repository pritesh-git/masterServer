module.exports = function (app) {
  const middleware = require('../Config/middleWareFile')
  const comment = require('../Controller/CommentController')

  app.post('/comment/:pid', middleware.checkToken, comment.uploadComment)
  app.get('/comment', middleware.checkToken, comment.GetAll)
  app.get('/comment/:pid', middleware.checkToken, comment.GetByID)
  app.put('/updatecomment/:cid', middleware.checkToken, comment.updateByID)
  app.delete('/deletecomment/:cid', middleware.checkToken, comment.DeleteByID)
}
