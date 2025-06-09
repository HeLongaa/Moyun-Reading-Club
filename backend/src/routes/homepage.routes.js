/**
 * 首页路由
 */
const express = require('express');
const homepageController = require('../controllers/homepage.controller');

const router = express.Router();

// 获取首页数据
router.get('/', homepageController.getHomepageData);

module.exports = router; 