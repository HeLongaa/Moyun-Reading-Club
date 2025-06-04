/**
 * 消息路由
 */
const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const messageController = require('../controllers/message.controller');

const router = express.Router();

// 所有消息路由都需要认证
router.use(verifyToken);

// 获取未读消息
router.get('/unread', messageController.getUnreadMessages);

// 标记书评评论为已读
router.put('/journal-comment/:commentId/read', messageController.markJournalCommentAsRead);

// 标记圈子讨论回复为已读
router.put('/discussion-reply/:replyId/read', messageController.markDiscussionReplyAsRead);

// 标记所有消息为已读
router.put('/read-all', messageController.markAllAsRead);

module.exports = router; 