const express= require('express')
const route= express.Router()
const userController=require('../controller/userControllers')
const auth=require('../middleware/auth')

route.get('/getaddexpense',auth.auth,userController.getaddexpense)
route.post('/postaddexpense',userController.postaddexpense)
route.post('/postLogin',userController.postLogin)
route.get('/getLogin',userController.getLogin)
route.get('/getdata',userController.getData)
route.get('/getuser',userController.getUser)
route.use('/',userController.signup)






module.exports=route