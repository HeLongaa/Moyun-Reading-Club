/**
 * 聊天控制器
 */
const { Chat, User } = require('../models');
const { Op } = require('sequelize');

/**
 * 获取聊天列表
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getChatList = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 查询与当前用户相关的所有聊天记录
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'account', 'signature', 'avatar_path']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'account', 'signature', 'avatar_path']
        }
      ],
      order: [['send_time', 'DESC']]
    });
    
    // 获取聊天对象列表（去重）
    const chatPartners = new Map();
    
    chats.forEach(chat => {
      const partnerId = chat.sender_id === userId ? chat.receiver_id : chat.sender_id;
      const partner = chat.sender_id === userId ? chat.receiver : chat.sender;
      
      if (!chatPartners.has(partnerId)) {
        chatPartners.set(partnerId, {
          user: partner,
          lastMessage: {
            content: chat.content,
            send_time: chat.send_time,
            is_read: chat.is_read,
            is_self: chat.sender_id === userId
          }
        });
      }
    });
    
    // 查询每个聊天对象的未读消息数
    const chatList = await Promise.all(Array.from(chatPartners.values()).map(async (item) => {
      const unreadCount = await Chat.count({
        where: {
          sender_id: item.user.id,
          receiver_id: userId,
          is_read: false
        }
      });
      
      return {
        ...item,
        unreadCount
      };
    }));
    
    // 按最后一条消息时间排序
    chatList.sort((a, b) => new Date(b.lastMessage.send_time) - new Date(a.lastMessage.send_time));
    
    res.status(200).json({
      success: true,
      data: chatList
    });
  } catch (error) {
    console.error('获取聊天列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取聊天列表失败，请稍后重试'
    });
  }
};

/**
 * 获取与指定用户的聊天记录
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    // 检查聊天对象是否存在
    const partner = await User.findByPk(partnerId, {
      attributes: ['id', 'account', 'signature']
    });
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    // 查询聊天记录
    const { count, rows: messages } = await Chat.findAndCountAll({
      where: {
        [Op.or]: [
          {
            sender_id: userId,
            receiver_id: partnerId
          },
          {
            sender_id: partnerId,
            receiver_id: userId
          }
        ]
      },
      offset,
      limit: parseInt(limit),
      order: [['send_time', 'DESC']]
    });
    
    // 标记消息为已读
    await Chat.update(
      { is_read: true },
      {
        where: {
          sender_id: partnerId,
          receiver_id: userId,
          is_read: false
        }
      }
    );
    
    res.status(200).json({
      success: true,
      data: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        partner,
        messages: messages.reverse() // 返回时按时间正序排列
      }
    });
  } catch (error) {
    console.error('获取聊天记录失败:', error);
    res.status(500).json({
      success: false,
      error: '获取聊天记录失败，请稍后重试'
    });
  }
};

/**
 * 发送消息
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.sendMessage = async (req, res) => {
  try {
    const sender_id = req.user.id;
    const { receiver_id, content } = req.body;
    
    // 检查必要字段
    if (!receiver_id || !content) {
      return res.status(400).json({
        success: false,
        error: '接收者ID和消息内容不能为空'
      });
    }
    
    // 检查接收者是否存在
    const receiver = await User.findByPk(receiver_id);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        error: '接收者不存在'
      });
    }
    
    // 不能给自己发消息
    if (sender_id === receiver_id) {
      return res.status(400).json({
        success: false,
        error: '不能给自己发消息'
      });
    }
    
    // 创建消息
    const message = await Chat.create({
      sender_id,
      receiver_id,
      content,
      send_time: new Date(),
      is_read: false
    });
    
    // 获取发送者信息
    const sender = await User.findByPk(sender_id, {
      attributes: ['id', 'account', 'signature']
    });
    
    res.status(201).json({
      success: true,
      message: '消息发送成功',
      data: {
        ...message.toJSON(),
        sender
      }
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    res.status(500).json({
      success: false,
      error: '发送消息失败，请稍后重试'
    });
  }
};

/**
 * 标记消息为已读
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;
    
    // 查找消息
    const message = await Chat.findByPk(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: '消息不存在'
      });
    }
    
    // 检查是否为接收者
    if (message.receiver_id !== userId) {
      return res.status(403).json({
        success: false,
        error: '您没有权限标记这条消息'
      });
    }
    
    // 标记为已读
    await message.update({ is_read: true });
    
    res.status(200).json({
      success: true,
      message: '消息已标记为已读'
    });
  } catch (error) {
    console.error('标记消息为已读失败:', error);
    res.status(500).json({
      success: false,
      error: '标记消息为已读失败，请稍后重试'
    });
  }
};

/**
 * 获取未读消息数量
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 查询未读消息数量
    const unreadCount = await Chat.count({
      where: {
        receiver_id: userId,
        is_read: false
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        unreadCount
      }
    });
  } catch (error) {
    console.error('获取未读消息数量失败:', error);
    res.status(500).json({
      success: false,
      error: '获取未读消息数量失败，请稍后重试'
    });
  }
}; 