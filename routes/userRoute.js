const express= require('express')
const route= express.Router()
const userController=require('../controller/userControllers')

route.post('/addexpense',userController.addexpense)
route.use('/login',userController.login)
route.get('/getdata',userController.getData)
route.use('/',userController.signup)





module.exports=route