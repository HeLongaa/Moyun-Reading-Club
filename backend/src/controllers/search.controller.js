/**
 * 搜索控制器
 */
const { Op } = require('sequelize');
const { Book, Journal, User, Group } = require('../models');

/**
 * 综合搜索
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.search = async (req, res) => {
  try {
    const { keyword, type, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: '搜索关键词不能为空'
      });
    }
    
    let results = {};
    let total = 0;
    
    // 根据类型搜索不同内容
    switch (type) {
      case 'book':
        // 搜索书籍
        const books = await Book.findAndCountAll({
          where: {
            [Op.or]: [
              { title: { [Op.like]: `%${keyword}%` } },
              { author: { [Op.like]: `%${keyword}%` } },
              { publisher: { [Op.like]: `%${keyword}%` } },
              { description: { [Op.like]: `%${keyword}%` } }
            ]
          },
          offset,
          limit: parseInt(limit),
          order: [['id', 'DESC']]
        });
        results = books.rows;
        total = books.count;
        break;
        
      case 'journal':
        // 搜索书评
        const journals = await Journal.findAndCountAll({
          where: {
            [Op.or]: [
              { title: { [Op.like]: `%${keyword}%` } },
              { first_paragraph: { [Op.like]: `%${keyword}%` } },
              { content: { [Op.like]: `%${keyword}%` } }
            ]
          },
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'account', 'signature']
            },
            {
              model: Book,
              as: 'book',
              attributes: ['id', 'title', 'author']
            }
          ],
          offset,
          limit: parseInt(limit),
          order: [['publish_time', 'DESC']]
        });
        results = journals.rows;
        total = journals.count;
        break;
        
      case 'user':
        // 搜索用户
        const users = await User.findAndCountAll({
          where: {
            [Op.or]: [
              { account: { [Op.like]: `%${keyword}%` } },
              { signature: { [Op.like]: `%${keyword}%` } }
            ]
          },
          attributes: ['id', 'account', 'signature', 'role'],
          offset,
          limit: parseInt(limit),
          order: [['id', 'DESC']]
        });
        results = users.rows;
        total = users.count;
        break;
        
      case 'group':
        // 搜索圈子
        const groups = await Group.findAndCountAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: `%${keyword}%` } },
              { description: { [Op.like]: `%${keyword}%` } }
            ]
          },
          include: [
            {
              model: User,
              as: 'founder',
              attributes: ['id', 'account', 'signature']
            }
          ],
          offset,
          limit: parseInt(limit),
          order: [['establish_time', 'DESC']]
        });
        results = groups.rows;
        total = groups.count;
        break;
        
      default:
        // 默认搜索所有类型
        const [bookResults, journalResults, userResults, groupResults] = await Promise.all([
          // 搜索书籍
          Book.findAll({
            where: {
              [Op.or]: [
                { title: { [Op.like]: `%${keyword}%` } },
                { author: { [Op.like]: `%${keyword}%` } },
                { publisher: { [Op.like]: `%${keyword}%` } }
              ]
            },
            limit: 5,
            order: [['id', 'DESC']]
          }),
          
          // 搜索书评
          Journal.findAll({
            where: {
              [Op.or]: [
                { title: { [Op.like]: `%${keyword}%` } },
                { first_paragraph: { [Op.like]: `%${keyword}%` } }
              ]
            },
            include: [
              {
                model: User,
                as: 'author',
                attributes: ['id', 'account', 'signature']
              },
              {
                model: Book,
                as: 'book',
                attributes: ['id', 'title', 'author']
              }
            ],
            limit: 5,
            order: [['publish_time', 'DESC']]
          }),
          
          // 搜索用户
          User.findAll({
            where: {
              [Op.or]: [
                { account: { [Op.like]: `%${keyword}%` } },
                { signature: { [Op.like]: `%${keyword}%` } }
              ]
            },
            attributes: ['id', 'account', 'signature', 'role'],
            limit: 5,
            order: [['id', 'DESC']]
          }),
          
          // 搜索圈子
          Group.findAll({
            where: {
              [Op.or]: [
                { name: { [Op.like]: `%${keyword}%` } },
                { description: { [Op.like]: `%${keyword}%` } }
              ]
            },
            include: [
              {
                model: User,
                as: 'founder',
                attributes: ['id', 'account', 'signature']
              }
            ],
            limit: 5,
            order: [['establish_time', 'DESC']]
          })
        ]);
        
        results = {
          books: bookResults,
          journals: journalResults,
          users: userResults,
          groups: groupResults
        };
        
        // 计算总数
        total = bookResults.length + journalResults.length + userResults.length + groupResults.length;
        break;
    }
    
    res.status(200).json({
      success: true,
      data: {
        keyword,
        type: type || 'all',
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        results
      }
    });
  } catch (error) {
    console.error('搜索失败:', error);
    res.status(500).json({
      success: false,
      error: '搜索失败，请稍后重试'
    });
  }
}; 