/**
 * 账号控制器
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { generateToken } = require('../middlewares/auth');
const MailService = require('../services/mailService');

// 创建邮件服务实例
const mailService = new MailService();

// 存储密码重置令牌
const passwordResetTokens = {};

/**
 * 注册新用户
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.register = async (req, res) => {
  try {
    const { account, password, email, telephone, signature, role } = req.body;

    // 检查必要字段
    if (!account || !password) {
      return res.status(400).json({
        success: false,
        error: '用户名和密码不能为空'
      });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { account } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: '用户名已存在'
      });
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create({
      account,
      password: hashedPassword,
      email: email || null,
      telephone: telephone || null,
      signature: signature || '',
      role: role || 'student' // 默认角色
    });

    // 如果提供了邮箱，发送欢迎邮件
    if (email) {
      mailService.sendRegistrationEmail(email, account)
        .catch(err => console.error('发送欢迎邮件失败:', err));
    }

    // 生成JWT令牌
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        id: user.id,
        account: user.account,
        email: user.email,
        telephone: user.telephone,
        signature: user.signature,
        role: user.role,
        token,
        avatar_path: user.avatar_path || null

      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      error: '注册失败，请稍后重试'
    });
  }
};

/**
 * 用户登录
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.login = async (req, res) => {
  try {
    const { account, password } = req.body;

    // 检查必要字段
    if (!account || !password) {
      return res.status(400).json({
        success: false,
        error: '用户名和密码不能为空'
      });
    }
    // 检查是否是邮箱格式
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const isEmail = emailRegex.test(account);

    // 根据是否为邮箱格式查找用户
    const user = await User.findOne({
      where: isEmail ? { email: account } : { account }
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      });
    }

    // 生成JWT令牌
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        id: user.id,
        account: user.account,
        email: user.email,
        telephone: user.telephone,
        signature: user.signature,
        role: user.role,
        avatar_path: user.avatar_path,
        token
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      error: '登录失败，请稍后重试'
    });
  }
};

/**
 * 生成6位数验证码
 * @returns {string} 验证码
 */
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 请求重置密码
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // 检查必要字段
    if (!email) {
      return res.status(400).json({
        success: false,
        error: '邮箱不能为空'
      });
    }

    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // 出于安全考虑，即使用户不存在也返回成功
      return res.status(200).json({
        success: true,
        message: '如果该邮箱已注册，您将收到一封包含密码重置验证的邮件'
      });
    }

    // 生成验证码
    const verificationCode = generateVerificationCode();

    // 存储验证码，10分钟后过期
    passwordResetTokens[email] = {
      userId: user.id,
      code: verificationCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10分钟
    };

    // 发送包含验证码的邮件
    await mailService.sendVerificationCode(email, verificationCode, user.account);

    res.status(200).json({
      success: true,
      message: '如果该邮箱已注册，您将收到一封包含验证码的邮件'
    });
  } catch (error) {
    console.error('请求重置密码失败:', error);
    res.status(500).json({
      success: false,
      error: '请求重置密码失败，请稍后重试'
    });
  }
};

/**
 * 重置密码
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // 检查必要字段
    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        error: '邮箱、验证码和新密码不能为空'
      });
    }

    // 验证验证码
    const resetInfo = passwordResetTokens[email];
    if (!resetInfo || resetInfo.code !== code || resetInfo.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        error: '验证码无效或已过期'
      });
    }

    // 查找用户
    const user = await User.findByPk(resetInfo.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }

    // 哈希新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await user.update({ password: hashedPassword });

    // 删除验证码记录
    delete passwordResetTokens[email];

    res.status(200).json({
      success: true,
      message: '密码重置成功'
    });
  } catch (error) {
    console.error('重置密码失败:', error);
    res.status(500).json({
      success: false,
      error: '重置密码失败，请稍后重试'
    });
  }
};

/**
 * 获取当前用户信息
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // 从请求中获取用户ID
    const userId = req.user.id;

    // 查找用户
    const user = await User.findByPk(userId, {
      attributes: ['id', 'account', 'email', 'telephone', 'signature', 'role', 'avatar_path']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
    res.status(500).json({
      success: false,
      error: '获取当前用户信息失败，请稍后重试'
    });
  }
};

/**
 * 修改密码
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // 检查必要字段
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: '当前密码和新密码不能为空'
      });
    }

    // 查找用户
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }

    // 验证当前密码
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: '当前密码错误'
      });
    }

    // 哈希新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await user.update({ password: hashedPassword });

    res.status(200).json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({
      success: false,
      error: '修改密码失败，请稍后重试'
    });
  }
};