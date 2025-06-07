const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 导入数据库连接
const sequelize = require('./config/database');

// 导入主路由
const apiRoutes = require('./routes');

// 导入中间件
const { securityCheck } = require('./middlewares/security');

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 静态文件服务
const staticPath = process.env.STATIC_FOLDER || path.join(__dirname, '../../static');
app.use(express.static(staticPath));
app.use('/bookCover', express.static(path.join(__dirname, '../static/bookCover')));
app.use('/bookLocal', express.static(path.join(__dirname, '../static/bookLocal')));
app.use('/profilePhoto', express.static(path.join(__dirname, '../static/profilePhoto')));

// 安全检查中间件
app.use(securityCheck);

// 使用主路由
app.use('/api', apiRoutes);

// 数据库连接测试
sequelize.authenticate()
  .then(() => console.log('数据库连接成功'))
  .catch(err => console.error('数据库连接失败:', err));

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;