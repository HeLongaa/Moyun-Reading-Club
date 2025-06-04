/**
 * 个人资料控制器
 */
const { User } = require('../models');
const FileManager = require('../services/fileManager');

// 创建文件管理器实例
const fileManager = new FileManager();

/**
 * 获取用户个人资料
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'account', 'signature', 'email', 'telephone', 'role']
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
    console.error('获取个人资料失败:', error);
    res.status(500).json({
      success: false,
      error: '获取个人资料失败，请稍后重试'
    });
  }
};

/**
 * 更新用户个人资料
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { signature, email, telephone } = req.body;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 更新用户信息
    await user.update({
      signature: signature !== undefined ? signature : user.signature,
      email: email !== undefined ? email : user.email,
      telephone: telephone !== undefined ? telephone : user.telephone
    });
    
    res.status(200).json({
      success: true,
      message: '个人资料更新成功',
      data: {
        id: user.id,
        account: user.account,
        signature: user.signature,
        email: user.email,
        telephone: user.telephone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('更新个人资料失败:', error);
    res.status(500).json({
      success: false,
      error: '更新个人资料失败，请稍后重试'
    });
  }
};

/**
 * 上传用户头像
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '请选择要上传的头像'
      });
    }
    
    // 文件路径
    const filePath = `/profilePhoto/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: '头像上传成功',
      data: {
        path: filePath
      }
    });
  } catch (error) {
    console.error('上传头像失败:', error);
    res.status(500).json({
      success: false,
      error: '上传头像失败，请稍后重试'
    });
  }
};

/**
 * 获取用户统计信息
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    
    // 查询用户
    const user = await User.findByPk(userId, {
      attributes: ['id', 'account', 'signature', 'role']
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 查询用户的书评数量
    const journalCount = await user.countJournals();
    
    // 查询用户加入的圈子数量
    const groupCount = await user.countGroups();
    
    // 查询用户发表的讨论数量
    const discussionCount = await user.countDiscussions();
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          account: user.account,
          signature: user.signature,
          role: user.role
        },
        stats: {
          journalCount,
          groupCount,
          discussionCount
        }
      }
    });
  } catch (error) {
    console.error('获取用户统计信息失败:', error);
    res.status(500).json({
      success: false,
      error: '获取用户统计信息失败，请稍后重试'
    });
  }
}; 