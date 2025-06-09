const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'moyun',
  process.env.DB_USER || 'MoYun_Admin',
  process.env.DB_PASSWORD || 'MoYun_Admin',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: false, // 不自动添加时间戳字段
      freezeTableName: true, // 使用表名作为模型名，不自动转换为复数形式
    }
  }
);

module.exports = sequelize; 