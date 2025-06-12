## 墨韵读书会前端结构说明（2025.6.11 更新）

### 项目简介
本前端基于 Vue3 + Vuex4 + Vue Router4，采用模块化、分层设计，支持教师/学生角色区分，功能包括用户认证、主界面、个人中心、书籍、圈子、书评、讨论、聊天、通知、搜索等，API与后端文档一致。

### 主要目录结构
```plain text
frontend/
├── public/                  # 静态资源
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── api/                 # API服务层（所有后端接口请求）
│   │   ├── auth.api.js
│   │   ├── books.api.js
│   │   ├── circles.api.js
│   │   ├── comments.api.js
│   │   ├── notifications.api.js
│   │   ├── profile.api.js
│   │   ├── search.api.js
│   │   └── websocket.js
│   │
│   ├── assets/              # 静态资源（图片、样式等）
│   │   ├── scss/            # 样式系统（_variables.scss/_mixins.scss/组件样式等）
│   │   └── images/
│   │
│   ├── components/          # 组件库（按功能模块细分）
│   │   ├── auth/            # 认证相关
│   │   ├── books/           # 图书模块
│   │   ├── circles/         # 学习圈系统
│   │   ├── comments/        # 评论系统
│   │   └── ui/              # 基础UI
│   │
│   ├── layouts/             # 页面布局（如 MainLayout.vue, AuthLayout.vue）
│   │
│   ├── router/              # 路由系统
│   │   ├── guards/          # 路由守卫
│   │   ├── routes/          # 各功能模块路由
│   │   └── index.js         # 路由入口
│   │
│   ├── store/               # Vuex状态管理
│   │   ├── modules/         # 各功能模块store
│   │   └── index.js         # Store主文件
│   │
│   ├── utils/               # 工具库
│   │   ├── api.js           # 请求封装
│   │   ├── auth.js          # 认证工具
│   │   ├── cache.js         # 缓存管理
│   │   └── notifications.js # 通知工具
│   │
│   ├── views/               # 主视图页面
│   │   ├── Auth/            # 登录/注册
│   │   ├── Circle/          # 圈子相关
│   │   ├── Books/           # 图书相关
│   │   ├── Profile/         # 个人中心
│   │   ├── Error/           # 错误页
│   │   └── Comments/        # 评论详情等
│   │
│   ├── App.vue              # 根组件
│   └── main.js              # 应用入口
│
├── tests/                   # 测试
│   ├── unit/                # 单元测试
│   └── e2e/                 # 端到端测试
│
├── .env*                    # 环境变量
├── .eslintrc.js             # 代码规范
├── babel.config.js          # Babel配置
└── vue.config.js            # Vue CLI配置
```

### 主要功能模块
- 用户认证（登录/注册/权限控制）
- 主界面（首页/导航/推荐/热门/诗词）
- 个人中心（资料、密码、头像、统计）
- 搜索（书籍、书评、用户、圈子）
- 圈子（列表、详情、成员、讨论、书评、管理）
- 聊天与通知（WebSocket 实时推送）
- 书籍与书评（浏览、分享、互动）

### 近期修订说明
- 明确 layouts、views、components、api、store、router 等分层结构，所有页面和组件按功能归类。
- layouts 目录下已补充 MainLayout.vue、AuthLayout.vue。
- views/Comments/Detail.vue 已补充，避免路由和页面找不到。
- store/modules 目录结构已确认，包含所有核心模块。
- 修复了 SCSS mixin 缺失导致的样式编译报错，按钮样式已内联补充。
- 路由、store、API、权限、导航等主流程已打通。

## 启动整个项目的方法

1. **后端服务启动**
   - 进入后端项目目录（如 `backend/`），根据后端 README 或说明文档，执行后端启动命令（如 `python manage.py runserver`、`npm run start`、`uvicorn main:app` 等）。
   - 确保后端 API 服务正常运行，并监听在 `.env` 文件中配置的地址和端口。

2. **前端服务启动**
   - 进入前端目录：
     ```bash
     cd frontend
     ```
   - 安装依赖（首次启动或依赖变更时）：
     ```bash
     npm install
     # 或
     yarn
     ```
   - 启动开发服务器：
     ```bash
     npm run serve
     # 或
     yarn serve
     ```
   - 默认访问地址为 [http://localhost:8080](http://localhost:8080)

3. **环境变量检查**
   - 确认 `frontend/.env` 文件中 `VUE_APP_API_BASE_URL` 配置为后端实际地址（如 `http://localhost:8000`）。
   - 如需更改端口，可在 `.env` 或 `package.json` 中配置。



## 后端功能未在前端体现的部分（2025.6.12 检查）

### 1. 圈子审核与成员管理
- 后端支持圈子成员审核（如 `/group/:id/agree-join`、`/group/:id/review/:userId/`），但前端未见圈主/管理员审核成员的页面或入口。
- 建议前端在圈子详情页或圈子设置页增加“成员审核”功能。

### 2. 圈子设置/管理
- 后端支持圈子信息编辑、圈子图标上传等（如 `/group/:id/settings`、`/group/upload-icon/:id`），但前端未见圈子设置页面（如 CircleSettings.vue）和图标上传入口。
- 建议前端补充圈子设置页面，支持圈主/管理员修改圈子信息、上传图标。

### 3. 讨论详情与回复
- 后端支持讨论详情、回复、删除（如 `/group/:id/discussions/:discussionId`），但前端未见讨论详情页（如 DiscussionDetail.vue）和回复功能。
- 建议前端补充讨论详情页面，支持查看讨论内容、回复、删除等操作。

### 4. 书评详情页
- 后端 `/journal/:id` 支持书评详情，但前端 Journal/Detail.vue 未在路由和页面中体现（如需完整书评内容、评论、点赞等）。
- 建议前端补充书评详情页，支持评论、点赞、回复等。

### 5. 书评评论详情与互动
- 后端 `/comment/:id` 支持评论详情、点赞、回复，但前端仅有简单评论详情页，未见完整的评论互动功能。
- 建议前端补充评论详情页，支持评论点赞、回复、嵌套展示等。

### 6. 书籍上传与封面上传
- 后端支持书籍内容上传、封面上传（如 `/book/upload/:id`、`/book/upload-cover/:id`），但前端未见上传入口。
- 建议前端在书籍编辑/创建页增加上传书籍文件和封面功能。

### 7. 个人资料统计
- 后端 `/profile/stats/get/:id?` 支持用户统计信息（书评数、圈子数等），但前端个人中心未见统计展示。
- 建议前端在 Profile 页面增加统计信息展示。

### 8. 消息通知细分
- 后端 `/message/unread` 返回书评评论和圈子讨论回复的未读消息，前端通知中心仅简单展示，未区分类型。
- 建议前端通知中心细分展示不同类型通知，并支持跳转到相关详情页。

### 9. 退出圈子、删除圈子
- 后端支持圈子成员退出、圈主删除圈子，但前端部分页面未见对应操作按钮或入口。

### 10. 书籍推荐/AI助手
- 后端 `/public/recommend-books`、`/public/chat` 支持 AI 书籍推荐、AI 聊天，前端未见相关入口和页面。
- 建议前端补充 AI 书籍推荐、AI 聊天助手入口。


