//model/item.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); // ✅ นำเข้า sequelize อย่างถูกต้อง

const Code = sequelize.define('iscodes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    equal: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false 
});

module.exports = Code;
