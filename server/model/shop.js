// models/shop.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); // ✅ นำเข้า sequelize อย่างถูกต้อง

const Shop = sequelize.define('shops', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    href: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false  // ปิด timestamps (createdAt, updatedAt)
});

module.exports = Shop;
