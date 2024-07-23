const { DataTypes } = require('sequelize')
const sequelize= require('../utils/database')
const Expense=sequelize.define('Expense',{
    Amount:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    Description:{
        type:DataTypes.STRING,
        allowNull:false

    },
    Category:{
        type:DataTypes.STRING,
        allowNull:false
    }
})
module.exports=Expense;
