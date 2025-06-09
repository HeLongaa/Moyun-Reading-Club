/**
 * 路由索引文件
 * 整合所有路由
 */
const express = require('express');
const accountRoutes = require('./account.routes');
const bookRoutes = require('./book.routes');
const chatRoutes = require('./chat.routes');
const errorRoutes = require('./error.routes');
const groupRoutes = require('./group.routes');
const homepageRoutes = require('./homepage.routes');
const journalRoutes = require('./journal.routes');
const publicRoutes = require('./public.routes');
const messageRoutes = require('./message.routes');
const profileRoutes = require('./profile.routes');
const searchRoutes = require('./search.routes');

const router = express.Router();

// 注册所有路由
router.use('/account', accountRoutes);
router.use('/book', bookRoutes);
router.use('/chat', chatRoutes);
router.use('/error', errorRoutes);
router.use('/group', groupRoutes);
router.use('/homepage', homepageRoutes);
router.use('/journal', journalRoutes);
router.use('/public', publicRoutes);
router.use('/message', messageRoutes);
router.use('/profile', profileRoutes);
router.use('/search', searchRoutes);

module.exports = router; 