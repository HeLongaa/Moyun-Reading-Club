/**
 * 聊天模型
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

const Chat = sequelize.define('chat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '这条信息的ID'
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '发信人ID',
    references: {
      model: User,
      key: 'id'
    }
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '收信人ID',
    references: {
      model: User,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '发信内容'
  },
  send_time: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '发信时间'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否查看'
  }
}, {
  tableName: 'chat',
  timestamps: false
});

// 定义关联关系
Chat.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Chat.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

module.exports = Chat; 