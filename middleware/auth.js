const jwt= require('jsonwebtoken')
const User= require('../model/user')
const secretKey = 'your_secret_key'
exports.auth=async(req,res,next)=>{
    try{
        console.log("hellow")
        let token= req.query.token
        console.log(token)
       const userid= (jwt.verify(token,secretKey))
       User.findByPk(userid.userId).then(user=>{
        req.user= user
        next()
       })
    }
    catch(e){
        console.log("err is ",e)
    }
}
