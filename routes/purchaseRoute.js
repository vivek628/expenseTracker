const express= require('express')
const route= express.Router()
const purchasecontroller= require('../controller/purchasecontrollers')
route.get('/premium', purchasecontroller.purchasePremium)
route.post('/verify_payment',purchasecontroller.verify_payment)
module.exports=route

