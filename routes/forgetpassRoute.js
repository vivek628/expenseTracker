const express= require('express')
const route= express.Router()
const forgetpasswordcontroller= require('../controller/forgetpassController')
route.get('/getresetpassword',forgetpasswordcontroller.getresetPasswordUrl)
route.get('/forgetpassword',forgetpasswordcontroller.forget)
route.post('/resetpassword',forgetpasswordcontroller.resetpass)
route.post('/postresetpassword',forgetpasswordcontroller.postresetpass)

module.exports= route
