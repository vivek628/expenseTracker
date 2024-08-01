const express=require('express')
const bcrypt = require('bcryptjs');
const User= require('../model/user')
const expenses=require('../model/expense')
const path=require('path')
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'
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
        console.error("Erruor:", error);
        res.status(500).send("Internal Server Error"); 
    }
};
exports.getLogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/views/', 'login.html'));
};
exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password); 
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(401).json({ error: 'Email does not exist' });
        }

        // Compare password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (result) {
                // Passwords match, generate access token
                const accessToken = generateaccesToken(user.id);
                return res.status(200).json({ token: accessToken });
            } else {
               
                return res.status(401).json({ error: 'Password is incorrect' });
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
    
        

exports.postaddexpense=async(req,res,next)=>
{    
    try{
          console.log(req.body)
          const authorizationHeader = req.headers['authorization'];
          const id= await getidfromjwt(authorizationHeader)
          const amount=req.body.amount
          const description=req.body.description
          const category= req.body.category
          await expenses.create({Amount:amount,Description:description,Category:category,UserId:id})
     
          res.sendFile(path.join(__dirname, '../public/views/', 'login.html'));

    }
    catch(e){
        console.log(e)
    }
}
exports.getData = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        console.log("id",authorizationHeader)
       const id= await getidfromjwt(authorizationHeader)
       console.log(id)

        const data = await expenses.findAll({where:{UserId:id}});
        console.log(data)
        res.json(data); 
    } catch (e) {
        console.log(e);
       res.status(500).json({ error: 'Internal Server Error' });  
    }
}
exports.getUser=async(req,res,next)=>{
    try{
        const authorizationHeader = req.headers['authorization'];
       // console.log("id",authorizationHeader)
       const id= await getidfromjwt(authorizationHeader)
       //console.log(id)
       const data= await User.findOne({where:{id:id}})
       //Console.log(json)
       res.json(data)
    }
    catch(E){
        console.log(E)
    }
}
function generateaccesToken(id)
{
    return jwt.sign({userId:id},secretKey)
}
function getidfromjwt(id)

{   
    const secretKey = 'your_secret_key'
    const userid= (jwt.verify(id,secretKey))
    return userid.userId
}
exports.getaddexpense=(req,res,next)=>{
    console.log("ji2")
    console.log(req.user)
    res.sendFile(path.join(__dirname, '../public/views/', 'addEpense.html'));
}
