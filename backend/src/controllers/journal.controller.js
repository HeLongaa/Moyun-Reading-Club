/**
 * 书评控制器
 */
const { Op, sequelize } = require('sequelize');
const { Journal, JournalComment, JournalLike, User, Book } = require('../models');
const FileManager = require('../services/fileManager');

// 创建文件管理器实例
const fileManager = new FileManager();

/**
 * 获取书评列表
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getJournals = async (req, res) => {
  try {
    const { page = 1, limit = 10, bookId, userId, search } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {};
    if (bookId) {
      where.book_id = bookId;
    }
    if (userId) {
      where.author_id = userId;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { first_paragraph: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // 查询书评
    const { count, rows: journals } = await Journal.findAndCountAll({
      where,
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
    
    // 如果用户已登录，查询用户是否点赞过这些书评
    let userLikes = {};
    if (req.user) {
      const likes = await JournalLike.findAll({
        where: {
          author_id: req.user.id,
          journal_id: journals.map(journal => journal.id)
        }
      });
      
      userLikes = likes.reduce((acc, like) => {
        acc[like.journal_id] = true;
        return acc;
      }, {});
    }
    
    // 查询每个书评的点赞数和评论数
    const journalsWithStats = await Promise.all(journals.map(async (journal) => {
      const likeCount = await JournalLike.count({ where: { journal_id: journal.id } });
      const commentCount = await JournalComment.count({ where: { journal_id: journal.id } });
      
      return {
        ...journal.toJSON(),
        likeCount,
        commentCount,
        isLiked: userLikes[journal.id] || false
      };
    }));
    
    res.status(200).json({
      success: true,
      data: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        journals: journalsWithStats
      }
    });
  } catch (error) {
    console.error('获取书评列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取书评列表失败，请稍后重试'
    });
  }
};

/**
 * 获取书评详情
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getJournalById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const journal = await Journal.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'account', 'signature']
        },
        {
          model: Book,
          as: 'book'
        }
      ]
    });
    
    if (!journal) {
      return res.status(404).json({
        success: false,
        error: '书评不存在'
      });
    }
    
    // 查询点赞数和评论数
    const likeCount = await JournalLike.count({ where: { journal_id: id } });
    const commentCount = await JournalComment.count({ where: { journal_id: id } });
    
    // 如果用户已登录，查询用户是否点赞过这篇书评
    let isLiked = false;
    if (req.user) {
      const like = await JournalLike.findOne({
        where: {
          author_id: req.user.id,
          journal_id: id
        }
      });
      isLiked = !!like;
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...journal.toJSON(),
        likeCount,
        commentCount,
        isLiked
      }
    });
  } catch (error) {
    console.error('获取书评详情失败:', error);
    res.status(500).json({
      success: false,
      error: '获取书评详情失败，请稍后重试'
    });
  }
};

/**
 * 创建书评
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.createJournal = async (req, res) => {
  try {
    const { title, content, book_id } = req.body;
    let { first_paragraph } = req.body;  // 使用 let 声明
    const author_id = req.user.id;
    
    // 检查必要字段
    if (!title || !content || !book_id) {
      return res.status(400).json({
        success: false,
        error: '标题、内容和书籍ID不能为空'
      });
    }
    
    // 如果没有提供首段，则取内容的前100个字符
    if (!first_paragraph) {
      first_paragraph = content.substring(0, 100);
    }
    
    // 检查书籍是否存在
    const book = await Book.findByPk(book_id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: '书籍不存在'
      });
    }
    
    // 创建书评
    const journal = await Journal.create({
      title,
      first_paragraph,
      content,
      book_id,
      author_id,
      publish_time: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: '书评创建成功',
      data: journal
    });
  } catch (error) {
    console.error('创建书评失败:', error);
    res.status(500).json({
      success: false,
      error: '创建书评失败，请稍后重试'
    });
  }
};

/**
 * 更新书评
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.updateJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, first_paragraph, content } = req.body;
    const userId = req.user.id;
    
    // 查找书评
    const journal = await Journal.findByPk(id);
    
    if (!journal) {
      return res.status(404).json({
        success: false,
        error: '书评不存在'
      });
    }
    
    // 检查是否为作者或管理员
    if (journal.author_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限修改这篇书评'
      });
    }
    
    // 更新书评
    await journal.update({
      title: title || journal.title,
      first_paragraph: first_paragraph || journal.first_paragraph,
      content: content || journal.content
    });
    
    res.status(200).json({
      success: true,
      message: '书评更新成功',
      data: journal
    });
  } catch (error) {
    console.error('更新书评失败:', error);
    res.status(500).json({
      success: false,
      error: '更新书评失败，请稍后重试'
    });
  }
};

/**
 * 删除书评
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.deleteJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // 查找书评
    const journal = await Journal.findByPk(id);
    
    if (!journal) {
      return res.status(404).json({
        success: false,
        error: '书评不存在'
      });
    }
    
    // 检查是否为作者或管理员
    if (journal.author_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限删除这篇书评'
      });
    }
    
    // 使用事务确保数据一致性
    await sequelize.transaction(async (t) => {
      // 1. 删除书评的所有评论
      await JournalComment.destroy({
        where: { journal_id: id },
        transaction: t
      });

      // 2. 删除书评的所有点赞
      await JournalLike.destroy({
        where: { journal_id: id },
        transaction: t
      });

      // 3. 删除书评本身
      await journal.destroy({ transaction: t });
    });

    if (journal.header) {
      // 4. 删除书评头图文件
      const headerPath = `${journal.header}`;
      await fileManager.deleteFile(headerPath);
    }
    
    res.status(200).json({
      success: true,
      message: '书评及其相关内容已删除成功'
    });
  } catch (error) {
    console.error('删除书评失败:', error);
    res.status(500).json({
      success: false,
      error: '删除书评失败，请稍后重试'
    });
  }
};

/**
 * 获取书评评论
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getJournalComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // 检查书评是否存在
    const journal = await Journal.findByPk(id);
    if (!journal) {
      return res.status(404).json({
        success: false,
        error: '书评不存在'
      });
    }
    
    // 查询评论
    const { count, rows: comments } = await JournalComment.findAndCountAll({
      where: { journal_id: id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'account', 'signature']
        }
      ],
      offset,
      limit: parseInt(limit),
      order: [['publish_time', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        comments
      }
    });
  } catch (error) {
    console.error('获取书评评论失败:', error);
    res.status(500).json({
      success: false,
      error: '获取书评评论失败，请稍后重试'
    });
  }
};

/**
 * 添加书评评论
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const author_id = req.user.id;
    
    // 检查必要字段
    if (!content) {
      return res.status(400).json({
        success: false,
        error: '评论内容不能为空'
      });
    }
    
    // 检查书评是否存在
    const journal = await Journal.findByPk(id);
    if (!journal) {
      return res.status(404).json({
        success: false,
        error: '书评不存在'
      });
    }
    
    // 创建评论
    const comment = await JournalComment.create({
      journal_id: id,
      author_id,
      content,
      publish_time: new Date(),
      is_read: false
    });
    
    // 获取评论作者信息
    const author = await User.findByPk(author_id, {
      attributes: ['id', 'account', 'signature']
    });
    
    res.status(201).json({
      success: true,
      message: '评论添加成功',
      data: {
        ...comment.toJSON(),
        author
      }
    });
  } catch (error) {
    console.error('添加评论失败:', error);
    res.status(500).json({
      success: false,
      error: '添加评论失败，请稍后重试'
    });
  }
};

/**
 * 删除书评评论
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user.id;
    
    // 检查评论是否存在
    const comment = await JournalComment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: '评论不存在'
      });
    }
    
    // 检查评论是否属于指定的书评
    if (comment.journal_id !== parseInt(id)) {
      return res.status(400).json({
        success: false,
        error: '评论不属于指定的书评'
      });
    }
    
    // 检查是否为评论作者或管理员
    if (comment.author_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限删除这条评论'
      });
    }
    
    // 删除评论
    await comment.destroy();
    
    res.status(200).json({
      success: true,
      message: '评论删除成功'
    });
  } catch (error) {
    console.error('删除评论失败:', error);
    res.status(500).json({
      success: false,
      error: '删除评论失败，请稍后重试'
    });
  }
};

/**
 * 点赞/取消点赞书评
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const author_id = req.user.id;
    
    // 检查书评是否存在
    const journal = await Journal.findByPk(id);
    if (!journal) {
      return res.status(404).json({
        success: false,
        error: '书评不存在'
      });
    }
    
    // 检查是否已点赞
    const existingLike = await JournalLike.findOne({
      where: {
        journal_id: id,
        author_id
      }
    });
    
    if (existingLike) {
      // 取消点赞
      await existingLike.destroy();
      
      res.status(200).json({
        success: true,
        message: '取消点赞成功',
        data: {
          isLiked: false
        }
      });
    } else {
      // 添加点赞
      await JournalLike.create({
        journal_id: id,
        author_id,
        publish_time: new Date()
      });
      
      res.status(200).json({
        success: true,
        message: '点赞成功',
        data: {
          isLiked: true
        }
      });
    }
  } catch (error) {
    console.error('操作点赞失败:', error);
    res.status(500).json({
      success: false,
      error: '操作点赞失败，请稍后重试'
    });
  }
};

/**
 * 上传书评头图
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.uploadJournalHeader = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '请选择要上传的头图'
      });
    }
    
    // 文件路径
    const filePath = `/journalHeader/${req.file.filename}`;
    const { id } = req.params;
    const journal = await Journal.findByPk(id);
    if (!journal) {
      return res.status(404).json({
        success: false,
        error: '书评不存在'
      });
    }
    await journal.update({
      header: filePath
    });
    res.status(200).json({
      success: true,
      message: '头图上传成功',
      data: {
        path: filePath
      }
    });
  } catch (error) {
    console.error('上传头图失败:', error);
    res.status(500).json({
      success: false,
      error: '上传头图失败，请稍后重试'
    });
  }
};