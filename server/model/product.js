//model/product.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); // ✅ นำเข้า sequelize อย่างถูกต้อง

const product = sequelize.define('products', {
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
        type: DataTypes.STRING,
        allowNull: false,
    },
    rank_id: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    rank_set: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    type: {
          type: DataTypes.STRING,
          allowNull: false
    }
}, {
    timestamps: false  
});

module.exports = product;
