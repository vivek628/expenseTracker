const express= require('express')
const route= express.Router()
const forgetpasswordcontroller= require('../controller/forgetpassController')
route.get('/forgetpassword',forgetpasswordcontroller.forget)
route.post('/resetpassword',forgetpasswordcontroller.resetpass)
module.exports= route
