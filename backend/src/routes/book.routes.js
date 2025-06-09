/**
 * 书籍路由
 */
const express = require('express');
const { verifyToken, isAdmin, isAdminOrTeacher } = require('../middlewares/auth');
const bookController = require('../controllers/book.controller');
const FileManager = require('../services/fileManager');

const router = express.Router();
const fileManager = new FileManager();

// 公开路由
router.get('/', bookController.getBooks);
router.get('/types', bookController.getBookTypes);
router.get('/:id', bookController.getBookById);

// 需要管理员权限的路由
router.post('/', verifyToken, isAdminOrTeacher, bookController.createBook);
router.put('/:id', verifyToken, isAdminOrTeacher, bookController.updateBook);
router.delete('/:id', verifyToken, isAdminOrTeacher, bookController.deleteBook);

// 上传书籍
router.post(
  '/upload/:id',
  verifyToken,
  isAdminOrTeacher,
  fileManager.getBookUploader().single('book'),
  bookController.uploadBook
);
router.post(
  '/upload-cover/:id',
  verifyToken,
  isAdminOrTeacher,
  fileManager.getBookCoverUploader().single('cover'),
  bookController.uploadBookCover
);

module.exports = router; 