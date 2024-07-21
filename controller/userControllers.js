const express=require('express')
const User= require('../model/user')
const path=require('path')
exports.singup=(req,res,next)=>{
    const Method=req.method
    if(Method=='GET')
    {
        res.sendFile(path.join(__dirname, '../public/views/', 'signup.html'));
    }
    else
    {
        const name= req.body.username
        const email=req.body.email
        const password=req.body.password
         User.create({name:name,email:email,password:password}).then(()=>{
            console.log("data saved")
            res.sendFile(path.join(__dirname, '../public/views/', 'signup.html'));
         }).catch((e)=>{
            console.log(e)
         })
    }
   

   
}
