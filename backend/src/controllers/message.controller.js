/**
 * 消息控制器
 * 用于处理系统通知、书评评论通知等
 */
const { Op } = require('sequelize');
const { JournalComment, GroupDiscussionReply, Journal, GroupDiscussion, User } = require('../models');

/**
 * 获取用户未读消息
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getUnreadMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 获取未读书评评论
    const unreadJournalComments = await JournalComment.findAll({
      where: {
        is_read: false
      },
      include: [
        {
          model: Journal,
          as: 'journal',
          where: {
            author_id: userId
          },
          attributes: ['id', 'title']
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'account', 'signature']
        }
      ],
      order: [['publish_time', 'DESC']]
    });
    
    // 获取未读圈子讨论回复
    const unreadDiscussionReplies = await GroupDiscussionReply.findAll({
      where: {
        is_read: false
      },
      include: [
        {
          model: GroupDiscussion,
          as: 'discussion',
          where: {
            poster_id: userId
          },
          attributes: ['id', 'title', 'group_id']
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'account', 'signature']
        }
      ],
      order: [['reply_time', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: {
        journalComments: unreadJournalComments,
        discussionReplies: unreadDiscussionReplies,
        totalUnread: unreadJournalComments.length + unreadDiscussionReplies.length
      }
    });
  } catch (error) {
    console.error('获取未读消息失败:', error);
    res.status(500).json({
      success: false,
      error: '获取未读消息失败，请稍后重试'
    });
  }
};

/**
 * 标记书评评论为已读
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.markJournalCommentAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;
    
    // 查找评论
    const comment = await JournalComment.findOne({
      where: {
        id: commentId
      },
      include: [
        {
          model: Journal,
          as: 'journal',
          where: {
            author_id: userId
          }
        }
      ]
    });
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: '评论不存在或您没有权限标记'
      });
    }
    
    // 标记为已读
    await comment.update({ is_read: true });
    
    res.status(200).json({
      success: true,
      message: '评论已标记为已读'
    });
  } catch (error) {
    console.error('标记评论为已读失败:', error);
    res.status(500).json({
      success: false,
      error: '标记评论为已读失败，请稍后重试'
    });
  }
};

/**
 * 标记圈子讨论回复为已读
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.markDiscussionReplyAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { replyId } = req.params;
    
    // 查找回复
    const reply = await GroupDiscussionReply.findOne({
      where: {
        id: replyId
      },
      include: [
        {
          model: GroupDiscussion,
          as: 'discussion',
          where: {
            poster_id: userId
          }
        }
      ]
    });
    
    if (!reply) {
      return res.status(404).json({
        success: false,
        error: '回复不存在或您没有权限标记'
      });
    }
    
    // 标记为已读
    await reply.update({ is_read: true });
    
    res.status(200).json({
      success: true,
      message: '回复已标记为已读'
    });
  } catch (error) {
    console.error('标记回复为已读失败:', error);
    res.status(500).json({
      success: false,
      error: '标记回复为已读失败，请稍后重试'
    });
  }
};

/**
 * 标记所有消息为已读
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 标记所有书评评论为已读
    await JournalComment.update(
      { is_read: true },
      {
        where: {
          is_read: false,
          '$journal.author_id$': userId
        },
        include: [
          {
            model: Journal,
            as: 'journal'
          }
        ]
      }
    );
    
    // 标记所有圈子讨论回复为已读
    await GroupDiscussionReply.update(
      { is_read: true },
      {
        where: {
          is_read: false,
          '$discussion.poster_id$': userId
        },
        include: [
          {
            model: GroupDiscussion,
            as: 'discussion'
          }
        ]
      }
    );
    
    res.status(200).json({
      success: true,
      message: '所有消息已标记为已读'
    });
  } catch (error) {
    console.error('标记所有消息为已读失败:', error);
    res.status(500).json({
      success: false,
      error: '标记所有消息为已读失败，请稍后重试'
    });
  }
}; 