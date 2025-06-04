/**
 * 聊天路由
 */
const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

// 所有聊天路由都需要认证
router.use(verifyToken);

// 获取聊天列表
router.get('/', chatController.getChatList);

// 获取与指定用户的聊天记录
router.get('/:partnerId', chatController.getChatHistory);

// 发送消息
router.post('/', chatController.sendMessage);

// 标记消息为已读
router.put('/:messageId/read', chatController.markAsRead);

// 获取未读消息数量
router.get('/unread/count', chatController.getUnreadCount);

module.exports = router; 