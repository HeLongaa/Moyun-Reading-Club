/*
 Navicat Premium Dump SQL

 Source Server         : MoYun-dev
 Source Server Type    : MySQL
 Source Server Version : 80403 (8.4.3-SQLPub-0.0.1)
 Source Host           : mysql3.sqlpub.com:3308
 Source Schema         : helong_dev

 Target Server Type    : MySQL
 Target Server Version : 80403 (8.4.3-SQLPub-0.0.1)
 File Encoding         : 65001

 Date: 10/06/2025 10:33:18
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `id` int NOT NULL AUTO_INCREMENT,
  `isbn` varchar(32) NOT NULL COMMENT 'ISBN',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `origin_title` varchar(128) DEFAULT NULL COMMENT '原作名',
  `subtitle` varchar(128) DEFAULT NULL COMMENT '副标题',
  `author` varchar(128) NOT NULL COMMENT '作者',
  `page` int DEFAULT NULL COMMENT '页数',
  `publish_date` date DEFAULT NULL COMMENT '出版日期',
  `publisher` varchar(32) DEFAULT NULL COMMENT '出版社',
  `description` text COMMENT '简介',
  `douban_score` float DEFAULT NULL,
  `douban_id` varchar(24) DEFAULT NULL,
  `bangumi_score` float DEFAULT NULL,
  `bangumi_id` varchar(24) DEFAULT NULL,
  `type` enum('马列主义、毛泽东思想、邓小平理论','哲学、宗教','社会科学总论','政治、法律','军事','经济','文化、科学、教育、体育','语言、文字','文学','艺术','历史、地理','自然科学总论','数理科学和化学','天文学、地球科学','生物科学','医药、卫生','农业科学','工业技术','交通运输','航空、航天','环境科学、安全科学','综合性图书') DEFAULT NULL COMMENT '图书类型（参考自《中国图书馆图书分类法》）',
  `local_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '/bookLocal/default.pdf' COMMENT '书籍的存储位置',
  `book_icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '/bookCover/default.png',
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn` (`isbn`),
  KEY `name` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for chat
-- ----------------------------
DROP TABLE IF EXISTS `chat`;
CREATE TABLE `chat` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '这条信息的ID',
  `sender_id` int NOT NULL COMMENT '发信人ID',
  `receiver_id` int NOT NULL COMMENT '收信人ID',
  `content` text NOT NULL COMMENT '发信内容',
  `send_time` datetime NOT NULL COMMENT '发信时间',
  `is_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否查看',
  PRIMARY KEY (`id`),
  KEY `chat_user_id_fk` (`sender_id`),
  KEY `chat_user_id_fk2` (`receiver_id`),
  CONSTRAINT `chat_user_id_fk` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chat_user_id_fk2` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`id`) ON DELETE SET DEFAULT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for error
-- ----------------------------
DROP TABLE IF EXISTS `error`;
CREATE TABLE `error` (
  `error_code` int NOT NULL,
  `title` varchar(128) NOT NULL,
  `title_en` varchar(128) NOT NULL,
  `content` text NOT NULL,
  `publish_time` datetime NOT NULL,
  `reference_link` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`error_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='该表用于存储定制的HTTP错误响应内容';

-- ----------------------------
-- Table structure for group
-- ----------------------------
DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL COMMENT '圈子的名称',
  `founder_id` int NOT NULL COMMENT '圈子创建者的ID',
  `establish_time` datetime NOT NULL,
  `description` text COMMENT '对该圈子的介绍',
  `group_icon` varchar(255) DEFAULT '/groupIcon/default.png',
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_name_uindex` (`name`),
  KEY `group_user_id_fk` (`founder_id`),
  CONSTRAINT `group_user_id_fk` FOREIGN KEY (`founder_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='圈子';

-- ----------------------------
-- Table structure for group_discussion
-- ----------------------------
DROP TABLE IF EXISTS `group_discussion`;
CREATE TABLE `group_discussion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `poster_id` int NOT NULL,
  `group_id` int NOT NULL,
  `post_time` datetime NOT NULL COMMENT '创建时间',
  `title` varchar(256) NOT NULL COMMENT '帖子的标题',
  `content` text NOT NULL COMMENT '帖子内容',
  `is_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否查看',
  PRIMARY KEY (`id`),
  KEY `group_discussion_group_id_fk` (`group_id`),
  KEY `group_discussion_user_id_fk` (`poster_id`),
  CONSTRAINT `group_discussion_group_id_fk` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `group_discussion_user_id_fk` FOREIGN KEY (`poster_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='讨论贴-圈子桥接表';

-- ----------------------------
-- Table structure for group_discussion_reply
-- ----------------------------
DROP TABLE IF EXISTS `group_discussion_reply`;
CREATE TABLE `group_discussion_reply` (
  `author_id` int NOT NULL COMMENT '作者ID',
  `discussion_id` int NOT NULL COMMENT '讨论贴ID',
  `reply_time` datetime NOT NULL COMMENT '回复日期',
  `content` text NOT NULL COMMENT '回复内容',
  `is_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否查看',
  PRIMARY KEY (`author_id`,`discussion_id`,`reply_time`),
  KEY `discuss_reply_discuss_id_fk` (`discussion_id`),
  CONSTRAINT `group_discussion_reply_group_discussion_id_fk` FOREIGN KEY (`discussion_id`) REFERENCES `group_discussion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `group_discussion_reply_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for group_user
-- ----------------------------
DROP TABLE IF EXISTS `group_user`;
CREATE TABLE `group_user` (
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  `join_time` datetime NOT NULL COMMENT '加入时间',
  `state` enum('agree','wait','refuse') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'wait',
  PRIMARY KEY (`user_id`,`group_id`),
  KEY `group_user_group_id_fk` (`group_id`),
  CONSTRAINT `group_user_group_id_fk` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `group_user_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户-圈子桥接表';

-- ----------------------------
-- Table structure for journal
-- ----------------------------
DROP TABLE IF EXISTS `journal`;
CREATE TABLE `journal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `first_paragraph` text NOT NULL,
  `content` text NOT NULL,
  `publish_time` datetime NOT NULL,
  `author_id` int NOT NULL,
  `book_id` int NOT NULL,
  `header` varchar(255) DEFAULT '/journalHeader/default.png',
  PRIMARY KEY (`id`),
  KEY `journal_user_id_fk` (`author_id`),
  KEY `journal_book_id_fk` (`book_id`),
  CONSTRAINT `journal_book_id_fk` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `journal_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='书评';

-- ----------------------------
-- Table structure for journal_comment
-- ----------------------------
DROP TABLE IF EXISTS `journal_comment`;
CREATE TABLE `journal_comment` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `publish_time` datetime NOT NULL COMMENT '发表日期',
  `author_id` int NOT NULL COMMENT '作者ID',
  `journal_id` int NOT NULL COMMENT '书评ID',
  `content` text NOT NULL COMMENT '评论内容',
  `is_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否查看',
  PRIMARY KEY (`id`),
  KEY `journal_comment_journal_id_fk` (`journal_id`),
  KEY `journal_comment_user_id_fk` (`author_id`),
  CONSTRAINT `journal_comment_journal_id_fk` FOREIGN KEY (`journal_id`) REFERENCES `journal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `journal_comment_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for journal_like
-- ----------------------------
DROP TABLE IF EXISTS `journal_like`;
CREATE TABLE `journal_like` (
  `author_id` int NOT NULL COMMENT '作者ID',
  `journal_id` int NOT NULL COMMENT '书评ID',
  `publish_time` datetime NOT NULL COMMENT '发表日期',
  PRIMARY KEY (`author_id`,`journal_id`),
  KEY `journal_like_journal_id_fk` (`journal_id`),
  CONSTRAINT `journal_like_journal_id_fk` FOREIGN KEY (`journal_id`) REFERENCES `journal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `journal_like_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='一个角色只能给某个书评点1个赞';

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account` varchar(24) NOT NULL COMMENT '用户名',
  `password` text NOT NULL COMMENT '密码',
  `signature` varchar(128) DEFAULT '' COMMENT '签名档',
  `email` varchar(128) DEFAULT NULL COMMENT '邮箱',
  `telephone` varchar(11) DEFAULT NULL COMMENT '联系电话',
  `role` enum('student','teacher','admin') NOT NULL DEFAULT 'student' COMMENT '身份组',
  `avatar_path` varchar(255) DEFAULT '/profilePhoto/default.png' COMMENT '[Add] 头像路径',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_account_uindex` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
