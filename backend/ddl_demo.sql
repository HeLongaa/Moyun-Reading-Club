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

 Date: 10/06/2025 10:32:59
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
-- Records of book
-- ----------------------------
BEGIN;
INSERT INTO `book` (`id`, `isbn`, `title`, `origin_title`, `subtitle`, `author`, `page`, `publish_date`, `publisher`, `description`, `douban_score`, `douban_id`, `bangumi_score`, `bangumi_id`, `type`, `local_path`, `book_icon`) VALUES (1, '9787508696010', '老人与海', 'The Old Man and the Sea', NULL, '[美] 欧内斯特·海明威', 264, '2018-11-01', '中信出版社', '“人可以被毁灭，但不能被打败。”一位老人孤身在海上捕鱼，八十四天一无所获，等终于钓到大鱼，用了两天两夜才将其刺死。返航途中突遭鲨鱼袭击，经过一天一夜的缠斗，大鱼仅存骨架。但老人并未失去希望和信心，休整之后，准备再次出海……\r\n编辑推荐\r\n◆ 海明威等了64年的中文译本终于来了！华语传奇作家鲁羊首次翻译外国经典，译稿出版前在各界名人中广泛流传，好评如潮，口碑爆棚。\r\n◆ 《老人与海》有声演读版音频，李蕾姐姐读经典演绎，用声音为你复活《老人与海》。\r\n◆ 附英文原版，校自海明威1952年亲自授权的美国Scribner原版定本！中英双语，超值典藏。\r\n◆ 国际当红女插画师SlavaShults，首次为中文版《老人与海》专门创作12副海报级手绘插图，带给你前所未有的阅读体验；随书附赠精1张精美明信片（一套10张随机送）。\r\n◆ “所有的原则自天而降：那就是你必须相信魔法，相信美，相信那些在百万个钻石中总结我们的人，相信此刻你手捧的鲁羊先生的译本，就是‘不朽’这个璀璨的词语给出的最好佐证。”——丁玲文学大奖、徐志摩诗歌金奖双奖得主何三坡\r\n◆“鲁羊的译文，其语言的简洁、节奏、语感、画面感和情感浓与淡的交错堪称完美，我感觉是海明威用中文写了《老人与海》，真棒！”——美籍华人知名学者、博士后导师邢若曦\r\n◆ 自1954年荣获诺贝尔文学奖至今，《老人与海》风靡全球，横扫每个必读经典书单，征服了亿万读者；据作家榜官方统计：截至2017年1月，113位诺贝尔文学奖得主作品中文版销量排行榜，海明威高居榜首，总销量突破550万册。\r\n◆ “人可以被毁灭，但不能被打败。”——本书作者海明威（诺贝尔文学奖、普利策奖双奖得主）', 9, '30338134', 8.3, '156705', '文学', '', '/bookCover/default.png');
INSERT INTO `book` (`id`, `isbn`, `title`, `origin_title`, `subtitle`, `author`, `page`, `publish_date`, `publisher`, `description`, `douban_score`, `douban_id`, `bangumi_score`, `bangumi_id`, `type`, `local_path`, `book_icon`) VALUES (2, '9787535447340', '文化苦旅', NULL, '余秋雨三十年散文自选集', '余秋雨', 287, '2014-04-01', '长江文艺出版社', '《文化苦旅》一书于1992年首次出版，是余秋雨先生1980年代在海内外讲学和考察途中写下的作品，是他的第一部文化散文集。全书主要包括两部分，一部分为历史、文化散文，另一部分为回忆散文。甫一面世，该书就以文采飞扬、知识丰厚、见解独到而备受万千读者喜爱。由此开创“历史大散文”一代文风，令世人重拾中华文化价值。他的散文别具一格，见常人所未见，思常人所未思，善于在美妙的文字中一步步将读者带入历史文化长河，启迪哲思，引发情致，具有极高的审美价值和史学、文化价值。书中多篇文章后入选中学教材。但由于此书的重大影响，在为余秋雨先生带来无数光环和拥趸的同时，也带来了数之不尽的麻烦和盗版。誉满天下，“谤”亦随身。余秋雨先生在身心俱疲之下，决定亲自修订、重编此书。\r\n新版《文化苦旅》作为余秋雨先生30年历史文化散文修订自选集，删掉旧版37篇文章中的13篇，新增文章17篇，其中入选教材的《道士塔》《莫高窟》《都江堰》等经典篇目全部经过改写、修订。新版内容与旧版相比，全新和改写的篇目达到三分之二以上，对新老读者都是一场全新的阅读体验和人文享受。堪称余秋雨30年来不懈的文化考察和人生思索的完美结晶。', 8.2, '19940743', NULL, NULL, '文学', '', '/bookCover/default.png');
INSERT INTO `book` (`id`, `isbn`, `title`, `origin_title`, `subtitle`, `author`, `page`, `publish_date`, `publisher`, `description`, `douban_score`, `douban_id`, `bangumi_score`, `bangumi_id`, `type`, `local_path`, `book_icon`) VALUES (3, '9787801656087', '明朝那些事儿（1-9）', NULL, '限量版', '当年明月', NULL, '2009-04-01', '中国海关出版社', '《明朝那些事儿》讲述从1344年到1644年，明朝三百年间的历史。作品以史料为基础，以年代和具体人物为主线，运用小说的笔法，对明朝十七帝和其他王公权贵和小人物的命运进行全景展示，尤其对官场政治、战争、帝王心术着墨最多。作品也是一部明朝政治经济制度、人伦道德的演义。', 9.2, '3674537', NULL, NULL, '历史、地理', '', '/bookCover/default.png');
INSERT INTO `book` (`id`, `isbn`, `title`, `origin_title`, `subtitle`, `author`, `page`, `publish_date`, `publisher`, `description`, `douban_score`, `douban_id`, `bangumi_score`, `bangumi_id`, `type`, `local_path`, `book_icon`) VALUES (5, '9787532776771', '挪威的森林', 'ノルウェイの森', NULL, '[日] 村上春树', 380, '2018-03-01', '上海译文出版社', '《挪威的森林》是日本作家村上春树所著的一部长篇爱情小说，影响了几代读者的青春名作。故事讲述主角渡边纠缠在情绪不稳定且患有精神疾病的直子和开朗活泼的小林绿子之间，苦闷彷徨，最终展开了自我救赎和成长的旅程。彻头彻尾的现实笔法，描绘了逝去的青春风景，小说中弥散着特有的感伤和孤独气氛。自1987年在日本问世后，该小说在年轻人中引起共鸣，风靡不息。上海译文出版社于2018年2月，推出该书的全新纪念版。', 8.5, '27200257', 8, '920', '文学', '', '/bookCover/default.png');
INSERT INTO `book` (`id`, `isbn`, `title`, `origin_title`, `subtitle`, `author`, `page`, `publish_date`, `publisher`, `description`, `douban_score`, `douban_id`, `bangumi_score`, `bangumi_id`, `type`, `local_path`, `book_icon`) VALUES (6, '9787533936020', '月亮与六便士', 'The Moon and Sixpence', NULL, '[英] 威廉·萨默塞特·毛姆', 304, '2017-01-01', '浙江文艺出版社', '“满地都是六便士，他却抬头看见了月亮。”\r\n银行家查尔斯，人到中年，事业有成，为了追求内心隐秘的绘画梦想，突然抛妻别子，弃家出走。他深知：人的每一种身份都是一种自我绑架，唯有失去是通向自由之途。\r\n在异国他乡，他贫病交加，对梦想却愈发坚定执着。他说：我必须画画，就像溺水的人必须挣扎。\r\n在经历种种离奇遭遇后，他来到南太平洋的一座孤岛，同当地一位姑娘结婚生子，成功创作出一系列惊世杰作。就在此时，他被绝症和双目失明击倒，临死之前，他做出了让所有人震惊的决定……\r\n人世漫长得转瞬即逝，有人见尘埃，有人见星辰。查尔斯就是那个终其一生在追逐星辰的人。', 8.7, '26954760', NULL, NULL, '文学', '', '/bookCover/default.png');
INSERT INTO `book` (`id`, `isbn`, `title`, `origin_title`, `subtitle`, `author`, `page`, `publish_date`, `publisher`, `description`, `douban_score`, `douban_id`, `bangumi_score`, `bangumi_id`, `type`, `local_path`, `book_icon`) VALUES (7, '9787020002207', '三国演义-新', '', '', '罗贯中', 500, '1990-01-01', '人民文学出版社', '《三国演义》是中国古典四大名著之一...', 9.5, '1234567', 9, '7654321', '文学', '/bookLocal/1749293013641-78TgDick.pdf', '/bookCover/1749293471250-Bhp12fF1.png');
COMMIT;

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
-- Records of chat
-- ----------------------------
BEGIN;
INSERT INTO `chat` (`id`, `sender_id`, `receiver_id`, `content`, `send_time`, `is_read`) VALUES (1, 10, 9, '你好，很高兴认识你！', '2025-06-07 14:51:39', 0);
COMMIT;

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
-- Records of error
-- ----------------------------
BEGIN;
INSERT INTO `error` (`error_code`, `title`, `title_en`, `content`, `publish_time`, `reference_link`) VALUES (400, '400错误：歪比歪比，歪比巴卜', '[400]Bad Request.', '这表示您的请求有些问题，服务器无法处理(戴夫：歪比巴卜？)。\n如果您在尝试自行访问本站的某个路由，请尝试修改请求方式或检查表单写法。\n如果是在正常访问时触发....好吧，看来后端又在写bug了，请与我们联系以帮忙改进。\n祝您生活愉快。', '2024-04-03 15:49:09', 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/400');
INSERT INTO `error` (`error_code`, `title`, `title_en`, `content`, `publish_time`, `reference_link`) VALUES (403, '403错误：哒咩', '[403]Forbidden.', '这表示您查看的页面不允许您访问。\n通常来讲，这可能是由于您查看的页面要求登录，或需要管理员身份才能查看。\n如果您确信您的访问没有问题，那也许是某些奇怪的bug导致，请与我们联系。\n祝您生活愉快。', '2024-04-03 17:34:24', 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/403');
INSERT INTO `error` (`error_code`, `title`, `title_en`, `content`, `publish_time`, `reference_link`) VALUES (404, '404错误：找不到您请求的资源', '[404]Pages not Found.', '如果您通过输入链接或收藏夹访问到该页面，这说明链接有误或有些文章已被删除或修改，不妨回到主页搜到那篇文章重新保存一下？ (oﾟvﾟ)ノ\n如果您在站内浏览时访问到该页面，这说明我们网站中某些跳转链接有误。இ௰இ您可以通过最下方的联系方式向我们反馈。感谢您对该项目的支持。\n如您还有其他意见/建议，同样欢迎与我们联系。\n祝您生活愉快。', '2023-06-01 12:00:00', 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/404');
INSERT INTO `error` (`error_code`, `title`, `title_en`, `content`, `publish_time`, `reference_link`) VALUES (418, '418错误：我不能为你冲咖啡，因为我只是个茶壶', '[418]I\'m a teapot.', '这本身只是个玩笑，但现在这个响应多数时候表示服务器因爬虫而拒绝请求。也就是说，其实我已经看穿你用的是爬虫了。 ┏ (゜ω゜)=☞\n爬虫是个实用技术，但是下次记得稍微伪装一下，比如加个请求头啥的。 ε=ε=ε=(~￣▽￣)~\n并且注意要限制爬虫的速度，把别人服务器爬崩了可就摊上事了。 :\'(', '2023-06-01 12:00:00', 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/418');
INSERT INTO `error` (`error_code`, `title`, `title_en`, `content`, `publish_time`, `reference_link`) VALUES (500, '500错误：服务器内部错误，暂时无法服务', '[500]Internal Server Error.', '这表示我们的服务器出现了内部错误இ௰இ，后端写的太烂又出问题了....\n后台小哥发现问题后会尽快定位修复，您也可以通过下方的联系方式向我们反馈。感谢您对该项目的支持。\n如您还有其他意见/建议，同样欢迎与我们联系。\n祝您生活愉快。', '2023-06-01 12:00:00', 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/500');
INSERT INTO `error` (`error_code`, `title`, `title_en`, `content`, `publish_time`, `reference_link`) VALUES (503, '503错误：服务器当前不可用', '[503]Service Unavailable.', '这表示服务器目前不可用，可能是我们正在维护，或者租用的某个土豆服务器崩掉了。\n这应该不是我们的锅，但造成不好的使用体验，深感抱歉！', '2023-06-08 15:08:06', 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/503');
COMMIT;

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
-- Records of group
-- ----------------------------
BEGIN;
INSERT INTO `group` (`id`, `name`, `founder_id`, `establish_time`, `description`, `group_icon`) VALUES (3, '三国爱好者', 9, '2025-06-07 12:12:08', '讨论三国相关的书籍和历史', '/groupIcon/1749298794180-HC2zJRqK.png');
COMMIT;

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
-- Records of group_discussion
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of group_discussion_reply
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of group_user
-- ----------------------------
BEGIN;
INSERT INTO `group_user` (`user_id`, `group_id`, `join_time`, `state`) VALUES (9, 3, '2025-06-07 12:12:08', 'agree');
INSERT INTO `group_user` (`user_id`, `group_id`, `join_time`, `state`) VALUES (10, 3, '2025-06-07 12:36:26', 'agree');
COMMIT;

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
-- Records of journal
-- ----------------------------
BEGIN;
INSERT INTO `journal` (`id`, `title`, `first_paragraph`, `content`, `publish_time`, `author_id`, `book_id`, `header`) VALUES (2, '读《三国演义》有感aaaaa', '这本书非常精彩...', '这本书非常精彩aaaa...', '2025-06-07 11:48:24', 9, 7, '/journalHeader/1749297863087-nBCv3RKm.png');
COMMIT;

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
-- Records of journal_comment
-- ----------------------------
BEGIN;
COMMIT;

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
-- Records of journal_like
-- ----------------------------
BEGIN;
COMMIT;

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

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` (`id`, `account`, `password`, `signature`, `email`, `telephone`, `role`, `avatar_path`) VALUES (1, 'MoYun_Admin', '$2b$10$ZOYZ4bfeD6bNReGH2vvv6.bwFDArVyIjOTnKVQXsKbj21Yu1GViFe', '道阻且长', '', '', 'admin', '/profilePhoto/default.png');
INSERT INTO `user` (`id`, `account`, `password`, `signature`, `email`, `telephone`, `role`, `avatar_path`) VALUES (9, 'tea-1', '$2b$10$ZOYZ4bfeD6bNReGH2vvv6.bwFDArVyIjOTnKVQXsKbj21Yu1GViFe', '测试更新', 'tea@mail.com', '19888998888', 'teacher', '/profilePhoto/default.png');
INSERT INTO `user` (`id`, `account`, `password`, `signature`, `email`, `telephone`, `role`, `avatar_path`) VALUES (10, 'stu-1', '$2b$10$838IcZni4sw.Cs69M10bFOV37nytUwsPqMaockU5rPYXSGmJjaqYu', '我是学生', 'helong_001@qq.com', '19888998888', 'student', '/profilePhoto/1749285931536-Eqy4gfCD.png');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
