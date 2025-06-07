/**
 * 工具函数集合
 */
const path = require('path');
const fs = require('fs');
require('dotenv').config();

/**
 * 从环境变量中获取配置信息
 * @param {string} section 配置区块名称
 * @param {string} key 配置键名
 * @returns {string|object} 配置值或配置对象
 */
const queryConfig = (section, key = null) => {
  const config = {
    Database: {
      Type: 'MySQL',
      Driver: 'mysql2',
      Host: process.env.DB_HOST || 'localhost',
      Port: parseInt(process.env.DB_PORT || '3306'),
      Database: process.env.DB_NAME || 'moyun',
      Account: process.env.DB_USER || 'MoYun_Admin',
      Password: process.env.DB_PASSWORD || 'MoYun_Admin'
    },
    Admin: {
      Account: process.env.ADMIN_ACCOUNT || 'MoYun_Admin',
      Password: process.env.ADMIN_PASSWORD || 'MoYun_Admin',
      ID: parseInt(process.env.ADMIN_ID || '1'),
      'E-Mail': process.env.ADMIN_EMAIL || '',
      Telephone: process.env.ADMIN_TELEPHONE || '',
      Signature: process.env.ADMIN_SIGNATURE || '道阻且长',
      ProfilePhoto: process.env.ADMIN_PROFILE_PHOTO || ''
    },
    'E-Mail': {
      Host: process.env.EMAIL_HOST || 'smtp.126.com',
      Port: parseInt(process.env.EMAIL_PORT || '465'),
      Username: process.env.EMAIL_USER || '',
      Password: process.env.EMAIL_PASS || '',
      Sender: process.env.EMAIL_SENDER || ''
    },
    Path: {
      TemplateFolder: process.env.TEMPLATE_FOLDER || '/templates',
      StaticFolder: process.env.STATIC_FOLDER || '/static',
      StoragePath: process.env.STORAGE_PATH || './static',
      ErrorImageSource: process.env.ERROR_IMAGE_SOURCE || 'HTTP Cats'
    },
    OPENAI: {
      api_url: process.env.OPENAI_API_URL || 'https://api.deepseek.com/v1/chat/completions',
      api_key: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'deepseek-r1'
    }
  };

  if (!section) {
    return config;
  }

  if (!config[section]) {
    return null;
  }

  if (key && config[section][key] !== undefined) {
    return config[section][key];
  }

  return config[section];
};

/**
 * 生成随机字符串
 * @param {number} length 字符串长度
 * @returns {string} 随机字符串
 */
const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

/**
 * 确保目录存在，如果不存在则创建
 * @param {string} dirPath 目录路径
 */
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * 获取文件扩展名
 * @param {string} filename 文件名
 * @returns {string} 文件扩展名
 */
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

/**
 * 检查文件类型是否允许
 * @param {string} extension 文件扩展名
 * @param {Array<string>} allowedTypes 允许的文件类型
 * @returns {boolean} 是否允许
 */
const isAllowedFileType = (extension, allowedTypes) => {
  return allowedTypes.includes(extension.toLowerCase());
};

module.exports = {
  queryConfig,
  generateRandomString,
  ensureDirectoryExists,
  getFileExtension,
  isAllowedFileType
}; 