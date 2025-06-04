# 墨韵读书交流平台 (nodejs 版本)

> 这是"墨韵"读书交流平台的 nodejs 重构版本，采用现代化的异步特性和 REST API 设计。

[API文档](./docs/api-docs.md)

[测试文档](./docs/test-docs.md)

## 项目简介

墨韵是一个专注于读书交流的在线平台，旨在为书友们提供一个分享读书心得、交流读书体会的空间。本项目是原 Python-Fastapi 版本的完全重构，采用了 nodejs 框架，提供了更好的性能和开发体验。

## 主要特性

- 🚀 基于 nodejs 的现代框架
- 🔐 JWT 认证和基于角色的访问控制
- 📚 完整的书籍管理和书评系统
- 👥 用户社交圈子功能
- 💬 实时消息通知系统
- 📝 支持富文本编辑的帖子系统
- 📊 OpenAPI/Swagger 文档生成
- 🔍 高效的搜索功能

## 技术栈

- **后端框架**: nodejs
- **数据库**: mySQL
- **ORM**: SQLAlchemy (异步)
- **认证**: JWT
- **文档**: OpenAPI/Swagger
- **部署**: Docker or Ubuntu Server

## 项目结构

```
backend/
├── src/                    # 源代码目录
│   ├── config/             # 配置文件
│   ├── controllers/        # 控制器
│   ├── middlewares/        # 中间件
│   ├── models/             # 数据库模型
│   ├── routes/             # 路由
│   ├── services/           # 服务
│   ├── utils/              # 工具函数
│   ├── app.js              # 应用程序配置
│   └── index.js            # 入口文件
├── static/                 # 静态文件目录
│   ├── bookCover/          # 书籍封面
│   ├── groupIcon/          # 圈子图标
│   ├── journalHeader/      # 书评头图
│   └── profilePhoto/       # 用户头像
├── .env                    # 环境变量
└── package.json            # 项目依赖
```

## 功能模块

- 账号管理：注册、登录、找回密码等
- 个人资料：查看和编辑个人资料
- 书籍管理：书籍列表、详情、添加、编辑、删除
- 书评系统：发表书评、评论、点赞
- 圈子系统：创建圈子、加入圈子、发表讨论、回复讨论
- 聊天系统：用户之间的私聊
- 消息通知：书评评论、讨论回复等通知
- 搜索功能：搜索书籍、书评、用户、圈子
- LLM集成：通义千问模型集成，提供书籍推荐、书评生成等功能

## 安装和运行

### 前提条件

- Node.js 14.0+
- MySQL 5.7+

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件，并配置以下环境变量：

```
# 服务器配置
PORT=5000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=moyun
DB_USER=root
DB_PASSWORD=your_password

# JWT配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# 邮件配置
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password

# 文件存储配置
STATIC_FOLDER=../static

# 通义千问API配置
QWEN_API_KEY=your_qwen_api_key
QWEN_API_URL=https://api.example.com/qwen
```

### 初始化数据库

```bash
npm run init-db
```

### 启动服务器

开发模式：

```bash
npm run dev
```

生产模式：

```bash
npm start
```

## API文档[ ⚠️ 简略 ]

### 账号相关

- `POST /api/account/register` - 注册新用户
- `POST /api/account/login` - 用户登录
- `POST /api/account/request-password-reset` - 请求重置密码
- `POST /api/account/reset-password` - 重置密码
- `GET /api/account/me` - 获取当前用户信息
- `POST /api/account/change-password` - 修改密码

### 个人资料相关

- `GET /api/profile/:id?` - 获取用户个人资料
- `PUT /api/profile` - 更新个人资料
- `POST /api/profile/upload-photo` - 上传头像
- `GET /api/profile/stats/:id?` - 获取用户统计信息

### 书籍相关

- `GET /api/book` - 获取书籍列表
- `GET /api/book/:id` - 获取书籍详情
- `POST /api/book` - 创建书籍
- `PUT /api/book/:id` - 更新书籍
- `DELETE /api/book/:id` - 删除书籍
- `POST /api/book/upload-cover` - 上传书籍封面
- `GET /api/book/types` - 获取书籍类型列表

### 书评相关

- `GET /api/journal` - 获取书评列表
- `GET /api/journal/:id` - 获取书评详情
- `POST /api/journal` - 创建书评
- `PUT /api/journal/:id` - 更新书评
- `DELETE /api/journal/:id` - 删除书评
- `GET /api/journal/:id/comments` - 获取书评评论
- `POST /api/journal/:id/comments` - 添加评论
- `DELETE /api/journal/:id/comments/:commentId` - 删除评论
- `POST /api/journal/:id/like` - 点赞/取消点赞书评
- `POST /api/journal/upload-header` - 上传书评头图

### 圈子相关

- `GET /api/group` - 获取圈子列表
- `GET /api/group/:id` - 获取圈子详情
- `POST /api/group` - 创建圈子
- `PUT /api/group/:id` - 更新圈子
- `DELETE /api/group/:id` - 删除圈子
- `POST /api/group/:id/join` - 加入圈子
- `POST /api/group/:id/leave` - 退出圈子
- `GET /api/group/:id/members` - 获取圈子成员列表
- `GET /api/group/:id/discussions` - 获取圈子讨论列表
- `POST /api/group/:id/discussions` - 创建讨论
- `GET /api/group/:id/discussions/:discussionId` - 获取讨论详情
- `POST /api/group/:id/discussions/:discussionId/reply` - 回复讨论
- `DELETE /api/group/:id/discussions/:discussionId` - 删除讨论
- `POST /api/group/upload-icon` - 上传圈子图标

### 聊天相关

- `GET /api/chat` - 获取聊天列表
- `GET /api/chat/:partnerId` - 获取与指定用户的聊天记录
- `POST /api/chat` - 发送消息
- `PUT /api/chat/:messageId/read` - 标记消息为已读
- `GET /api/chat/unread/count` - 获取未读消息数量

### 消息通知相关

- `GET /api/message/unread` - 获取未读消息
- `PUT /api/message/journal-comment/:commentId/read` - 标记书评评论为已读
- `PUT /api/message/discussion-reply/:replyId/read` - 标记圈子讨论回复为已读
- `PUT /api/message/read-all` - 标记所有消息为已读

### 搜索相关

- `GET /api/search` - 综合搜索

### 首页相关

- `GET /api/homepage` - 获取首页数据

### 错误信息相关

- `GET /api/error/:code` - 获取错误信息
- `POST /api/error` - 创建错误信息
- `PUT /api/error/:code` - 更新错误信息
- `DELETE /api/error/:code` - 删除错误信息

### LLM相关

- `POST /api/llm/qwen` - 调用通义千问模型
- `POST /api/llm/recommend-books` - 书籍推荐
- `POST /api/llm/generate-journal` - 书评生成 

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request


