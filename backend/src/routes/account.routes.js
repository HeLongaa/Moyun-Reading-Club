/**
 * 账号路由
 */
const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const accountController = require('../controllers/account.controller');

const router = express.Router();

// 公开路由
router.post('/register', accountController.register);
router.post('/login', accountController.login);
router.post('/request-password-reset', accountController.requestPasswordReset);
router.post('/reset-password', accountController.resetPassword);

// 需要认证的路由
router.get('/me', verifyToken, accountController.getCurrentUser);
router.post('/change-password', verifyToken, accountController.changePassword);

module.exports = router; 