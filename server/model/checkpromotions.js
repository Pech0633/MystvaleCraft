//model/promotions.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); // ✅ นำเข้า sequelize อย่างถูกต้อง

const Checkpromotions = sequelize.define('checkpromotions', {
    name: {
        type: DataTypes.STRING,  // ชนิดข้อมูลสำหรับคำบรรยาย
        allowNull: false         // กำหนดว่าไม่สามารถเป็นค่า null ได้
    },
    promotionsid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    timestamps: false  // ปิด timestamps (createdAt, updatedAt)
});

module.exports = Checkpromotions;
