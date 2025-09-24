// model/user.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const User = sequelize.define('authme', {
  id: {
    type: DataTypes.MEDIUMINT,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totp: {
    type: DataTypes.STRING(32),
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING(40),
    allowNull: true,
  },
  lastlogin: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  regdate: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  regip: {
    type: DataTypes.STRING(40),
    allowNull: true,
  },
  x: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  y: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  z: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  world: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  yaw: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  pitch: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isLogged: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  realname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hasSession: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  point: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  rank: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  RP: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  }
}, {
  freezeTableName: true, // ใช้ชื่อตารางเป็น 'authme' ตรงๆ ไม่แปลงเป็นพหูพจน์
  timestamps: false
});

module.exports = User;
