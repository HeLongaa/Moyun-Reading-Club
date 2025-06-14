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
├── .env                    # 环境变量配置文件
├── .env.example           # 环境变量示例文件
├── package.json          # 项目依赖配置
├── README.md            # 项目说明文档
├── docs/               # 文档目录
│   ├── api-docs.md    # API接口文档
│   └── test-docs.md   # 测试文档
├── src/               # 源代码目录
│   ├── app.js        # 应用主文件
│   ├── index.js      # 入口文件
│   ├── config/       # 配置文件目录
│   │   └── database.js  # 数据库配置
│   ├── controllers/  # 控制器目录
│   │   ├── account.controller.js   # 账号相关控制器
│   │   ├── book.controller.js      # 书籍相关控制器
│   │   ├── chat.controller.js      # 聊天相关控制器
│   │   ├── error.controller.js     # 错误处理控制器
│   │   ├── group.controller.js     # 圈子相关控制器
│   │   ├── homepage.controller.js  # 首页相关控制器
│   │   ├── journal.controller.js   # 书评相关控制器
│   │   ├── message.controller.js   # 消息相关控制器
│   │   ├── profile.controller.js   # 个人资料控制器
│   │   └── public.controller.js    # 公共接口控制器
│   ├── middlewares/  # 中间件目录
│   │   ├── auth.js   # 认证中间件
│   │   └── security.js # 安全检查中间件
│   ├── models/       # 数据模型目录
│   │   ├── book.model.js          # 书籍模型
│   │   ├── chat.model.js          # 聊天模型
│   │   ├── group.model.js         # 圈子模型
│   │   ├── groupUser.model.js     # 圈子成员模型
│   │   ├── groupDiscussion.model.js # 圈子讨论模型
│   │   ├── journal.model.js       # 书评模型
│   │   ├── user.model.js          # 用户模型
│   │   └── index.js               # 模型关联配置
│   ├── routes/       # 路由目录
│   │   ├── account.routes.js      # 账号相关路由
│   │   ├── book.routes.js         # 书籍相关路由
│   │   ├── group.routes.js        # 圈子相关路由
│   │   └── index.js               # 路由聚合
│   ├── services/     # 服务层目录
│   │   ├── apiService.js          # API服务
│   │   └── fileManager.js         # 文件管理服务
│   └── utils/        # 工具函数目录
│       └── initDB.js              # 数据库初始化脚本
└── static/          # 静态资源目录
    ├── bookCover/   # 书籍封面存储
    ├── bookLocal/   # 电子书文件存储
    ├── groupIcon/   # 圈子图标存储
    ├── journalHeader/ # 书评头图存储
    └── profilePhoto/  # 用户头像存储
```

### 目录说明

- **docs/**: 存放项目文档，包括 API 文档和测试文档
- **src/**: 主要源代码目录
  - **config/**: 配置文件，包括数据库等配置
  - **controllers/**: 控制器层，处理具体的业务逻辑
  - **middlewares/**: 中间件，处理认证等通用功能
  - **models/**: 数据模型定义，使用 Sequelize ORM
  - **routes/**: 路由定义，处理 API 路由
  - **services/**: 服务层，处理第三方服务集成
  - **utils/**: 工具函数和辅助脚本
- **static/**: 静态资源存储目录，存放上传的文件

## 功能模块

- 账号管理：注册、登录、找回密码等
- 个人资料：查看和编辑个人资料
- 书籍管理：书籍列表、详情、添加、编辑、删除
- 书评系统：发表书评、评论、点赞
- 圈子系统：创建圈子、加入圈子、发表讨论、回复讨论
- 聊天系统：用户之间的私聊
- 消息通知：书评评论、讨论回复等通知
- 搜索功能：搜索书籍、书评、用户、圈子
- LLM集成：通义千问模型集成，提供书籍推荐、书评生成等功能[开发中]

## 开发记录(20250614 Update)

- 系统架构确定
- 完成基础模块开发
- feat:更新数据库结构，为相关的表添加字段img_path(file_path)存储相关文件，文件的本地内容为/static/{file_style}/..
- bug:修复所有文件/图片的删除逻辑；删除数据库内容的同时删除掉本地文件
- feat:添加所有项目的默认图片/信息展示
- bug:修复用户信息获取逻辑/添加用户头像处理
- bug:修复登录逻辑和权限验证
- feat:新增接口获取用户(已登录)加入的所有圈子
- []todo:增加删除书评功能
- []todo:增加文件的云存储，此功能不影响前端适配
- ...

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
PORT=5001

# 数据库配置
DB_HOST=mysql3.sqlpub.com
DB_PORT=3308
DB_NAME=helong_dev
DB_USER=root_helong
DB_PASSWORD=L9vm8MbcP2Ln72PU

# JWT配置
JWT_SECRET=L9vm8MbcP2Ln72PU
JWT_EXPIRES_IN=7d

# 邮件配置
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password

# 文件存储配置
STATIC_FOLDER=../static

# OpenAI API配置
OPENAI_API_KEY=sk-ux2aiFl2FRglGqDSv7zhDUxWiuK4cm9bR1e8M7QoyEnS73gh
OPENAI_API_URL=https://api.helong.online/v1
OPENAI_API_MODEL=deepseek-ai/DeepSeek-R1-Distill-Qwen-7B

```

### 初始化数据库

[ddl.sql](ddl.sql) 是不包含示例数据的数据库结构
[ddl_demo](ddl_demo.sql) 是包含示例数据的数据库结构文件，(管理员密码为passwd，只有密码是秘文存储，其余信息都是明文写在数据库的)

### 启动服务器

开发模式：

```bash
npm run dev
```

生产模式：

```bash
npm start
```

## API文档

[API文档](./docs/api-docs.md)

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request


