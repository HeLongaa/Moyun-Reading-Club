/**
 * 错误路由
 */
const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const errorController = require('../controllers/error.controller');

const router = express.Router();

// 公开路由
router.get('/:code', errorController.getErrorInfo);

// 需要管理员权限的路由
router.post('/', verifyToken, isAdmin, errorController.createErrorInfo);
router.put('/:code', verifyToken, isAdmin, errorController.updateErrorInfo);
router.delete('/:code', verifyToken, isAdmin, errorController.deleteErrorInfo);

module.exports = router; 