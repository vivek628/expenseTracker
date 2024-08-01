const Sequelize = require('sequelize'); 
const sequelize = require('../utils/database'); 
const { DataTypes } = Sequelize;

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,  
        allowNull: false,
        primaryKey: true
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true 
    }
});

module.exports = Order;
