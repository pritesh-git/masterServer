module.exports = function (app) {
  const middleware = require('../Config/middleWareFile')
  const myCircle = require('../Controller/myCircleController')

  app.post('/myCircle/:uid', middleware.checkToken, myCircle.uploadCircle)
  app.get('/allCircle', middleware.checkToken, myCircle.GetAll)
  app.get('/myCircle/:uid', middleware.checkToken, myCircle.GetByUID)
  app.put('/updatemyCircle', middleware.checkToken, myCircle.updateByID)
  app.put('/deletemyCircle', middleware.checkToken, myCircle.DeleteByID)
}
