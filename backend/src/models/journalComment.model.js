/**
 * 书评评论模型
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const Journal = require('./journal.model');

const JournalComment = sequelize.define('journal_comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Primary Key'
  },
  publish_time: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '发表日期'
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '作者ID',
    references: {
      model: User,
      key: 'id'
    }
  },
  journal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '书评ID',
    references: {
      model: Journal,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '评论内容'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否查看'
  }
}, {
  tableName: 'journal_comment',
  timestamps: false
});

// 定义关联关系
JournalComment.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
JournalComment.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journal' });

module.exports = JournalComment; 