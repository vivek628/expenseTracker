const  Sequelize =require('sequelize')
const sequelize= require('../utils/database')
const { DataTypes } = Sequelize;
const pass= sequelize.define('PASS',{
    forgetpassuserid: {
        type: DataTypes.UUID, // UUID or INTEGER depending on your use case
        defaultValue: DataTypes.UUIDV4, // Auto-generate UUID if needed
        allowNull: false,
       
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey:true
    },
    isactive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})
module.exports= pass