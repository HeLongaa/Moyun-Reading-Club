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

### 常见错误与排查说明

#### 1. 单文件组件缺少 <template> 或 <script>
- 报错示例：
  - `At least one <template> or <script> is required in a single file component.`
- 说明：
  - 某些 .vue 文件（如 layouts/AuthLayout.vue、MainLayout.vue、views/Comments/Detail.vue）内容为空或格式不完整，需至少包含 <template> 或 <script>。
- 解决：
  - 补充基础结构，例如：
    ```vue
    <template>
      <div>内容</div>
    </template>
    <script>
    export default { name: 'xxx' }
    </script>
    ```

#### 2. 单文件组件只能有一个 <script>
- 报错示例：
  - `Single file component can contain only one <script> element`
- 说明：
  - Mentor.vue、Student.vue 等文件中出现多个 <script> 标签，或 <script setup> 与普通 <script> 混用。
- 解决：
  - 合并为一个 <script>，或只保留 <script setup>。

#### 3. 模块找不到
- 报错示例：
  - `Module not found: Error: Can't resolve './modules' in 'src/store'`
- 说明：
  - store/index.js 引用的 modules 目录或文件不存在。
- 解决：
  - 确保 src/store/modules 目录存在且包含所有模块文件。

#### 4. 模板解析失败/Unexpected token
- 报错示例：
  - `Module parse failed: Unexpected token ... You may need an additional loader to handle the result of these loaders.`
- 说明：
  - vue-loader、ts-loader、babel-loader 等依赖版本不兼容，或 .vue 文件语法错误。
- 解决：
  - 升级 @vue/cli-service、vue-loader、typescript 等依赖，检查 .vue 文件语法。

---
如需了解接口调用、Vue3 语法、模块开发等，可参考 src/api、src/views、src/components 及后端 api-docs.md。
请仔细参考Moyun-Reading-Club\backend\docs中的两个参考文档