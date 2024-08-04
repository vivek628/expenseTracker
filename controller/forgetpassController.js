
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const SibApiV3Sdk = require('sib-api-v3-sdk');


dotenv.config();

// Initialize Sendinblue API
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();


const sender = {
    email: 'siloriv2@gmail.com'
};
/*const receiver = [
    {
        email: 'shivanisilori58@gmail.com'
    }
];*/

// Function to send email
const sendEmail = async (subject, textContent, receiver) => {
    try {
        const response = await transEmailApi.sendTransacEmail({
            sender,
            to: receiver,
            subject,
            textContent
        });
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};





exports.forget=(req,res,next)=>{
    res.sendFile(path.join(__dirname, '../public/views/', 'forgetpass.html'));
}
exports.resetpass=(req,res,next)=>{
    const useremail=req.body.email
     
    sendEmail('Verify Password', 'Your password reset link goes here.',useremail);
    res.send('Password reset email sent.');
}





