/**
 * 个人资料路由
 */
const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const profileController = require('../controllers/profile.controller');
const groupController = require('../controllers/group.controller');
const FileManager = require('../services/fileManager');

const router = express.Router();
const fileManager = new FileManager();

// 获取用户个人资料
router.get('/:id?', verifyToken, profileController.getProfile);

// 更新个人资料
router.put('/', verifyToken, profileController.updateProfile);

// 上传头像
router.post(
  '/upload-photo',
  verifyToken,
  fileManager.getProfilePhotoUploader().single('photo'),
  profileController.uploadProfilePhoto
);

// 获取用户统计信息
router.get('/stats/get/:id?', verifyToken, profileController.getProfileStats);
// router.get('/stat/:id?', verifyToken, profileController.getUserStats);

module.exports = router;

// 获取用户加入的圈子
router.get('/group/me-join', verifyToken, groupController.getUserGroups);