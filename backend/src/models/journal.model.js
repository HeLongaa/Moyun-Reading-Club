/**
 * 书评模型
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const Book = require('./book.model');

const Journal = sequelize.define('journal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  first_paragraph: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  publish_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'id'
    }
  },
  header: {
    type: DataTypes.STRING(256),
    allowNull: true,
    defaultValue: '/journalHeader/default.png',
    comment: '书评头图路径'
  }
}, {
  tableName: 'journal',
  timestamps: false
});

// 定义关联关系
Journal.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
Journal.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });

module.exports = Journal; 