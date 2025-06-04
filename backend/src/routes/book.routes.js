/**
 * 书籍路由
 */
const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const bookController = require('../controllers/book.controller');
const FileManager = require('../services/fileManager');

const router = express.Router();
const fileManager = new FileManager();

// 公开路由
router.get('/', bookController.getBooks);
router.get('/types', bookController.getBookTypes);
router.get('/:id', bookController.getBookById);

// 需要管理员权限的路由
router.post('/', verifyToken, isAdmin, bookController.createBook);
router.put('/:id', verifyToken, isAdmin, bookController.updateBook);
router.delete('/:id', verifyToken, isAdmin, bookController.deleteBook);

// 上传书籍封面
router.post(
  '/upload-cover',
  verifyToken,
  isAdmin,
  fileManager.getBookCoverUploader().single('cover'),
  bookController.uploadBookCover
);

module.exports = router; 