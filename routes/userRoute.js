const express= require('express')
const route= express.Router()
const userController=require('../controller/userControllers')
route.use('/login',userController.login)
route.use('/',userController.singup)

module.exports=route