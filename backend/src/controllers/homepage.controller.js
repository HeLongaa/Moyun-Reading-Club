/**
 * 首页控制器
 */
const { Journal, Book, User, Group } = require('../models');
const ApiService = require('../services/apiService');

// 创建API服务实例
const apiService = new ApiService();

/**
 * 获取首页数据
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getHomepageData = async (req, res) => {
  try {
    // 获取推荐书评
    const featuredJournals = await Journal.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'account', 'signature']
        },
        {
          model: Book,
          as: 'book',
          attributes: ['id', 'title', 'author', 'publisher']
        }
      ],
      limit: 5,
      order: [['publish_time', 'DESC']]
    });
    
    // 获取热门书籍
    const popularBooks = await Book.findAll({
      limit: 10,
      order: [['douban_score', 'DESC']]
    });
    
    // 获取活跃圈子
    const activeGroups = await Group.findAll({
      include: [
        {
          model: User,
          as: 'founder',
          attributes: ['id', 'account', 'signature']
        }
      ],
      limit: 5,
      order: [['establish_time', 'DESC']]
    });
    
    // 获取今日诗词
    const poemResult = await apiService.getTodayPoem();
    const poem = poemResult.success ? poemResult.data : null;
    
    res.status(200).json({
      success: true,
      data: {
        featuredJournals,
        popularBooks,
        activeGroups,
        poem
      }
    });
  } catch (error) {
    console.error('获取首页数据失败:', error);
    res.status(500).json({
      success: false,
      error: '获取首页数据失败，请稍后重试'
    });
  }
}; 