const {Sequelize}= require('sequelize')
const sequelize= new Sequelize('expense','root','Vivek@628',{dialect:'mysql',host:'localhost'})
module.exports=sequelize