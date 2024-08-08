const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database'); // Ensure this path is correct

const DownloadUrl = sequelize.define('DownloadUrl', {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = DownloadUrl;
