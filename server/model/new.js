const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); 

const news = sequelize.define('news', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false  // ยังไม่ให้ว่าง
    },
    text: {
        type: DataTypes.STRING,
        allowNull: true   // อนุญาตให้ว่าง
    },
    Image: {
        type: DataTypes.STRING,
        allowNull: true   // อนุญาตให้ว่าง
    }
}, {
    timestamps: false
});

module.exports = news;
