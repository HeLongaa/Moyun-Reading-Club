/**
 * 搜索路由
 */
const express = require('express');
const searchController = require('../controllers/search.controller');

const router = express.Router();

// 综合搜索
router.get('/', searchController.search);

module.exports = router; 