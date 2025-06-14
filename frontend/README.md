## 墨韵读书会前端结构说明（2025.6.13 更新）

### 项目简介
本前端基于 Vue3 + Vuex4 + Vue Router4，采用模块化、分层设计，支持教师/学生角色区分，功能包括用户认证、主界面、个人中心、书籍、圈子、书评、讨论、聊天、通知、搜索等，API与后端文档一致。

### 完善后的主要目录结构
```plain text
frontend/
├── public/                        # 静态资源
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── api/                       # API服务层（所有后端接口请求）
│   │   ├── auth.api.js            # 用户认证与登录注册相关接口
│   │   ├── books.api.js           # 书籍相关接口（增删改查、上传内容/封面、类型获取等）
│   │   ├── circles.api.js         # 圈子相关接口（圈子CRUD、成员、审核、讨论、图标上传等）
│   │   ├── comments.api.js        # 书评评论相关接口（评论增删查、点赞、回复等）
│   │   ├── notifications.api.js   # 消息通知相关接口（获取未读、标记已读等）
│   │   ├── profile.api.js         # 个人中心相关接口（获取/修改资料、统计等）
│   │   ├── search.api.js          # 全局搜索接口
│   │   └── websocket.js           # WebSocket 实时通信接口
│   │
│   ├── assets/                    # 静态资源（图片、样式等）
│   │   ├── images/                # 项目图片
│   │   └── scss/                  # 样式系统（_variables.scss/_mixins.scss/组件样式等）
│   │
│   ├── components/                # 组件库（按功能模块细分）
│   │   ├── auth/                  # 认证相关组件
│   │   ├── books/                 # 图书相关组件
│   │   ├── circles/               # 圈子相关组件
│   │   ├── comments/              # 评论相关组件
│   │   └── ui/                    # 通用UI组件
│   │
│   ├── layouts/                   # 页面布局
│   │   ├── MainLayout.vue
│   │   └── AuthLayout.vue
│   │
│   ├── router/                    # 路由系统
│   │   ├── guards/                # 路由守卫
│   │   ├── index.js               # 路由主入口
│   │
│   ├── store/                     # Vuex状态管理
│   │   ├── getter.js
│   │   ├── index.js
│   │   └── modules/               # 各功能模块store
│   │       ├── auth.js
│   │       ├── books.js
│   │       ├── circles.js
│   │       ├── comments.js
│   │       └── notifications.js
│   │
│   ├── utils/                     # 工具库
│   │   ├── api.js                 # axios封装
│   │   ├── auth.js                # 认证工具
│   │   ├── cache.js               # 缓存管理
│   │   └── notifications.js       # 通知工具
│   │
│   ├── views/                     # 主视图页面
│   │   ├── AI/
│   │   │   ├── Chat.vue
│   │   │   └── Recommend.vue
│   │   ├── Auth/
│   │   │   ├── ForgotPassword.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   └── ResetPassword.vue
│   │   ├── Books/
│   │   │   ├── Create.vue
│   │   │   ├── Detail.vue
│   │   │   ├── Edit.vue
│   │   │   ├── Explore.vue
│   │   │   ├── List.vue
│   │   │   └── Upload.vue
│   │   ├── Circle/
│   │   │   ├── CircleHome.vue
│   │   │   ├── Create.vue
│   │   │   ├── Detail.vue
│   │   │   ├── Discussion.vue
│   │   │   ├── DiscussionDetail.vue
│   │   │   ├── Edit.vue
│   │   │   ├── Join.vue
│   │   │   ├── Library.vue
│   │   │   ├── List.vue
│   │   │   ├── Manage.vue
│   │   │   ├── Members.vue
│   │   │   ├── Settings.vue
│   │   │   └── CircleMemberReview.vue
│   │   ├── Comments/
│   │   │   └── CommentDetail.vue
│   │   ├── Error/
│   │   │   └── NotFound.vue
│   │   ├── Journal/
│   │   │   ├── Detail.vue
│   │   │   ├── Edit.vue
│   │   │   └── List.vue
│   │   ├── Profile/
│   │   │   ├── Edit.vue
│   │   │   ├── Mentor.vue
│   │   │   ├── Notifications.vue
│   │   │   ├── Stats.vue
│   │   │   ├── Student.vue
│   │   │   └── index.vue
│   │   ├── Chat/
│   │   │   └── ChatWindow.vue
│   │   ├── Home.vue
│   │   └── Search.vue
│   │
│   ├── App.vue                  # 根组件
│   └── main.js                  # 应用入口
│
├── tests/                       # 测试
│   ├── unit/                    # 单元测试
│   └── e2e/                     # 端到端测试
│
├── .env*                        # 环境变量
├── .eslintrc.js                 # 代码规范
├── babel.config.js              # Babel配置
└── vue.config.js                # Vue CLI配置
```

### 主要功能模块
- 用户认证（登录/注册/权限控制）
- 主界面（首页/导航/推荐/热门/诗词）
- 个人中心（资料、密码、统计）
- 搜索（书籍、书评、用户、圈子）
- 圈子（列表、详情、成员、讨论、书评、管理）
- 书籍与书评（浏览、分享、互动）

### 近期修订说明
- 明确 layouts、views、components、api、store、router 等分层结构，所有页面和组件按功能归类。
- layouts 目录下已补充 MainLayout.vue、AuthLayout.vue。
- views/Comments/Detail.vue 已补充，避免路由和页面找不到。
- store/modules 目录结构已确认，包含所有核心模块。
- 修复了 SCSS mixin 缺失导致的样式编译报错，按钮样式已内联补充。
- 路由、store、API、权限、导航等主流程已打通。

#### 2025.6.13 前端主要修订内容
- 登录、注册、主界面、找回密码、重置密码等页面统一采用背景图 `src/assests/images/moyun.png`，并修正所有路径为 `assests`。
- 主界面（Home.vue）优化为横向滑动卡片区，支持展示推荐书评、热门书籍、活跃圈子、今日诗词、AI推荐、AI助手、上传书籍、个人统计等多个功能区。
- 书籍、圈子、个人中心等页面补充了图片（如书籍封面、圈子图标、用户头像）渲染逻辑，确保图片正确调用后端返回的 URL。
- 书籍详情页支持渲染书籍内容为阅读视图。
- 圈子详情页支持圈子图标展示。
- 个人中心支持头像和用户信息展示。
- 修复了因 assests 路径拼写导致的图片无法加载问题。
- 优化了注册、登录、主界面等页面的字体、布局和美观性。
- 个人中心补充了用户统计信息展示。
- 通知中心细分消息类型并支持跳转详情。
- 其他功能区块和页面样式细节优化。

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

---

### 各 Vue 页面内容简要说明

#### views/Home.vue
- 项目首页，展示推荐书评、热门书籍、活跃圈子、今日诗词、AI推荐、AI助手、上传书籍等功能区块，支持横向滑动卡片展示。

#### views/Search.vue
- 全站综合搜索页面，支持按关键字检索书籍、书评、用户、圈子，并分类展示结果。

#### views/Auth/Login.vue
- 用户登录页面，输入账号密码进行身份验证。

#### views/Auth/Register.vue
- 用户注册页面，填写基本信息完成注册。

#### views/Auth/ForgotPassword.vue
- 忘记密码页面，支持通过邮箱找回密码。

#### views/Auth/ResetPassword.vue
- 重置密码页面，用户通过邮箱验证码重置新密码。

#### views/Profile/index.vue
- 个人中心主页，展示用户基本信息、操作入口（如编辑资料、退出登录）。

#### views/Profile/Edit.vue
- 编辑个人资料页面，支持修改邮箱、手机号、个性签名等信息。

#### views/Profile/Student.vue
- 学生用户个人中心，展示个人信息和我发表的书评。

#### views/Profile/Mentor.vue
- 导师用户个人中心，展示导师信息。

#### views/Profile/Stats.vue
- 个人统计页面，展示书评数、点赞数、评论数、圈子数等统计信息。

#### views/Profile/Notifications.vue
- 消息通知页面，展示未读消息、评论、圈子讨论等通知。

#### views/Books/List.vue
- 书籍列表页，展示所有书籍，支持筛选、分页。

#### views/Books/Detail.vue
- 书籍详情页，展示书籍详细信息、简介、评分、封面、相关书评等。

#### views/Books/Create.vue
- 发布新书籍页面，填写书籍信息并上传内容、封面。

#### views/Books/Edit.vue
- 编辑书籍信息页面，支持修改书籍详情、上传内容和封面。

#### views/Books/Upload.vue
- 上传电子书文件页面，供管理员或教师上传书籍内容。

#### views/Books/Explore.vue
- 书籍探索页，按类型、标签等方式浏览书籍。

#### views/Journal/List.vue
- 书评列表页，展示所有书评，支持筛选、分页。

#### views/Journal/Detail.vue
- 书评详情页，展示完整书评内容、评论、点赞等互动。

#### views/Journal/Edit.vue
- 编辑书评页面，支持修改书评内容、头图。

#### views/Comments/CommentDetail.vue
- 评论详情页，展示评论内容、回复、点赞、嵌套回复等。

#### views/Circle/List.vue
- 圈子列表页，展示所有圈子，支持筛选、只看我管理的圈子。

#### views/Circle/Detail.vue
- 圈子详情页，展示圈子信息、成员、讨论、书库等入口。

#### views/Circle/CircleHome.vue
- 圈子主页，包含圈子基本信息、导航菜单（讨论区、书库、成员、设置等）。

#### views/Circle/Create.vue
- 新建圈子页面，填写圈子名称、简介、上传图标。

#### views/Circle/Edit.vue
- 编辑圈子信息页面，支持圈主/管理员修改圈子信息、上传图标。

#### views/Circle/Join.vue
- 加入圈子页面，选择导师或圈子申请加入。

#### views/Circle/Library.vue
- 圈子书库页面，展示圈子内共享的书籍。

#### views/Circle/Members.vue
- 圈子成员列表页，展示所有成员及其信息。

#### views/Circle/Discussion.vue
- 圈子讨论区主页，展示所有讨论主题。

#### views/Circle/DiscussionList.vue
- 圈子讨论主题列表页，支持新建、浏览讨论。

#### views/Circle/DiscussionDetail.vue
- 讨论详情页，展示讨论内容、回复、删除等操作。

#### views/Circle/Manage.vue
- 圈子管理页面，圈主/管理员可管理圈子成员、审核申请等。

#### views/Circle/Settings.vue
- 圈子设置页面，支持圈主/管理员修改圈子设置、成员审核等。

#### views/Circle/CircleMemberReview.vue
- 圈子成员审核页面，圈主/管理员审核新成员申请。

#### views/Error/NotFound.vue
- 404页面，访问不存在的路由时显示。

#### views/AI/Chat.vue
- AI 聊天助手页面，支持与AI进行对话。

#### views/AI/Recommend.vue
- AI 书籍推荐页面，根据用户兴趣推荐书籍。

#### views/Chat/ChatWindow.vue
- 实时聊天窗口，支持圈内成员或好友间聊天。

---

> 以上为每个主要 Vue 页面功能简要说明，具体实现细节请参考对应源码文件。


