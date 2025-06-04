/**
 * 圈子模型
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

const Group = sequelize.define('group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
    comment: '圈子的名称'
  },
  founder_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '圈子创建者的ID',
    references: {
      model: User,
      key: 'id'
    }
  },
  establish_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '对该圈子的介绍'
  }
}, {
  tableName: 'group',
  timestamps: false,
  comment: '圈子'
});

// 定义关联关系
Group.belongsTo(User, { foreignKey: 'founder_id', as: 'founder' });

module.exports = Group; 