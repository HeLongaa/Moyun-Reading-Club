/**
 * 错误模型
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Error = sequelize.define('error', {
  error_code: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    comment: 'HTTP错误代码'
  },
  title: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '错误标题（中文）'
  },
  title_en: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '错误标题（英文）'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '错误内容'
  },
  publish_time: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '发布时间'
  },
  reference_link: {
    type: DataTypes.STRING(256),
    allowNull: true,
    comment: '参考链接'
  }
}, {
  tableName: 'error',
  timestamps: false,
  comment: '该表用于存储定制的HTTP错误响应内容'
});

module.exports = Error; 