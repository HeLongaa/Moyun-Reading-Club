/**
 * 圈子路由
 */
const express = require('express');
const { verifyToken, isAdminOrTeacher } = require('../middlewares/auth');
const groupController = require('../controllers/group.controller');
const FileManager = require('../services/fileManager');

const router = express.Router();
const fileManager = new FileManager();

// 公开路由
router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroupById);
router.get('/:id/members', groupController.getGroupMembers);
router.get('/:id/discussions', groupController.getGroupDiscussions);
router.get('/:id/discussions/:discussionId', groupController.getDiscussionById);

// 需要认证的路由
router.post('/', verifyToken, isAdminOrTeacher, groupController.createGroup);
router.put('/:id', verifyToken, groupController.updateGroup);
router.delete('/:id', verifyToken, groupController.deleteGroup);
router.post('/:id/join', verifyToken, groupController.joinGroup);
router.post('/:id/leave', verifyToken, groupController.leaveGroup);
router.post('/:id/discussions', verifyToken, groupController.createDiscussion);
router.post('/:id/discussions/:discussionId/reply', verifyToken, groupController.replyToDiscussion);
router.delete('/:id/discussions/:discussionId', verifyToken, groupController.deleteDiscussion);
router.get('/:id/pending-members', verifyToken, isAdminOrTeacher, groupController.getPendingMembers);
router.post('/:id/review/:userId/', verifyToken, isAdminOrTeacher, groupController.approveMember);
// 上传圈子图标
router.post(
  '/upload-icon/:id',
  verifyToken,
  isAdminOrTeacher,
  fileManager.getGroupIconUploader().single('icon'),
  groupController.uploadGroupIcon
);

module.exports = router; 