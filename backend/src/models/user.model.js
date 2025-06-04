/**
 * 用户模型
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  account: {
    type: DataTypes.STRING(24),
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '密码'
  },
  signature: {
    type: DataTypes.STRING(128),
    defaultValue: '',
    comment: '签名档'
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: true,
    comment: '邮箱'
  },
  telephone: {
    type: DataTypes.STRING(11),
    allowNull: true,
    comment: '联系电话'
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    allowNull: false,
    defaultValue: 'student',
    comment: '身份组'
  }
}, {
  tableName: 'user',
  timestamps: false
});

module.exports = User; 