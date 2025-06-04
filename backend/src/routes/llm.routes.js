/**
 * LLM路由
 */
const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const llmController = require('../controllers/llm.controller');

const router = express.Router();

// 所有LLM路由都需要认证
router.use(verifyToken);

// 调用通义千问模型
router.post('/qwen', llmController.callQwen);

// 书籍推荐
router.post('/recommend-books', llmController.recommendBooks);

// 书评生成
router.post('/generate-journal', llmController.generateJournal);

module.exports = router; 