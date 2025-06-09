/**
 * 公共路由
 */
const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const publicController = require('../controllers/public.controller');
const homepageController = require('../controllers/homepage.controller');
const router = express.Router();

// 所有LLM路由都需要认证
router.use(verifyToken);

// 调用模型
router.post('/chat', publicController.chat);

// 书籍推荐
router.post('/recommend-books', publicController.recommendBooks);

// 书评生成
router.post('/generate-journal', publicController.generateJournal);

// 获取公共数据
router.get('/data', homepageController.getHomepageData);


module.exports = router; 