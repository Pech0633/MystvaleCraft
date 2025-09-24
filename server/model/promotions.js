//model/promotions.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); // ✅ นำเข้า sequelize อย่างถูกต้อง

const Promotions = sequelize.define('promotions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    img: {
        type: DataTypes.STRING,  // ชนิดข้อมูลสำหรับที่อยู่ของไฟล์ภาพ
        allowNull: false         // กำหนดว่าไม่สามารถเป็นค่า null ได้
    },
    rplimited: {
        type: DataTypes.DOUBLE,  // ชนิดข้อมูลสำหรับคำบรรยาย
        allowNull: false         // กำหนดว่าไม่สามารถเป็นค่า null ได้
    },
    command: {
        type: DataTypes.STRING,  // ชนิดข้อมูลสำหรับคำบรรยาย
        allowNull: false         // กำหนดว่าไม่สามารถเป็นค่า null ได้
    },
    name: {
        type: DataTypes.STRING,  // ชนิดข้อมูลสำหรับคำบรรยาย
        allowNull: false         // กำหนดว่าไม่สามารถเป็นค่า null ได้
    }
}, {
    timestamps: false  // ปิด timestamps (createdAt, updatedAt)
});

module.exports = Promotions;
