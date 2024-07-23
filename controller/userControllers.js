const express=require('express')
const bcrypt = require('bcryptjs');
const User= require('../model/user')
const expenses=require('../model/expense')
const path=require('path')
const { where } = require('sequelize')
exports.signup = async (req, res, next) => {
    const Method = req.method;
    
    try {
        if (Method === 'GET') {
            res.sendFile(path.join(__dirname, '../public/views/', 'signup.html'));
        } else {
            const name = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ name: name, email: email, password: hashedPassword });
            console.log("Data saved successfully");

            
            res.sendFile(path.join(__dirname, '../public/views/', 'signup.html'));
 
          
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error"); 
    }
};
exports.login=async (req,res,next)=>{
    try{
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
                        res.status(401).send('user doest not authorise')
                    }
                    else{
                         bcrypt.compare(password,data[0].password,(err,result)=>{
                            if(result==true)
                            {
                                res.sendFile(path.join(__dirname, '../public/views/', 'addepense.html'));
                            }
                            else{
                                res.status(404).send('password is wrong')
                            }
                        })
                    }
                })
    }
}catch(e)
{
console.log(e)
}
    
  
}
exports.addexpense=async(req,res,next)=>
{
    try{
          console.log(req.body)
          const amount=req.body.amount
          const description=req.body.description
          const category= req.body.category
        await expenses.create({Amount:amount,Description:description,Category:category})
     
        res.sendFile(path.join(__dirname, '../public/views/', 'addepense.html'));

    }
    catch(e){
        console.log(e)
    }
}
exports.getData = async (req, res, next) => {
    try {
        const data = await expenses.findAll();
        console.log(data)
       res.json(data);  // Send JSON response back to the client
    } catch (e) {
        console.log(e);
     res.status(500).json({ error: 'Internal Server Error' });  // Handle errors
    }
}
