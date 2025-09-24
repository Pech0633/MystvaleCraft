//model/item.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); // ✅ นำเข้า sequelize อย่างถูกต้อง

const Item = sequelize.define('items', {
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
    }
}, {
    timestamps: false  // ปิด timestamps (createdAt, updatedAt)
});

module.exports = Item;
