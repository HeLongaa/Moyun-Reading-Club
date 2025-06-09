/**
 * 书评路由
 */
const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const journalController = require('../controllers/journal.controller');
const FileManager = require('../services/fileManager');

const router = express.Router();
const fileManager = new FileManager();

// 公开路由
router.get('/', journalController.getJournals);
router.get('/:id', journalController.getJournalById);
router.get('/:id/comments', journalController.getJournalComments);

// 需要认证的路由
router.post('/', verifyToken, journalController.createJournal);
router.put('/:id', verifyToken, journalController.updateJournal);
router.delete('/:id', verifyToken, journalController.deleteJournal);
router.post('/:id/comments', verifyToken, journalController.addComment);
router.delete('/:id/comments/:commentId', verifyToken, journalController.deleteComment);
router.post('/:id/like', verifyToken, journalController.toggleLike);

// 上传书评头图
router.post(
  '/upload-header/:id',
  verifyToken,
  fileManager.getJournalHeaderUploader().single('header'),
  journalController.uploadJournalHeader
);

module.exports = router; 