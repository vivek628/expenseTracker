const { DataTypes } = require('sequelize')
const sequelize= require('../utils/database')
const User=sequelize.define('User',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true 
        },
        allowNull:false

    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isPrimeuser:
    {
        type:DataTypes.BOOLEAN
    }
})
module.exports=User
