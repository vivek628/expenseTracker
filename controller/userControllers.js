const express=require('express')
const User= require('../model/user')
const path=require('path')
const { where } = require('sequelize')
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
exports.login=(req,res,next)=>{
    if(req.method=='GET')
    {
        res.sendFile(path.join(__dirname,'../public/views/','login.html'))
    }
    else{
        const email= req.body.email;
        const password=req.body.password;
        User.findAll({where:{email:email}}).then((data)=>{
            if(data.length==0)
            {
                res.status(404).send('email does not exist')
            }
            else{
                if(data[0].password != password)
                {
                    res.status(404).send('password is wrong')
                }
                else{
                    res.send('Login successful');
                }
            }
        }).catch((e)=>console.log(e))
    }
  
}
