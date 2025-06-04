/**
 * 书籍模型
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  isbn: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true,
    comment: 'ISBN'
  },
  title: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '标题'
  },
  origin_title: {
    type: DataTypes.STRING(128),
    allowNull: true,
    comment: '原作名'
  },
  subtitle: {
    type: DataTypes.STRING(128),
    allowNull: true,
    comment: '副标题'
  },
  author: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '作者'
  },
  page: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '页数'
  },
  publish_date: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '出版日期'
  },
  publisher: {
    type: DataTypes.STRING(32),
    allowNull: true,
    comment: '出版社'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '简介'
  },
  douban_score: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  douban_id: {
    type: DataTypes.STRING(24),
    allowNull: true
  },
  bangumi_score: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  bangumi_id: {
    type: DataTypes.STRING(24),
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM(
      '马列主义、毛泽东思想、邓小平理论',
      '哲学、宗教',
      '社会科学总论',
      '政治、法律',
      '军事',
      '经济',
      '文化、科学、教育、体育',
      '语言、文字',
      '文学',
      '艺术',
      '历史、地理',
      '自然科学总论',
      '数理科学和化学',
      '天文学、地球科学',
      '生物科学',
      '医药、卫生',
      '农业科学',
      '工业技术',
      '交通运输',
      '航空、航天',
      '环境科学、安全科学',
      '综合性图书'
    ),
    allowNull: true,
    comment: '图书类型（参考自《中国图书馆图书分类法》）'
  }
}, {
  tableName: 'book',
  timestamps: false,
  indexes: [
    {
      fields: ['title']
    }
  ]
});

module.exports = Book; 