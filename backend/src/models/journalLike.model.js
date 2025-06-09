/**
 * 书评点赞模型
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const Journal = require('./journal.model');

const JournalLike = sequelize.define('journal_like', {
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
  journal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    comment: '书评ID',
    references: {
      model: Journal,
      key: 'id'
    }
  },
  publish_time: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '发表日期'
  }
}, {
  tableName: 'journal_like',
  timestamps: false,
  comment: '一个角色只能给某个书评点1个赞'
});

// 定义关联关系
JournalLike.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
JournalLike.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journal' });

module.exports = JournalLike; 