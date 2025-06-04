/**
 * 圈子成员模型
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const Group = require('./group.model');

const GroupUser = sequelize.define('group_user', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Group,
      key: 'id'
    }
  },
  join_time: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '加入时间'
  }
}, {
  tableName: 'group_user',
  timestamps: false,
  comment: '用户-圈子桥接表'
});

// 定义关联关系
GroupUser.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
GroupUser.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

// 定义多对多关系
User.belongsToMany(Group, { through: GroupUser, foreignKey: 'user_id', as: 'groups' });
Group.belongsToMany(User, { through: GroupUser, foreignKey: 'group_id', as: 'members' });

module.exports = GroupUser; 