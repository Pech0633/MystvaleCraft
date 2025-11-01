//model/item.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); // ✅ นำเข้า sequelize อย่างถูกต้อง

const Code = sequelize.define('codes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    command: {
        type: DataTypes.STRING,
        allowNull: false
    },
    point: {
        type: DataTypes.DOUBLE,
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
