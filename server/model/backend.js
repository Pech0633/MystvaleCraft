const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); 

const Backend = sequelize.define('backends', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false 
    }
}, {
    timestamps: false
});

module.exports = Backend;