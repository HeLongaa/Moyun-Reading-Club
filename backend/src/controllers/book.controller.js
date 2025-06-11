/**
 * 书籍控制器
 */
const { Op, sequelize } = require('sequelize');
const { Book, Journal, JournalComment, JournalLike } = require('../models');
const FileManager = require('../services/fileManager');

// 创建文件管理器实例
const fileManager = new FileManager();

/**
 * 获取书籍列表
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {};
    if (type) {
      where.type = type;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } },
        { publisher: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // 查询书籍
    const { count, rows: books } = await Book.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      order: [['id', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        books
      }
    });
  } catch (error) {
    console.error('获取书籍列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取书籍列表失败，请稍后重试'
    });
  }
};

/**
 * 获取书籍详情
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: '书籍不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('获取书籍详情失败:', error);
    res.status(500).json({
      success: false,
      error: '获取书籍详情失败，请稍后重试'
    });
  }
};

/**
 * 创建书籍
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.createBook = async (req, res) => {
  try {
    const {
      isbn,
      title,
      origin_title,
      subtitle,
      author,
      page,
      publish_date,
      publisher,
      description,
      douban_score,
      douban_id,
      bangumi_score,
      bangumi_id,
      type
    } = req.body;
    
    // 检查必要字段
    if (!isbn || !title || !author) {
      return res.status(400).json({
        success: false,
        error: 'ISBN、书名和作者不能为空'
      });
    }
    
    // 检查ISBN是否已存在
    const existingBook = await Book.findOne({ where: { isbn } });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        error: 'ISBN已存在'
      });
    }
    
    // 创建书籍
    const book = await Book.create({
      isbn,
      title,
      origin_title,
      subtitle,
      author,
      page: page ? parseInt(page) : null,
      publish_date,
      publisher,
      description,
      douban_score: douban_score ? parseFloat(douban_score) : null,
      douban_id,
      bangumi_score: bangumi_score ? parseFloat(bangumi_score) : null,
      bangumi_id,
      type
    });
    
    res.status(201).json({
      success: true,
      message: '书籍创建成功',
      data: book
    });
  } catch (error) {
    console.error('创建书籍失败:', error);
    res.status(500).json({
      success: false,
      error: '创建书籍失败，请稍后重试'
    });
  }
};

/**
 * 上传书籍
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */

exports.uploadBook = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '请选择要上传的书籍'
      });
    }

    // 文件路径
    const filePath = `/bookLocal/${req.file.filename}`;
    const { id } = req.params;
    const book = await Book.findByPk(id);
    await book.update({
      local_path: filePath
    });
    res.status(200).json({
      success: true,
      message: '书籍上传成功',
      data: {
        id: id,
        path: filePath
      }
    });
  } catch (error) {
    console.error('上传书籍失败:', error);
    res.status(500).json({
      success: false,
      error: '上传书籍失败，请稍后重试'
    });
  }
};

/**
 * 更新书籍
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      isbn,
      title,
      origin_title,
      subtitle,
      author,
      page,
      publish_date,
      publisher,
      description,
      douban_score,
      douban_id,
      bangumi_score,
      bangumi_id,
      type
    } = req.body;
    
    // 查找书籍
    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: '书籍不存在'
      });
    }
    
    // 如果更改了ISBN，检查新ISBN是否已存在
    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ where: { isbn } });
      if (existingBook) {
        return res.status(400).json({
          success: false,
          error: '新ISBN已存在'
        });
      }
    }
    
    // 更新书籍
    await book.update({
      isbn: isbn || book.isbn,
      title: title || book.title,
      origin_title: origin_title !== undefined ? origin_title : book.origin_title,
      subtitle: subtitle !== undefined ? subtitle : book.subtitle,
      author: author || book.author,
      page: page ? parseInt(page) : book.page,
      publish_date: publish_date || book.publish_date,
      publisher: publisher !== undefined ? publisher : book.publisher,
      description: description !== undefined ? description : book.description,
      douban_score: douban_score ? parseFloat(douban_score) : book.douban_score,
      douban_id: douban_id !== undefined ? douban_id : book.douban_id,
      bangumi_score: bangumi_score ? parseFloat(bangumi_score) : book.bangumi_score,
      bangumi_id: bangumi_id !== undefined ? bangumi_id : book.bangumi_id,
      type: type || book.type
    });
    
    res.status(200).json({
      success: true,
      message: '书籍更新成功',
      data: book
    });
  } catch (error) {
    console.error('更新书籍失败:', error);
    res.status(500).json({
      success: false,
      error: '更新书籍失败，请稍后重试'
    });
  }
};

/**
 * 删除书籍
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查找书籍
    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: '书籍不存在'
      });
    }
    
    // 使用事务确保数据一致性
    await sequelize.transaction(async (t) => {
      // 1. 查找与该书籍关联的所有书评
      const journals = await Journal.findAll({
        where: { book_id: id },
        transaction: t
      });
      
      // 获取所有书评ID
      const journalIds = journals.map(journal => journal.id);
      
      if (journalIds.length > 0) {
        // 2. 删除这些书评的所有评论
        await JournalComment.destroy({
          where: { 
            journal_id: { [Op.in]: journalIds } 
          },
          transaction: t
        });
        
        // 3. 删除这些书评的所有点赞
        await JournalLike.destroy({
          where: { 
            journal_id: { [Op.in]: journalIds } 
          },
          transaction: t
        });
        
        // 4. 删除所有书评
        await Journal.destroy({
          where: { book_id: id },
          transaction: t
        });
      }
      
      // 5. 删除书籍本身
      await book.destroy({ transaction: t });
    });
    
    // 删除相关文件（如果有）
    if (book.book_icon) {
      try {
        await fileManager.deleteFile(book.book_icon);
      } catch (fileError) {
        console.error('删除书籍封面文件失败:', fileError);
      }
    }
    
    if (book.local_path) {
      try {
        await fileManager.deleteFile(book.local_path);
      } catch (fileError) {
        console.error('删除书籍文件失败:', fileError);
      }
    }
    
    res.status(200).json({
      success: true,
      message: '书籍及其相关内容已删除成功'
    });
  } catch (error) {
    console.error('删除书籍失败:', error);
    res.status(500).json({
      success: false,
      error: '删除书籍失败，请稍后重试'
    });
  }
};

/**
 * 上传书籍封面
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.uploadBookCover = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '请选择要上传的封面'
      });
    }
    const { id } = req.params;
    const book = await Book.findByPk(id);
    // 文件路径
    const filePath = `/bookCover/${req.file.filename}`;
    await book.update({
      book_icon: filePath
    });
    res.status(200).json({
      success: true,
      message: '封面上传成功',
      data: {
        path: filePath
      }
    });
  } catch (error) {
    console.error('上传封面失败:', error);
    res.status(500).json({
      success: false,
      error: '上传封面失败，请稍后重试'
    });
  }
};

/**
 * 获取书籍类型列表
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getBookTypes = async (req, res) => {
  try {
    // 获取Book模型的type字段定义
    const typeEnum = Book.rawAttributes.type.values;
    
    res.status(200).json({
      success: true,
      data: typeEnum
    });
  } catch (error) {
    console.error('获取书籍类型列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取书籍类型列表失败，请稍后重试'
    });
  }
};