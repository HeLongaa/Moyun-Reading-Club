/**
 * 圈子讨论模型
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const Group = require('./group.model');

const GroupDiscussion = sequelize.define('group_discussion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  poster_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Group,
      key: 'id'
    }
  },
  post_time: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '创建时间'
  },
  title: {
    type: DataTypes.STRING(256),
    allowNull: false,
    comment: '帖子的标题'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '帖子内容'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否查看'
  }
}, {
  tableName: 'group_discussion',
  timestamps: false,
  comment: '讨论贴-圈子桥接表'
});

// 定义关联关系
GroupDiscussion.belongsTo(User, { foreignKey: 'poster_id', as: 'poster' });
GroupDiscussion.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

module.exports = GroupDiscussion; 