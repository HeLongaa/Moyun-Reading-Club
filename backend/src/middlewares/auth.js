/**
 * 认证中间件
 */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'MoYun';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 验证JWT令牌
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Function} next 下一个中间件
 */
const verifyToken = (req, res, next) => {
  // 从请求头获取令牌
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({
      success: false,
      error: '未提供访问令牌'
    });
  }
  
  try {
    // 验证令牌
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: '无效的访问令牌'
    });
  }
};

/**
 * 检查是否为管理员
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Function} next 下一个中间件
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: '需要管理员权限'
    });
  }
};

/**
 * 检查是否为管理员
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Function} next 下一个中间件
 */
const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: '需要教师权限'
    });
  }
};

const isAdminOrTeacher = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'teacher')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: '需要管理员或教师权限'
    });
  }
};

/**
 * 生成JWT令牌
 * @param {Object} user 用户信息
 * @returns {string} JWT令牌
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      account: user.account,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN  // 使用环境变量中的值，例如 "7d"
    }
  );
};

module.exports = {
  verifyToken,
  isAdmin,
  isTeacher,
  isAdminOrTeacher,
  generateToken
};