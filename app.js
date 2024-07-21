const express= require('express')
const bodyparser= require('body-parser')
const path= require('path')
const app =express()
const userRoute= require('./routes/userRoute')
const sequelize = require('./utils/database')
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public','views')))
app.use(userRoute)
sequelize.sync().then(()=>{
    app.listen(3000,()=>{
        console.log("server is running")
        })
}).catch((E)=>{
    console.log(E)
})
