const order = require("../model/order");
const User =require('../model/user')
const razorpay= require('razorpay')
const jwt = require('jsonwebtoken');
const { where } = require("sequelize");
const { default: axios } = require("axios");
exports.purchasePremium=async (req,res,next)=>{
    const authorizationHeader = req.headers['authorization'];
    const user= await getidfromjwt(authorizationHeader)
    console.log(user)

    try{
        var raz= new razorpay(
            {
                key_id:"rzp_test_S7sOXoKFK7j0KY",
                key_secret:"DKiPc40sLwYzc1wLfeTyNaxQ",

            }
            
        )
        const amount=2500;
        raz.orders.create({amount,currency:"INR"},(err,order)=>{
            if(err)
            {
               console.log(err)
            }
            console.log("orderid",order.id)
         
            user.createOrder({orderId:order.id,status:'PENDING'}).then(()=>{
                console.log("created")
                return res.status(201).json({order,key_id:raz.key_id})
            })

        })
    }
    catch(e)
    {
      console.log(e)
    }
}
exports.verify_payment= async(req,res,next)=>{
    try{
        const order_id= req.body.order_id
        const paymentId=req.body.payment_id
        const authorizationHeader = req.headers['authorization'];
        console.log(req.body)
        console.log(order_id)
        const id=await getidfromjwt(authorizationHeader) 
        console.log("id is ",id.id)
        await order.update({
            paymentId:paymentId,
            orderId:order_id,
            status:"succesfull"   },
            {where:{UserId:id.id}}
        )
        await User.update({
            isPrimeuser:true
        },
       {where:{id:id.id}})
       return res.status(201)

    }
    catch(e)
    {
        console.log(e)
    }
}
function getidfromjwt(id)

{   
    const secretKey = 'your_secret_key'
    const userid= (jwt.verify(id,secretKey))
    const Id= userid.userId
    const user=User.findByPk(Id)
    return user
}