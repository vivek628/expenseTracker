const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const User= require('../model/user')
const pass=require('../model/forgetpass')

dotenv.config(); // Load environment variables



const defaultClient = SibApiV3Sdk.ApiClient.instance;


const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;
 // Use environment variable for API key

const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sender = {
    email: 'viveksilori28@gmail.com'
};

// Function to send email
const sendEmail = async (subject, textContent, receiver) => {
    try {
        const response = await transEmailApi.sendTransacEmail({
            sender,
            to: [{ email: receiver }], // Ensure this matches API requirements
            subject,
            textContent
        });
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', {
            status: error.status,
            message: error.message,
            body: error.response ? error.response.body : 'No response body'
        });
    }
};

exports.forget = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/views/', 'forgetpass.html'));
};

exports.resetpass = async(req, res, next) => {
    
    console.log("key",process.env.API_KEY)
    console.log("defaultClient",defaultClient)
    let uui = uuidv4();
    console.log("x is ", uui);

    const useremail =  req.body.email;
   console.log(useremail)

    const user= await User.findOne({where:{email:useremail}})
    const Id=user.id

    console.log("userid is ",user.id)
    console.log("uui is ", uui);

    await pass.create({  
        isactive: true,
        forgetpassuserid: uui  ,
        UserId:Id
    });
    //localhost:3000/getresetpassword?token=3ee5065a-6a00-453a-9b2b-2d53927d7db1
    const resetPasswordUrl = `https://localhost:3000/resetpassword?token=${uui}`;
    const htmlContent = `Click <a href="${resetPasswordUrl}">here</a> to reset your password.`;

    sendEmail('Verify Password', htmlContent, useremail);
    res.send('Password reset email sent.');
};
exports.getresetPasswordUrl=async(req,res,next)=>{
    try{
        const t=req.query.token
        console.log("t is",t)
       const forget_pass_user= await pass.findOne({where:{forgetpassuserid:t}})
       const user= await User.findOne({where:{id:forget_pass_user.UserId}})
       console.log("user is ",user )
       //id=user.forgetpassuserid
       const forgetpassEmail=user.email
       //console.log(user)0f032086-2236-4123-904b-22b1f21c590e
       if(!user)
       {
        return res.status(401).send("somthing went wrong")
       }
       console.log(user)
       console.log("active",forget_pass_user.isactive)
      if(!forget_pass_user.isactive)
       {
       return res.status(401).send("link time out")
       }
       await pass.update({isactive:false},
        {
            where:{forgetpassuserid:t}
        }
       )
     //  localStorage.setItem('email',forgetpassEmail)
       res.sendFile(path.join(__dirname, '../public/views/', 'resetpassword.html'));
        
    }
   catch(e)
   {
   console.log(e)
   }

}
exports.postresetpass=async(req,res,next)=>{
    const email=req.body.email
    console.log(email)
    console.log("check")
    const newPassword=req.body.newPassword
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    User.update({password:hashedPassword},
        {
            where:{email:email}
        }
    ).then(()=>
        res.status(200).json()
    ).catch(e=>console.log("err is ",e))
    //console.log(reqdata)
  
}