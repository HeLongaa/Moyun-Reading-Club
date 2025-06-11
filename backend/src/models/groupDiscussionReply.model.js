/**
 * 圈子讨论回复模型
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const GroupDiscussion = require('./groupDiscussion.model');

const GroupDiscussionReply = sequelize.define('group_discussion_reply', {
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    comment: '作者ID',
    references: {
      model: User,
      key: 'id'
    }
  },
  discussion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    comment: '讨论贴ID',
    references: {
      model: GroupDiscussion,
      key: 'id'
    }
  },
  reply_time: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true,
    comment: '回复日期'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '回复内容'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否查看'
  }
}, {
  tableName: 'group_discussion_reply',
  timestamps: false
});

// 定义关联关系
GroupDiscussionReply.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
GroupDiscussionReply.belongsTo(GroupDiscussion, { foreignKey: 'discussion_id', as: 'discussion' });

module.exports = GroupDiscussionReply; 