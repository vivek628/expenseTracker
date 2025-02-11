const express= require('express')
const bodyparser= require('body-parser')
const cors= require('cors')
const path= require('path')
const app =express()
app.use(express.json())
app.use(cors())
const userRoute= require('./routes/userRoute')
const sequelize = require('./utils/database')
const db=require('./model/expense.js')
const User=require('./model/user.js')
const Expenses= require('./model/expense.js')
const Order= require('./model/order.js')
const Forgetpassword=require('./model/forgetpass.js')
const purhcaseroute= require('./routes/purchaseRoute.js')
const forgetroute=require('./routes/forgetpassRoute.js')
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public','views')))
app.use(express.static(path.join(__dirname, 'public','style')))
User.hasMany(Expenses)
Expenses.belongsTo(User)
User.hasMany(Order)
Order.belongsTo(User)
User.hasMany(Forgetpassword)
Forgetpassword.belongsTo(User)
app.use(forgetroute)
app.use(purhcaseroute)
app.use(userRoute)


sequelize.sync().then(()=>{
    app.listen(3000,()=>{
        console.log("server is running")
        })
}).catch((E)=>{
    console.log(E)
})
