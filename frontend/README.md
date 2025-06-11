## 前端
2025.5.18
完成前端框架搭建，
用户认证系统（登录/注册）

学习圈创建/加入功能

图书浏览与分享功能

评论与互动系统

实时通知功能

个人中心与权限管理
完成用户认证系统（登录/注册），学习圈创建/加入功能初步实现
图书浏览与分享功能,评论与互动系统,实时通知功能

但目前对接口等，vue的运行有点不太理解

### 前端框架v1
```plain text
frontend/
├── public/                  # 静态资源
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── api/                 # API服务层
│   │   ├── auth.api.js          # 认证接口
│   │   ├── books.api.js         # 图书接口
│   │   ├── circles.api.js       # 学习圈接口
│   │   ├── comments.api.js      # 评论接口
│   │   ├── notifications.api.js # 通知接口
│   │   └── websocket.js         # WebSocket服务
│   │
│   ├── assets/              # 静态资源
│   │   ├── scss/            # 样式系统
│   │   │   ├── _variables.scss  # 设计变量
│   │   │   ├── _mixins.scss     # 公共混合
│   │   │   ├── components/      # 组件样式
│   │   │   │   ├── _notifications.scss
│   │   │   │   ├── _comments.scss
│   │   │   │   └── _books.scss
│   │   │   └── themes/          # 主题系统
│   │   └── images/           # 图片
│   │
│   ├── components/          # 组件库
│   │   ├── auth/            # 认证相关
│   │   │   ├── RoleGuard.vue        # 角色守卫
│   │   │   └── AuthProvider.vue     # 认证上下文
│   │   │
│   │   ├── books/           # 图书模块
│   │   │   ├── BookCard.vue
│   │   │   ├── BookSearcher.vue
│   │   │   ├── ShareToCircle.vue
│   │   │   └── BookList.vue
│   │   │
│   │   ├── circles/         # 学习圈系统
│   │   │   ├── CircleCreator.vue    # 创建圈子
│   │   │   ├── MemberList.vue       # 成员列表
│   │   │   ├── CircleActivity.vue   # 圈子动态
│   │   │   ├── CircleJoinForm.vue   # 加入圈子
│   │   │   └── PostEditor.vue       # 动态信息流
│   │   │
│   │   ├── comments/        # 评论系统
│   │   │   ├── CommentTree.vue      # 树形评论
│   │   │   ├── CommentNode.vue      # 新增
│   │   │   ├── CommentEditor.vue    # MD编辑器
│   │   │   ├── ReactionSystem.vue   # 互动系统
│   │   │   └── MentionList.vue      # @提及组件
│   │   │
│   │   └── ui/              # 基础UI
│   │       ├── AppLayout.vue        # 主布局
│   │       ├── VirtualScroll.vue    # 虚拟滚动
│   │       └── NotificationSystem/  # 通知系统
│   │           ├── NotificationBell.vue
│   │           ├── NotificationList.vue
│   │           └── NotificationIcon.vue
│   │
│   ├── layouts/             # 页面布局
│   │   ├── MainLayout.vue
│   │   └── AuthLayout.vue
│   │
│   ├── router/              # 路由系统
│   │   ├── guards/          # 路由守卫
│   │   │   ├── authGuard.js      # 认证守卫
│   │   │   └── roleGuard.js      # 角色守卫
│   │   ├── routes/          # 模块化路由
│   │   │   ├── authRoutes.js
│   │   │   ├── circlesRoutes.js
│   │   │   ├── booksRoutes.js
│   │   │   ├── commentsRoutes.js # 新增
│   │   │   └── notificationsRoutes.js # 新增
│   │   └── index.js         # 路由入口
│   │
│   ├── store/               # Vuex状态管理（
│   │   ├── modules/         # 模块化store
│   │   │   ├── auth.js      # 认证状态
│   │   │   ├── books.js     # 图书数据
│   │   │   ├── circles.js   # 圈子数据
│   │   │   ├── comments.js  # 评论数据
│   │   │   └── notifications.js # 通知数据
│   │   └── index.js         # Store主文件
│   │
│   ├── utils/               # 工具库
│   │   ├── auth.js          # 认证工具
│   │   ├── api.js           # 请求封装
│   │   ├── cache.js         # 缓存管理
│   │   ├── pusher.js        # 实时通信
│   │   └── notifications.js # 新增通知工具
│   │
│   ├── views/               # 主视图
│   │   ├── Auth/            # 认证视图
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   │
│   │   ├── Circle/          # 学习圈视图
│   │   │   ├── CircleHome.vue     # 圈子主页
│   │   │   ├── Discussion.vue     # 深度讨论
│   │   │   ├── Library.vue        # 圈子书库
│   │   │   └── Settings.vue       # 新增
│   │   │
│   │   ├── Books/           # 图书视图
│   │   │   ├── Explore.vue       # 发现图书
│   │   │   ├── Detail.vue        # 图书详情
│   │   │   ├── Recommendations.vue # 推荐系统
│   │   │   └── SharedBooks.vue   # 新增共享书籍
│   │   │
│   │   ├── Profile/         # 个人中心
│   │   │   ├── Student.vue      # 学生主页
│   │   │   ├── Mentor.vue       # 导师面板
│   │   │   └── Notifications.vue # 新增通知中心
│   │   │
│   │   └── Error/           # 新增错误页
│   │       ├── Forbidden.vue
│   │       └── NotFound.vue
│   │
│   ├── App.vue              # 根组件（
│   └── main.js              # 应用入口
│
├── tests/                   # 测试配置
│   ├── unit/                # 单元测试
│   │   ├── components/      # 组件测试
│   │   └── store/           # 状态管理测试
│   └── e2e/                 # 端到端测试
│       └── spec/            # 测试用例
│
├── .env                     # 环境变量
├── .env.development         # 开发环境
├── .env.production          # 生产环境
├── .eslintrc.js             # 代码规范
├── babel.config.js          # Babel配置
└── vue.config.js            # Vue CLI配置
```