const express= require('express')
const route= express.Router()
const purchasecontroller= require('../controller/purchasecontrollers')
route.get('/premium', purchasecontroller.purchasePremium)
route.post('/verifypayment',purchasecontroller.verify_payment)
//route.get('/arrange',purchasecontroller.arrange)
//route.get('/download',purchasecontroller.downloadurl)
//route.get('/urlList',purchasecontroller.urlList)
//route.get('/geturls',purchasecontroller.)
module.exports=route

