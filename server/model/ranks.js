//model/ranks.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); // ✅ นำเข้า sequelize อย่างถูกต้อง

const ranks = sequelize.define('ranks', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    command: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priceture: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Optionsquantity	: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    rank_id: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      }
}, {
    timestamps: false  
});

module.exports = ranks;
